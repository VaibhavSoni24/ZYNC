import { PlayState, Role, ChatMessageDto, ParticipantDto, isParticipantVisible, SOCKET_EVENTS } from '@zync/shared';
import { Participant } from './Participant';
import { logger } from '../../utils/logger';

export class Room {
  public id: string;
  public code: string;
  public name: string;
  public hostId: string;
  public currentVideoId: string = 'dQw4w9WgXcQ';
  public playState: PlayState = 'paused';
  public currentTime: number = 0;
  public lastActionTimestamp: number = Date.now();

  private participants: Map<string, Participant> = new Map(); // socketId -> Participant
  private chatHistory: ChatMessageDto[] = [];
  private readonly MAX_CHAT_HISTORY = 100;

  constructor(params: {
    id: string;
    code: string;
    name: string;
    hostId: string;
    currentVideoId?: string;
  }) {
    this.id = params.id;
    this.code = params.code;
    this.name = params.name;
    this.hostId = params.hostId;
    if (params.currentVideoId) {
      this.currentVideoId = params.currentVideoId;
    }
  }

  // Participants management
  addParticipant(participant: Participant): void {
    this.participants.set(participant.socket.id, participant);
    participant.socket.join(this.code);
    logger.info(`Participant ${participant.username} (${participant.role}) joined room ${this.code}`);
  }

  removeParticipant(socketId: string): Participant | undefined {
    const participant = this.participants.get(socketId);
    if (participant) {
      participant.socket.leave(this.code);
      this.participants.delete(socketId);
      logger.info(`Participant ${participant.username} left room ${this.code}`);
    }
    return participant;
  }

  getParticipantBySocketId(socketId: string): Participant | undefined {
    return this.participants.get(socketId);
  }

  getParticipantByUserId(userId: string): Participant | undefined {
    for (const p of this.participants.values()) {
      if (p.userId === userId) return p;
    }
    return undefined;
  }

  getAllParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }

  getParticipantCount(): number {
    return this.participants.size;
  }

  // Role-filtered participant lists for server-side security (§7.2)
  getFilteredParticipantsFor(observer: Participant): ParticipantDto[] {
    const list: ParticipantDto[] = [];
    for (const target of this.participants.values()) {
      const isSelf = target.userId === observer.userId;
      if (isParticipantVisible(observer.role, target.role, isSelf)) {
        list.push(target.toDto());
      }
    }
    return list;
  }

  broadcastParticipantListUpdate(): void {
    for (const participant of this.participants.values()) {
      const filtered = this.getFilteredParticipantsFor(participant);
      participant.socket.emit(SOCKET_EVENTS.ROLE_ASSIGNED, {
        participants: filtered
      });
    }
  }

  // Playback sync calculation
  getCalculatedCurrentTime(): number {
    if (this.playState === 'playing') {
      const elapsedSeconds = (Date.now() - this.lastActionTimestamp) / 1000;
      return Math.max(0, this.currentTime + elapsedSeconds);
    }
    return this.currentTime;
  }

  setPlayback(state: PlayState, time?: number): void {
    if (time !== undefined && !isNaN(time)) {
      this.currentTime = Math.max(0, time);
    } else if (this.playState === 'playing') {
      this.currentTime = this.getCalculatedCurrentTime();
    }
    this.playState = state;
    this.lastActionTimestamp = Date.now();
  }

  setVideoId(videoId: string): void {
    this.currentVideoId = videoId;
    this.currentTime = 0;
    this.playState = 'paused';
    this.lastActionTimestamp = Date.now();
  }

  // Broadcast sync state to all members
  broadcastSyncState(): void {
    const payload = {
      playState: this.playState,
      currentTime: this.getCalculatedCurrentTime(),
      videoId: this.currentVideoId
    };

    for (const p of this.participants.values()) {
      p.socket.emit(SOCKET_EVENTS.SYNC_STATE, payload);
    }
  }

  // Chat management (hidden from Viewers)
  addChatMessage(sender: Participant, text: string): ChatMessageDto {
    const message: ChatMessageDto = {
      id: 'msg_' + Math.random().toString(36).substring(2, 10),
      userId: sender.userId,
      username: sender.username,
      avatar: sender.avatar,
      message: text.trim(),
      ts: Date.now()
    };

    this.chatHistory.push(message);
    if (this.chatHistory.length > this.MAX_CHAT_HISTORY) {
      this.chatHistory.shift();
    }

    // Broadcast only to non-Viewers
    for (const p of this.participants.values()) {
      if (p.role !== Role.VIEWER) {
        p.socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, message);
      }
    }

    return message;
  }

  addSystemMessage(text: string): ChatMessageDto {
    const message: ChatMessageDto = {
      id: 'sys_' + Math.random().toString(36).substring(2, 10),
      userId: 'system',
      username: 'System',
      avatar: 'Zyncie',
      message: text.trim(),
      ts: Date.now()
    };

    this.chatHistory.push(message);
    if (this.chatHistory.length > this.MAX_CHAT_HISTORY) {
      this.chatHistory.shift();
    }

    for (const p of this.participants.values()) {
      if (p.role !== Role.VIEWER) {
        p.socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, message);
      }
    }

    return message;
  }

  getRecentChatFor(observer: Participant): ChatMessageDto[] {
    if (observer.role === Role.VIEWER) return [];
    return [...this.chatHistory];
  }

  // Reactions (rate limited, hidden from Viewers)
  broadcastReaction(sender: Participant, emoji: string): void {
    const payload = {
      id: 'rx_' + Math.random().toString(36).substring(2, 10),
      userId: sender.userId,
      username: sender.username,
      emoji,
      ts: Date.now()
    };

    // Broadcast only to non-Viewers
    for (const p of this.participants.values()) {
      if (p.role !== Role.VIEWER) {
        p.socket.emit(SOCKET_EVENTS.REACTION, payload);
      }
    }
  }

  // Host transfer
  transferHost(newHostUserId: string): boolean {
    const target = this.getParticipantByUserId(newHostUserId);
    if (!target) return false;

    const oldHost = this.getParticipantByUserId(this.hostId);
    if (oldHost) {
      oldHost.role = Role.MODERATOR;
    }

    target.role = Role.HOST;
    this.hostId = target.userId;

    this.broadcastParticipantListUpdate();

    for (const p of this.participants.values()) {
      p.socket.emit(SOCKET_EVENTS.HOST_TRANSFERRED, {
        newHostId: target.userId,
        newHostUsername: target.username
      });
    }

    return true;
  }
}
