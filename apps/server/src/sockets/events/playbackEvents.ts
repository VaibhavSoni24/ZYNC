import { Room } from '../classes/Room';
import { Participant } from '../classes/Participant';
import { RoleManager } from '../classes/RoleManager';
import { roomsService } from '../../modules/rooms/rooms.service';
import { SOCKET_EVENTS } from '@zync/shared';

export function extractYouTubeVideoId(input: string): string {
  if (!input) return 'dQw4w9WgXcQ';
  const trimmed = input.trim();
  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  // Try matching youtube.com or youtu.be URLs
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : trimmed;
}

export function handlePlay(room: Room, participant: Participant, payload?: { time?: number }) {
  if (!RoleManager.canControlPlayback(participant)) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, { message: 'You do not have permission to control playback' });
    return;
  }

  room.setPlayback('playing', payload?.time);
  room.broadcastSyncState();
}

export function handlePause(room: Room, participant: Participant, payload?: { time?: number }) {
  if (!RoleManager.canControlPlayback(participant)) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, { message: 'You do not have permission to control playback' });
    return;
  }

  room.setPlayback('paused', payload?.time);
  room.broadcastSyncState();
}

export function handleSeek(room: Room, participant: Participant, payload: { time: number }) {
  if (!RoleManager.canControlPlayback(participant)) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, { message: 'You do not have permission to control playback' });
    return;
  }

  if (typeof payload.time === 'number' && !isNaN(payload.time)) {
    room.setPlayback(room.playState, payload.time);
    room.broadcastSyncState();
  }
}

export function handleChangeVideo(room: Room, participant: Participant, payload: { videoId: string }) {
  if (!RoleManager.canControlPlayback(participant)) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, { message: 'You do not have permission to change the video' });
    return;
  }

  const cleanVideoId = extractYouTubeVideoId(payload.videoId);
  room.setVideoId(cleanVideoId);
  roomsService.updateRoomVideo(room.id, cleanVideoId).catch(() => {});
  room.broadcastSyncState();
}
