import { Room } from '../classes/Room';
import { Participant } from '../classes/Participant';
import { RoleManager } from '../classes/RoleManager';
import { Role, SOCKET_EVENTS } from '@zync/shared';

export function handleRequestControl(room: Room, participant: Participant) {
  if (!RoleManager.canRequestControl(participant)) {
    participant.socket.emit(SOCKET_EVENTS.ERROR, {
      message: 'Only participants can request playback control'
    });
    return;
  }

  participant.hasRequestedControl = true;

  // Notify Host and all Moderators
  const requestPayload = {
    userId: participant.userId,
    username: participant.username,
    avatar: participant.avatar,
    ts: Date.now()
  };

  for (const p of room.getAllParticipants()) {
    if (p.role === Role.HOST || p.role === Role.MODERATOR) {
      p.socket.emit(SOCKET_EVENTS.CONTROL_REQUESTED, requestPayload);
    }
  }

  participant.socket.emit(SOCKET_EVENTS.CONTROL_REQUEST_RESPONDED, {
    status: 'pending',
    message: 'Your request for playback control was sent to the Host and Moderators'
  });
}

export function handleRespondControlRequest(
  room: Room,
  actor: Participant,
  payload: { userId: string; approve: boolean }
) {
  // Only Host and Moderator can approve/deny control requests
  if (actor.role !== Role.HOST && actor.role !== Role.MODERATOR) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, {
      message: 'Only the Host or a Moderator can respond to control requests'
    });
    return;
  }

  const target = room.getParticipantByUserId(payload.userId);
  if (!target) {
    actor.socket.emit(SOCKET_EVENTS.ERROR, { message: 'Requester is no longer in the room' });
    return;
  }

  target.hasRequestedControl = false;

  if (payload.approve) {
    // Promote to Moderator so they can control playback
    target.role = Role.MODERATOR;
    room.broadcastParticipantListUpdate();

    target.socket.emit(SOCKET_EVENTS.CONTROL_REQUEST_RESPONDED, {
      status: 'approved',
      message: `${actor.username} approved your request. You are now a Moderator!`
    });
  } else {
    target.socket.emit(SOCKET_EVENTS.CONTROL_REQUEST_RESPONDED, {
      status: 'denied',
      message: `${actor.username} denied your request for playback control.`
    });
  }
}
