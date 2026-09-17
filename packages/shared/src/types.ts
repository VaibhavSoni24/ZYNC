import { Role } from './roles';

export type PlayState = 'playing' | 'paused' | 'buffering';

export type RoomVisibility = 'PUBLIC' | 'PRIVATE';

export interface UserDto {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string | null;
  dob: string;
  usernameChangeCount: number;
  lastUsernameChangedAt?: string | null;
  createdAt: string;
}

export interface ParticipantDto {
  userId: string;
  username: string;
  avatar: string;
  role: Role;
  joinedAt: number;
  hasRequestedControl?: boolean;
}

export interface SyncStatePayload {
  playState: PlayState;
  currentTime: number;
  videoId: string;
}

export interface ChatMessageDto {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  ts: number;
}

export interface ReactionDto {
  id: string;
  userId: string;
  emoji: string;
  ts: number;
}

export interface ControlRequestDto {
  userId: string;
  username: string;
  ts: number;
}

export interface RoomDto {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  visibility: RoomVisibility;
  language: string;
  currentVideoId: string;
  hostId: string;
  hostUsername?: string;
  participantCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface JoinRoomPayload {
  roomId: string; // can be room code or id
  username?: string;
}

export interface PlaybackActionPayload {
  time?: number;
  videoId?: string;
}

export interface RoleAssignmentPayload {
  userId: string;
  role: Role;
}

export interface RemoveParticipantPayload {
  userId: string;
}

export interface TransferHostPayload {
  userId: string;
}

export interface ControlResponsePayload {
  userId: string;
  approve: boolean;
}
