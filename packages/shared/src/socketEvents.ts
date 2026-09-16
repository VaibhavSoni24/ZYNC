export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  PLAY: 'play',
  PAUSE: 'pause',
  SEEK: 'seek',
  CHANGE_VIDEO: 'change_video',
  ASSIGN_ROLE: 'assign_role',
  REMOVE_PARTICIPANT: 'remove_participant',
  TRANSFER_HOST: 'transfer_host',
  REQUEST_CONTROL: 'request_control',
  RESPOND_CONTROL_REQUEST: 'respond_control_request',
  SEND_CHAT: 'send_chat',
  SEND_REACTION: 'send_reaction',

  // Server -> Client
  SYNC_STATE: 'sync_state',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  ROLE_ASSIGNED: 'role_assigned',
  PARTICIPANT_REMOVED: 'participant_removed',
  HOST_TRANSFERRED: 'host_transferred',
  CONTROL_REQUESTED: 'control_requested',
  CONTROL_REQUEST_RESPONDED: 'control_request_responded',
  CHAT_MESSAGE: 'chat_message',
  REACTION: 'reaction',
  ERROR: 'error',
  KICKED: 'kicked'
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
