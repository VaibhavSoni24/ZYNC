import { Room } from '../classes/Room';
import { Participant } from '../classes/Participant';
import { RoleManager } from '../classes/RoleManager';
import { Role, SOCKET_EVENTS } from '@zync/shared';

export function handleAssignRole(
  room: Room,
  actor: Participant,
  payload: { userId: string; role: Role }
) {
  const target = room.getParticipantByUserId(payload.userId);
  if (!target) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Participant not found in room' });
    return;
  }

  const validation = RoleManager.validateRoleAssignment(actor, target, payload.role);
  if (!validation.allowed) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: validation.reason || 'Cannot assign role' });
    return;
  }

  target.role = payload.role;
  // If promoted from viewer or participant, clear any pending request
  target.hasRequestedControl = false;

  room.broadcastParticipantListUpdate();
}

export function handleRemoveParticipant(
  room: Room,
  actor: Participant,
  payload: { userId: string }
) {
  if (!RoleManager.canRemoveParticipant(actor)) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Only the Host can remove participants' });
    return;
  }

  const target = room.getParticipantByUserId(payload.userId);
  if (!target) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Participant not found in room' });
    return;
  }

  if (target.userId === actor.userId) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Host cannot remove themselves' });
    return;
  }

  // Notify kicked user
  target.socket.emit(SOCKET_EVENTS.KICKED, { message: 'You have been removed from the room by the host' });
  room.removeParticipant(target.socket.id);
  room.broadcastParticipantListUpdate();
}

export function handleTransferHost(
  room: Room,
  actor: Participant,
  payload: { userId: string }
) {
  if (!RoleManager.canTransferHost(actor)) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Only the current Host can transfer host ownership' });
    return;
  }

  const target = room.getParticipantByUserId(payload.userId);
  if (!target) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Target participant not found' });
    return;
  }

  const success = room.transferHost(payload.userId);
  if (!success) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to transfer host ownership' });
  }
}
