import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Role, SOCKET_EVENTS } from '@zync/shared';
import { redisPubClient, redisSubClient } from '../config/redis';
import { Room } from './classes/Room';
import { Participant } from './classes/Participant';
import { MessageHandler } from './classes/MessageHandler';
import { roomsService } from '../modules/rooms/rooms.service';
import { logger } from '../utils/logger';

export let socketServerInstance: SocketServer | null = null;
export const getSocketServer = (): SocketServer | null => socketServerInstance;

export class SocketServer {
  private io: SocketIOServer;
  private rooms: Map<string, Room> = new Map(); // roomCode -> Room
  private socketToRoomMap: Map<string, string> = new Map(); // socketId -> roomCode

  constructor(httpServer: HttpServer) {
    socketServerInstance = this;
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 20000,
      pingInterval: 10000
    });

    // Wire Redis Adapter if clients are connected
    if (redisPubClient && redisSubClient) {
      try {
        this.io.adapter(createAdapter(redisPubClient, redisSubClient));
        logger.info('Socket.IO Redis adapter enabled for horizontal multi-instance scaling');
      } catch (err) {
        logger.warn('Failed to attach Redis adapter to Socket.IO:', err);
      }
    }

    this.setupListeners();
    this.startPeriodicSync();
  }

  public getParticipantCount(roomCode: string): number {
    const normalized = roomCode.toUpperCase().trim();
    return this.rooms.get(normalized)?.getParticipantCount() || 0;
  }

  public getActiveRoomCodes(): string[] {
    return Array.from(this.rooms.keys());
  }

  private setupListeners(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      let currentRoom: Room | undefined;
      let currentParticipant: Participant | undefined;

      const getContext = () => ({
        room: currentRoom,
        participant: currentParticipant
      });

      // Register generic message handlers
      MessageHandler.registerHandlers(socket, getContext);

      // Join room lifecycle
      socket.on(SOCKET_EVENTS.JOIN_ROOM, async (payload: {
        roomId: string; // code or ID
        userId?: string;
        username?: string;
        avatar?: string;
      }) => {
        try {
          const roomCode = payload.roomId.toUpperCase().trim();

          // Fetch or restore room from database / memory
          let room = this.rooms.get(roomCode);
          if (!room) {
            const dbRoom = await roomsService.getRoomByCode(roomCode);
            if (!dbRoom) {
              socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
              return;
            }

            room = new Room({
              id: dbRoom.id,
              code: dbRoom.code,
              name: dbRoom.name,
              hostId: dbRoom.hostId,
              currentVideoId: dbRoom.currentVideoId
            });
            this.rooms.set(roomCode, room);
          }

          currentRoom = room;

          const userId = payload.userId || 'guest_' + Math.random().toString(36).substring(2, 8);
          const username = payload.username || 'Guest_' + Math.random().toString(36).substring(2, 6);
          const avatar = payload.avatar || 'Comet';

          // Assign Role: Host if creator, else Viewer (default for joiners per §7.2)
          let assignedRole = Role.VIEWER;
          if (room.hostId === userId || room.getParticipantCount() === 0) {
            assignedRole = Role.HOST;
            room.hostId = userId;
          }

          const participant = new Participant({
            socket,
            userId,
            username,
            avatar,
            role: assignedRole
          });

          currentParticipant = participant;
          this.socketToRoomMap.set(socket.id, roomCode);

          room.addParticipant(participant);

          // Emit initial sync state to new joiner
          socket.emit(SOCKET_EVENTS.SYNC_STATE, {
            playState: room.playState,
            currentTime: room.getCalculatedCurrentTime(),
            videoId: room.currentVideoId
          });

          // Send recent chat messages (non-Viewers only)
          const recentChat = room.getRecentChatFor(participant);
          if (recentChat.length > 0) {
            for (const msg of recentChat) {
              socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, msg);
            }
          }

          // Broadcast tailored role-filtered participant lists
          room.broadcastParticipantListUpdate();

          // Broadcast user_joined to others
          socket.to(room.code).emit(SOCKET_EVENTS.USER_JOINED, {
            userId: participant.userId,
            username: participant.username,
            role: participant.role
          });
        } catch (err: any) {
          logger.error('Error in join_room:', err);
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join room' });
        }
      });

      // Leave room lifecycle
      socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
        this.handleDisconnect(socket, true);
        currentRoom = undefined;
        currentParticipant = undefined;
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
        this.handleDisconnect(socket, false);
      });
    });
  }

  private handleDisconnect(socket: Socket, isExplicitLeave: boolean = false): void {
    const roomCode = this.socketToRoomMap.get(socket.id);
    if (!roomCode) return;

    this.socketToRoomMap.delete(socket.id);
    const room = this.rooms.get(roomCode);
    if (!room) return;

    const removed = room.removeParticipant(socket.id);
    if (removed) {
      this.io.to(room.code).emit(SOCKET_EVENTS.USER_LEFT, {
        userId: removed.userId,
        username: removed.username
      });

      // Host departure logic:
      // If host leaves and there are moderators, host power is given to any one random moderator.
      // But if no moderator, the room will be deleted.
      const wasHost = (removed.role === Role.HOST || room.hostId === removed.userId);

      if (wasHost && room.getParticipantCount() > 0) {
        const moderators = room.getAllParticipants().filter((p) => p.role === Role.MODERATOR);

        if (moderators.length > 0) {
          // Select one random moderator and promote to Host
          const selectedMod = moderators[Math.floor(Math.random() * moderators.length)];
          selectedMod.role = Role.HOST;
          room.hostId = selectedMod.userId;

          logger.info(`Host ${removed.username} left room ${roomCode}. Random moderator ${selectedMod.username} promoted to Host.`);

          // Update host in DB
          roomsService.updateRoomHost(roomCode, selectedMod.userId).catch((err) => {
            logger.warn(`Failed to update room host in DB for ${roomCode}:`, err);
          });

          // Notify room of host transfer
          this.io.to(room.code).emit(SOCKET_EVENTS.HOST_TRANSFERRED, {
            newHostId: selectedMod.userId,
            newHostUsername: selectedMod.username
          });

          // Post system notification message into chat
          room.addSystemMessage(`👑 The Host left. ${selectedMod.username} was chosen as the new Host!`);

          room.broadcastParticipantListUpdate();
        } else {
          // No moderator in room -> the room will be deleted!
          logger.info(`Host ${removed.username} left room ${roomCode} with no moderators. Deleting room.`);

          // Inform remaining participants that the room has ended
          for (const remaining of room.getAllParticipants()) {
            remaining.socket.emit(SOCKET_EVENTS.KICKED, {
              reason: 'The host has left the room and no moderators were available. The watch party has ended.'
            });
            this.socketToRoomMap.delete(remaining.socket.id);
            remaining.socket.leave(roomCode);
          }

          // Delete immediately from memory and database
          this.rooms.delete(roomCode);
          roomsService.deleteRoomByCode(roomCode).catch((err) => {
            logger.warn(`Failed to delete room ${roomCode}:`, err);
          });

          return;
        }
      } else {
        room.broadcastParticipantListUpdate();
      }

      // If room is empty, delete it
      if (room.getParticipantCount() === 0) {
        if (isExplicitLeave) {
          // Explicit leave: delete immediately from memory and database
          this.rooms.delete(roomCode);
          roomsService.deleteRoomByCode(roomCode).catch((err) => {
            logger.warn(`Failed to delete empty room ${roomCode}:`, err);
          });
          logger.info(`Deleted empty room on explicit leave: ${roomCode}`);
        } else {
          // Socket disconnect (e.g. reload or temporary network drop): 15s grace period
          setTimeout(() => {
            const current = this.rooms.get(roomCode);
            if (!current || current.getParticipantCount() === 0) {
              this.rooms.delete(roomCode);
              roomsService.deleteRoomByCode(roomCode).catch((err) => {
                logger.warn(`Failed to delete empty room ${roomCode}:`, err);
              });
              logger.info(`Deleted empty room after grace period: ${roomCode}`);
            }
          }, 15000);
        }
      }
    }
  }

  // Periodic drift correction every 5 seconds
  private startPeriodicSync(): void {
    setInterval(() => {
      for (const room of this.rooms.values()) {
        if (room.playState === 'playing' && room.getParticipantCount() > 0) {
          room.broadcastSyncState();
        }
      }
    }, 5000);
  }
}
