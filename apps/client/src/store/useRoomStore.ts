import { create } from 'zustand';
import {
  Role,
  PlayState,
  ParticipantDto,
  ChatMessageDto,
  ReactionDto,
  ControlRequestDto,
  RoomDto,
  SOCKET_EVENTS
} from '@zync/shared';
import { getSocket, connectSocket, disconnectSocket } from '../lib/socket';

interface RoomState {
  room: RoomDto | null;
  myRole: Role;
  participants: ParticipantDto[];
  playState: PlayState;
  currentTime: number;
  videoId: string;
  chatMessages: ChatMessageDto[];
  activeReactions: ReactionDto[];
  controlRequests: ControlRequestDto[];
  isConnected: boolean;
  isKicked: boolean;
  kickedReason: string | null;
  errorMessage: string | null;

  // Actions
  joinRoom: (roomCode: string, user: { id: string; username: string; avatar: string }) => void;
  leaveRoom: () => void;
  setPlayState: (state: PlayState, time: number) => void;
  setCurrentTime: (time: number) => void;
  setVideoId: (videoId: string) => void;

  // Outgoing socket emitters
  emitPlay: (time?: number) => void;
  emitPause: (time?: number) => void;
  emitSeek: (time: number) => void;
  emitChangeVideo: (videoId: string) => void;
  emitAssignRole: (userId: string, role: Role) => void;
  emitRemoveParticipant: (userId: string) => void;
  emitTransferHost: (userId: string) => void;
  emitRequestControl: () => void;
  emitRespondControl: (userId: string, approve: boolean) => void;
  emitChat: (message: string) => void;
  emitReaction: (emoji: string) => void;
  clearError: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  myRole: Role.VIEWER,
  participants: [],
  playState: 'paused',
  currentTime: 0,
  videoId: 'dQw4w9WgXcQ',
  chatMessages: [],
  activeReactions: [],
  controlRequests: [],
  isConnected: false,
  isKicked: false,
  kickedReason: null,
  errorMessage: null,

  clearError: () => set({ errorMessage: null }),

  setPlayState: (playState, currentTime) => set({ playState, currentTime }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setVideoId: (videoId) => set({ videoId, currentTime: 0, playState: 'paused' }),

  joinRoom: (roomCode, user) => {
    const socket = connectSocket();

    set({
      isKicked: false,
      kickedReason: null,
      chatMessages: [],
      activeReactions: [],
      controlRequests: [],
      isConnected: socket.connected
    });

    const sendJoin = () => {
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
        roomId: roomCode,
        userId: user.id,
        username: user.username,
        avatar: user.avatar
      });
    };

    // Remove any previous listeners to avoid duplicates
    socket.off('connect');
    socket.off('disconnect');
    socket.off(SOCKET_EVENTS.SYNC_STATE);
    socket.off(SOCKET_EVENTS.ROLE_ASSIGNED);
    socket.off(SOCKET_EVENTS.CHAT_MESSAGE);
    socket.off(SOCKET_EVENTS.REACTION);
    socket.off(SOCKET_EVENTS.CONTROL_REQUESTED);
    socket.off(SOCKET_EVENTS.KICKED);
    socket.off(SOCKET_EVENTS.ERROR);

    socket.on('connect', () => {
      set({ isConnected: true });
      sendJoin();
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    if (socket.connected) {
      sendJoin();
    }

    // Inbound sync state
    socket.on(SOCKET_EVENTS.SYNC_STATE, (payload: { playState: PlayState; currentTime: number; videoId: string }) => {
      set({
        playState: payload.playState,
        currentTime: payload.currentTime,
        videoId: payload.videoId
      });
    });

    // Role assigned or participant updates
    socket.on(SOCKET_EVENTS.ROLE_ASSIGNED, (payload: { participants: ParticipantDto[] }) => {
      const participants = payload.participants || [];
      const me = participants.find((p) => p.userId === user.id);
      set({
        participants,
        myRole: me ? me.role : get().myRole
      });
    });

    // New chat message
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (msg: ChatMessageDto) => {
      set((state) => ({
        chatMessages: [...state.chatMessages, msg]
      }));
    });

    // New reaction
    socket.on(SOCKET_EVENTS.REACTION, (rx: ReactionDto) => {
      set((state) => ({
        activeReactions: [...state.activeReactions, rx]
      }));

      // Auto-remove reaction after animation completes (3s)
      setTimeout(() => {
        set((state) => ({
          activeReactions: state.activeReactions.filter((r) => r.id !== rx.id)
        }));
      }, 3000);
    });

    // Control request from participant (for Host / Moderator)
    socket.on(SOCKET_EVENTS.CONTROL_REQUESTED, (request: ControlRequestDto) => {
      set((state) => ({
        controlRequests: [...state.controlRequests.filter((r) => r.userId !== request.userId), request]
      }));
    });

    // Response to my control request
    socket.on(SOCKET_EVENTS.CONTROL_REQUEST_RESPONDED, (res: { status: string; message: string }) => {
      set({ errorMessage: res.message });
    });

    // Kicked from room
    socket.on(SOCKET_EVENTS.KICKED, (payload: { message: string }) => {
      set({
        isKicked: true,
        kickedReason: payload.message || 'You were removed from the room by the host'
      });
      disconnectSocket();
    });

    // Socket error
    socket.on(SOCKET_EVENTS.ERROR, (payload: { message: string }) => {
      set({ errorMessage: payload.message });
    });
  },

  leaveRoom: () => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.LEAVE_ROOM);
    socket.off();
    disconnectSocket();
    set({
      room: null,
      participants: [],
      chatMessages: [],
      activeReactions: [],
      controlRequests: [],
      isConnected: false
    });
  },

  emitPlay: (time) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.PLAY, { time });
  },

  emitPause: (time) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.PAUSE, { time });
  },

  emitSeek: (time) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.SEEK, { time });
  },

  emitChangeVideo: (videoId) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.CHANGE_VIDEO, { videoId });
  },

  emitAssignRole: (userId, role) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.ASSIGN_ROLE, { userId, role });
  },

  emitRemoveParticipant: (userId) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.REMOVE_PARTICIPANT, { userId });
  },

  emitTransferHost: (userId) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.TRANSFER_HOST, { userId });
  },

  emitRequestControl: () => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.REQUEST_CONTROL);
  },

  emitRespondControl: (userId, approve) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.RESPOND_CONTROL_REQUEST, { userId, approve });
    // Remove request from pending list
    set((state) => ({
      controlRequests: state.controlRequests.filter((r) => r.userId !== userId)
    }));
  },

  emitChat: (message) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.SEND_CHAT, { message });
  },

  emitReaction: (emoji) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENTS.SEND_REACTION, { emoji });
  }
}));
