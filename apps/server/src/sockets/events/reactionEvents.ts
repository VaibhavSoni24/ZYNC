import { Room } from '../classes/Room';
import { Participant } from '../classes/Participant';
import { RoleManager } from '../classes/RoleManager';
import { SOCKET_EVENTS } from '@zync/shared';

const REACTION_RATE_LIMIT_MS = 1000; // 1 per second

export function handleSendReaction(
  room: Room,
  participant: Participant,
  payload: { emoji: string }
) {
  if (!RoleManager.canReact(participant)) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, {
      message: 'Viewers cannot send reactions. Ask the host to promote you.'
    });
    return;
  }

  const now = Date.now();
  if (now - participant.lastReactionTimestamp < REACTION_RATE_LIMIT_MS) {
    // Rate limit hit, ignore silently to prevent spam
    return;
  }

  participant.lastReactionTimestamp = now;

  const emoji = payload.emoji?.trim();
  if (!emoji) return;

  room.broadcastReaction(participant, emoji);
}
