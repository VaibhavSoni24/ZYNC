import { Role, ROLE_PERMISSIONS } from '@zync/shared';
import { Participant } from './Participant';

export class RoleManager {
  static canControlPlayback(participant: Participant): boolean {
    return ROLE_PERMISSIONS[participant.role].canControlPlayback;
  }

  static canChat(participant: Participant): boolean {
    return ROLE_PERMISSIONS[participant.role].canChat;
  }

  static canReact(participant: Participant): boolean {
    return ROLE_PERMISSIONS[participant.role].canReact;
  }

  static canManageRoles(participant: Participant): boolean {
    return ROLE_PERMISSIONS[participant.role].canManageRoles;
  }

  static canRemoveParticipant(participant: Participant): boolean {
    return ROLE_PERMISSIONS[participant.role].canRemoveParticipant;
  }

  static canTransferHost(participant: Participant): boolean {
    return ROLE_PERMISSIONS[participant.role].canTransferHost;
  }

  static canRequestControl(participant: Participant): boolean {
    return ROLE_PERMISSIONS[participant.role].canRequestControl;
  }

  static validateRoleAssignment(
    actor: Participant,
    target: Participant,
    newRole: Role
  ): { allowed: boolean; reason?: string } {
    // Only HOST can assign roles
    if (actor.role !== Role.HOST) {
      return { allowed: false, reason: 'Only the room Host can assign roles' };
    }

    // Host cannot assign Host role via assign_role (must use transfer_host)
    if (newRole === Role.HOST) {
      return { allowed: false, reason: 'Use transfer host action to transfer host ownership' };
    }

    // Host cannot demote themselves here
    if (target.userId === actor.userId) {
      return { allowed: false, reason: 'Host cannot demote their own role directly' };
    }

    return { allowed: true };
  }
}
