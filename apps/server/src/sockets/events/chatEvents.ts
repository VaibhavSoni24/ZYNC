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

  if (message.length > 500) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Message is too long (max 500 characters)' });
    return;
  }

  room.addChatMessage(participant, message);
}
