import { Socket } from 'socket.io';
import { Role, ParticipantDto } from '@zync/shared';

export class Participant {
  public socket: Socket;
  public userId: string;
  public username: string;
  public avatar: string;
  public role: Role;
  public joinedAt: number;
  public hasRequestedControl: boolean = false;
  public lastReactionTimestamp: number = 0;
  public lastChatTimestamp: number = 0;

  constructor(params: {
    socket: Socket;
    userId: string;
    username: string;
    avatar: string;
    role: Role;
  }) {
    this.socket = params.socket;
    this.userId = params.userId;
    this.username = params.username;
    this.avatar = params.avatar;
    this.role = params.role;
    this.joinedAt = Date.now();
  }

  toDto(): ParticipantDto {
    return {
      userId: this.userId,
      username: this.username,
      avatar: this.avatar,
      role: this.role,
      joinedAt: this.joinedAt,
      hasRequestedControl: this.hasRequestedControl
    };
  }
}
