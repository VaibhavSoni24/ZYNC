import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@zync/shared';
import { Room } from './Room';
import { Participant } from './Participant';
import { handlePlay, handlePause, handleSeek, handleChangeVideo } from '../events/playbackEvents';
import { handleAssignRole, handleRemoveParticipant, handleTransferHost } from '../events/roleEvents';
import { handleRequestControl, handleRespondControlRequest } from '../events/controlEvents';
import { handleSendChat } from '../events/chatEvents';
import { handleSendReaction } from '../events/reactionEvents';
import { logger } from '../../utils/logger';

export class MessageHandler {
  static registerHandlers(socket: Socket, getContext: () => { room?: Room; participant?: Participant }) {
    // Playback events
    socket.on(SOCKET_EVENTS.PLAY, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handlePlay(room, participant, payload);
    });

    socket.on(SOCKET_EVENTS.PAUSE, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handlePause(room, participant, payload);
    });

    socket.on(SOCKET_EVENTS.SEEK, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleSeek(room, participant, payload);
    });

    socket.on(SOCKET_EVENTS.CHANGE_VIDEO, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleChangeVideo(room, participant, payload);
    });

    // Role management
    socket.on(SOCKET_EVENTS.ASSIGN_ROLE, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleAssignRole(room, participant, payload);
    });

    socket.on(SOCKET_EVENTS.REMOVE_PARTICIPANT, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleRemoveParticipant(room, participant, payload);
    });

    socket.on(SOCKET_EVENTS.TRANSFER_HOST, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleTransferHost(room, participant, payload);
    });

    // Control request workflow
    socket.on(SOCKET_EVENTS.REQUEST_CONTROL, () => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleRequestControl(room, participant);
    });

    socket.on(SOCKET_EVENTS.RESPOND_CONTROL_REQUEST, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleRespondControlRequest(room, participant, payload);
    });

    // Chat
    socket.on(SOCKET_EVENTS.SEND_CHAT, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleSendChat(room, participant, payload);
    });

    // Reactions
    socket.on(SOCKET_EVENTS.SEND_REACTION, (payload) => {
      const { room, participant } = getContext();
      if (!room || !participant) return;
      handleSendReaction(room, participant, payload);
    });
  }
}
