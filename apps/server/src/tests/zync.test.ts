import { describe, it, expect, beforeAll } from 'vitest';
import { Role, ROLE_PERMISSIONS, isParticipantVisible } from '@zync/shared';
import { AuthService } from '../modules/auth/auth.service';
import { RoomsService } from '../modules/rooms/rooms.service';
import { UsersService } from '../modules/users/users.service';
import { Room } from '../sockets/classes/Room';
import { Participant } from '../sockets/classes/Participant';
import { RoleManager } from '../sockets/classes/RoleManager';
import { storeOtp, verifyOtp, isOtpInCooldown } from '../utils/otp';
import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { redisClient } from '../config/redis';

// Mock Socket for unit testing OOP classes
class MockSocket {
  public id: string;
  public emittedEvents: { event: string; data: any }[] = [];
  public rooms: Set<string> = new Set();

  constructor(id: string) {
    this.id = id;
  }

  join(room: string) {
    this.rooms.add(room);
  }

  leave(room: string) {
    this.rooms.delete(room);
  }

  emit(event: string, data: any) {
    this.emittedEvents.push({ event, data });
  }

  to(_room: string) {
    return {
      emit: (event: string, data: any) => {
        this.emittedEvents.push({ event, data });
      }
    };
  }
}

describe('Zync Full Suite Verification', () => {
  const authService = new AuthService();
  const roomsService = new RoomsService();
  const usersService = new UsersService();

  describe('1. JWT & Cryptographic Security', () => {
    it('should sign and verify access token', () => {
      const payload = { userId: 'u123', username: 'vaibhav', email: 'v@zync.live' };
      const token = signAccessToken(payload);
      expect(typeof token).toBe('string');

      const verified = verifyAccessToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.userId).toBe('u123');
      expect(verified?.username).toBe('vaibhav');
    });

    it('should sign and verify refresh token', () => {
      const payload = { userId: 'u123', username: 'vaibhav', email: 'v@zync.live' };
      const token = signRefreshToken(payload);
      const verified = verifyRefreshToken(token);
      expect(verified?.userId).toBe('u123');
    });

    it('should reject invalid tokens', () => {
      const verified = verifyAccessToken('invalid.token.signature');
      expect(verified).toBeNull();
    });
  });

  describe('2. OTP Lifecycle in Redis', () => {
    const testEmail = 'otp_test@zync.live';

    it('should store and verify 6-digit OTP', async () => {
      await storeOtp(testEmail, '123456', {
        name: 'Test User',
        username: 'testuser',
        email: testEmail,
        dob: '2000-01-01',
        passwordHash: 'hash',
        avatar: 'Comet'
      });

      // Verify cooldown is active
      const { inCooldown } = await isOtpInCooldown(testEmail);
      expect(inCooldown).toBe(true);

      // Verify incorrect OTP decrements attempts
      const fail = await verifyOtp(testEmail, '999999');
      expect(fail.success).toBe(false);
      expect(fail.message).toContain('attempt');

      // Verify correct OTP succeeds
      const success = await verifyOtp(testEmail, '123456');
      expect(success.success).toBe(true);
      expect(success.userData?.username).toBe('testuser');

      // Subsequent attempt should fail because OTP was deleted
      const secondAttempt = await verifyOtp(testEmail, '123456');
      expect(secondAttempt.success).toBe(false);
    });
  });

  describe('3. Room Code Generation & Public Directory', () => {
    it('should generate collision-free 8-char XXXX-XXXX formatted code', async () => {
      const code = await roomsService.generateUniqueRoomCode();
      expect(code).toMatch(/^[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
      expect(code.length).toBe(9); // 4 + 1 + 4 = 9 chars
    });

    it('should create and retrieve room', async () => {
      const room = await roomsService.createRoom({
        name: 'Movie Night',
        description: 'Watching anime',
        visibility: 'PUBLIC',
        language: 'Japanese',
        hostId: 'host_001'
      });

      expect(room.name).toBe('Movie Night');
      expect(room.language).toBe('Japanese');
      expect(room.code).toBeDefined();

      const retrieved = await roomsService.getRoomByCode(room.code);
      expect(retrieved?.id).toBe(room.id);
    });

    it('should filter public rooms by language and search query', async () => {
      const rooms = await roomsService.getPublicRooms({
        search: 'Movie',
        language: 'Japanese'
      });
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.some((r) => r.language === 'Japanese')).toBe(true);
    });
  });

  describe('4. Role-Based Access Control (RBAC) & Visibility Rules', () => {
    it('should enforce the exact permissions matrix from §7.2', () => {
      // Host: full control
      expect(ROLE_PERMISSIONS[Role.HOST].canControlPlayback).toBe(true);
      expect(ROLE_PERMISSIONS[Role.HOST].canChat).toBe(true);
      expect(ROLE_PERMISSIONS[Role.HOST].canReact).toBe(true);
      expect(ROLE_PERMISSIONS[Role.HOST].canManageRoles).toBe(true);
      expect(ROLE_PERMISSIONS[Role.HOST].canRemoveParticipant).toBe(true);
      expect(ROLE_PERMISSIONS[Role.HOST].canTransferHost).toBe(true);
      expect(ROLE_PERMISSIONS[Role.HOST].canRequestControl).toBe(false);

      // Moderator: controls playback, chat, react; cannot manage roles or remove participants
      expect(ROLE_PERMISSIONS[Role.MODERATOR].canControlPlayback).toBe(true);
      expect(ROLE_PERMISSIONS[Role.MODERATOR].canChat).toBe(true);
      expect(ROLE_PERMISSIONS[Role.MODERATOR].canReact).toBe(true);
      expect(ROLE_PERMISSIONS[Role.MODERATOR].canManageRoles).toBe(false);
      expect(ROLE_PERMISSIONS[Role.MODERATOR].canRemoveParticipant).toBe(false);

      // Participant: cannot control playback (can request), can chat & react
      expect(ROLE_PERMISSIONS[Role.PARTICIPANT].canControlPlayback).toBe(false);
      expect(ROLE_PERMISSIONS[Role.PARTICIPANT].canRequestControl).toBe(true);
      expect(ROLE_PERMISSIONS[Role.PARTICIPANT].canChat).toBe(true);
      expect(ROLE_PERMISSIONS[Role.PARTICIPANT].canReact).toBe(true);

      // Viewer: cannot control, chat, or react
      expect(ROLE_PERMISSIONS[Role.VIEWER].canControlPlayback).toBe(false);
      expect(ROLE_PERMISSIONS[Role.VIEWER].canChat).toBe(false);
      expect(ROLE_PERMISSIONS[Role.VIEWER].canReact).toBe(false);
      expect(ROLE_PERMISSIONS[Role.VIEWER].canRequestControl).toBe(false);
    });

    it('should enforce role visibility rules (§7.2)', () => {
      // Viewers can only see Host and Moderator (and themselves)
      expect(isParticipantVisible(Role.VIEWER, Role.HOST)).toBe(true);
      expect(isParticipantVisible(Role.VIEWER, Role.MODERATOR)).toBe(true);
      expect(isParticipantVisible(Role.VIEWER, Role.PARTICIPANT)).toBe(false);
      expect(isParticipantVisible(Role.VIEWER, Role.VIEWER, false)).toBe(false);
      expect(isParticipantVisible(Role.VIEWER, Role.VIEWER, true)).toBe(true); // self visible

      // Participants can see Host, Moderator, Participants, but NOT Viewers
      expect(isParticipantVisible(Role.PARTICIPANT, Role.HOST)).toBe(true);
      expect(isParticipantVisible(Role.PARTICIPANT, Role.MODERATOR)).toBe(true);
      expect(isParticipantVisible(Role.PARTICIPANT, Role.PARTICIPANT)).toBe(true);
      expect(isParticipantVisible(Role.PARTICIPANT, Role.VIEWER)).toBe(false);

      // Host & Moderator see Everyone
      expect(isParticipantVisible(Role.HOST, Role.VIEWER)).toBe(true);
      expect(isParticipantVisible(Role.MODERATOR, Role.VIEWER)).toBe(true);
    });
  });

  describe('5. OOP Socket Server Architecture', () => {
    let room: Room;
    let host: Participant;
    let mod: Participant;
    let participant: Participant;
    let viewer1: Participant;
    let viewer2: Participant;

    beforeAll(() => {
      room = new Room({
        id: 'r_01',
        code: 'TEST-1234',
        name: 'OOP Test Room',
        hostId: 'u_host'
      });

      host = new Participant({
        socket: new MockSocket('s_host') as any,
        userId: 'u_host',
        username: 'HostUser',
        avatar: 'Comet',
        role: Role.HOST
      });

      mod = new Participant({
        socket: new MockSocket('s_mod') as any,
        userId: 'u_mod',
        username: 'ModUser',
        avatar: 'Nova',
        role: Role.MODERATOR
      });

      participant = new Participant({
        socket: new MockSocket('s_part') as any,
        userId: 'u_part',
        username: 'PartUser',
        avatar: 'Drift',
        role: Role.PARTICIPANT
      });

      viewer1 = new Participant({
        socket: new MockSocket('s_view1') as any,
        userId: 'u_view1',
        username: 'ViewerOne',
        avatar: 'Pulse',
        role: Role.VIEWER
      });

      viewer2 = new Participant({
        socket: new MockSocket('s_view2') as any,
        userId: 'u_view2',
        username: 'ViewerTwo',
        avatar: 'Glint',
        role: Role.VIEWER
      });

      room.addParticipant(host);
      room.addParticipant(mod);
      room.addParticipant(participant);
      room.addParticipant(viewer1);
      room.addParticipant(viewer2);
    });

    it('should calculate role-filtered participant list for Viewers (§7.2)', () => {
      const viewerVisibleList = room.getFilteredParticipantsFor(viewer1);
      const userIds = viewerVisibleList.map((p) => p.userId);

      // Viewer 1 should see Host, Mod, and itself (Viewer 1), but NOT Participant or Viewer 2!
      expect(userIds).toContain('u_host');
      expect(userIds).toContain('u_mod');
      expect(userIds).toContain('u_view1');
      expect(userIds).not.toContain('u_part');
      expect(userIds).not.toContain('u_view2');
    });

    it('should calculate role-filtered participant list for Participants (§7.2)', () => {
      const partVisibleList = room.getFilteredParticipantsFor(participant);
      const userIds = partVisibleList.map((p) => p.userId);

      // Participant should see Host, Mod, and itself, but NOT Viewers
      expect(userIds).toContain('u_host');
      expect(userIds).toContain('u_mod');
      expect(userIds).toContain('u_part');
      expect(userIds).not.toContain('u_view1');
      expect(userIds).not.toContain('u_view2');
    });

    it('should allow Host to see all participants', () => {
      const hostVisibleList = room.getFilteredParticipantsFor(host);
      expect(hostVisibleList.length).toBe(5);
    });

    it('should calculate drift and playback time synchronization', () => {
      room.setPlayback('playing', 10);
      expect(room.playState).toBe('playing');
      const time = room.getCalculatedCurrentTime();
      expect(time).toBeGreaterThanOrEqual(10);

      room.setPlayback('paused', 45);
      expect(room.playState).toBe('paused');
      expect(room.getCalculatedCurrentTime()).toBe(45);
    });

    it('should broadcast chat messages ONLY to non-Viewers', () => {
      room.addChatMessage(participant, 'Hello everyone in the room!');

      const hostSocket = host.socket as any as MockSocket;
      const viewerSocket = viewer1.socket as any as MockSocket;

      const hostChat = hostSocket.emittedEvents.find((e) => e.event === 'chat_message');
      expect(hostChat).toBeDefined();
      expect(hostChat?.data.message).toBe('Hello everyone in the room!');

      const viewerChat = viewerSocket.emittedEvents.find((e) => e.event === 'chat_message');
      expect(viewerChat).toBeUndefined(); // Viewers do NOT receive chat!
    });

    it('should transfer host role cleanly', () => {
      const transferred = room.transferHost(mod.userId);
      expect(transferred).toBe(true);
      expect(room.hostId).toBe(mod.userId);
      expect(mod.role).toBe(Role.HOST);
      expect(host.role).toBe(Role.MODERATOR);
    });
  });
});
