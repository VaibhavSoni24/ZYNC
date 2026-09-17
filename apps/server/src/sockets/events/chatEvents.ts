import { Room } from '../classes/Room';
import { Participant } from '../classes/Participant';
import { RoleManager } from '../classes/RoleManager';
import { SOCKET_EVENTS } from '@zync/shared';

export function handleSendChat(
  room: Room,
  participant: Participant,
  payload: { message: string }
) {
  if (!RoleManager.canChat(participant)) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, {
      message: 'Viewers cannot send chat messages. Ask the host to promote you.'
    });
    return;
  }

  const message = payload.message?.trim();
  if (!message || message.length === 0) {
    return;
  }

  // Rate limit: 1 message per second to prevent spam and server overload
  const now = Date.now();
  if (now - participant.lastChatTimestamp < 1000) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, {
      message: 'Slow down! You can send 1 message per second.'
    });
    return;
  }
  participant.lastChatTimestamp = now;

  if (message.length > 500) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Message is too long (max 500 characters)' });
    return;
  }

  room.addChatMessage(participant, message);
}
