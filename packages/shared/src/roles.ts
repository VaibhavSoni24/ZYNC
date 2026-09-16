export enum Role {
  HOST = 'HOST',
  MODERATOR = 'MODERATOR',
  PARTICIPANT = 'PARTICIPANT',
  VIEWER = 'VIEWER'
}

export interface RolePermissions {
  canControlPlayback: boolean;
  canChat: boolean;
  canReact: boolean;
  canManageRoles: boolean;
  canRemoveParticipant: boolean;
  canTransferHost: boolean;
  canRequestControl: boolean;
}

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  [Role.HOST]: {
    canControlPlayback: true,
    canChat: true,
    canReact: true,
    canManageRoles: true,
    canRemoveParticipant: true,
    canTransferHost: true,
    canRequestControl: false
  },
  [Role.MODERATOR]: {
    canControlPlayback: true,
    canChat: true,
    canReact: true,
    canManageRoles: false,
    canRemoveParticipant: false,
    canTransferHost: false,
    canRequestControl: false
  },
  [Role.PARTICIPANT]: {
    canControlPlayback: false,
    canChat: true,
    canReact: true,
    canManageRoles: false,
    canRemoveParticipant: false,
    canTransferHost: false,
    canRequestControl: true
  },
  [Role.VIEWER]: {
    canControlPlayback: false,
    canChat: false,
    canReact: false,
    canManageRoles: false,
    canRemoveParticipant: false,
    canTransferHost: false,
    canRequestControl: false
  }
};

/**
 * Checks if targetRole should be visible to observerRole.
 * - HOST and MODERATOR can see everyone.
 * - PARTICIPANT can see HOST, MODERATOR, and other PARTICIPANTS (not VIEWERS).
 * - VIEWER can only see HOST and MODERATOR (and themselves).
 */
export function isParticipantVisible(
  observerRole: Role,
  targetRole: Role,
  isSelf: boolean = false
): boolean {
  if (isSelf) return true;
  if (observerRole === Role.HOST || observerRole === Role.MODERATOR) {
    return true;
  }
  if (observerRole === Role.PARTICIPANT) {
    return targetRole !== Role.VIEWER;
  }
  if (observerRole === Role.VIEWER) {
    return targetRole === Role.HOST || targetRole === Role.MODERATOR;
  }
  return false;
}
