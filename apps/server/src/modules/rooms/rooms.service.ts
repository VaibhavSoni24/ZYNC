import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { RoomDto, RoomVisibility } from '@zync/shared';
import { logger } from '../../utils/logger';
import { getSocketServer } from '../../sockets';

// Unambiguous alphanumeric characters (excluding I, 1, O, 0 to prevent user confusion)
const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function generateRandomCode(): string {
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += CODE_CHARS[crypto.randomInt(0, CODE_CHARS.length)];
    part2 += CODE_CHARS[crypto.randomInt(0, CODE_CHARS.length)];
  }
  return `${part1}-${part2}`;
}

// In-memory fallback rooms store for offline local dev
const inMemoryRooms = new Map<string, any>();

function formatRoomDto(room: any): RoomDto {
  return {
    id: room.id,
    code: room.code,
    name: room.name,
    description: room.description || null,
    visibility: (room.visibility as RoomVisibility) || 'PUBLIC',
    language: room.language || 'English',
    currentVideoId: room.currentVideoId || 'dQw4w9WgXcQ',
    hostId: room.hostId,
    hostUsername: room.host?.username,
    participantCount: room.participants ? room.participants.length : 0,
    isActive: room.isActive ?? true,
    createdAt: room.createdAt instanceof Date ? room.createdAt.toISOString() : room.createdAt
  };
}

export class RoomsService {
  async generateUniqueRoomCode(): Promise<string> {
    let attempts = 0;
    while (attempts < 10) {
      const code = generateRandomCode();
      try {
        const existing = await prisma.room.findUnique({ where: { code } });
        if (!existing) return code;
      } catch {
        if (!inMemoryRooms.has(code)) return code;
      }
      attempts++;
    }
    return `${generateRandomCode()}`;
  }

  async createRoom(params: {
    name: string;
    description?: string;
    visibility?: RoomVisibility;
    language?: string;
    hostId: string;
  }) {
    const code = await this.generateUniqueRoomCode();

    let roomRecord: any;
    try {
      roomRecord = await prisma.room.create({
        data: {
          code,
          name: params.name.trim(),
          description: params.description?.trim() || null,
          visibility: params.visibility || 'PUBLIC',
          language: params.language || 'English',
          currentVideoId: 'dQw4w9WgXcQ',
          hostId: params.hostId,
          isActive: true
        },
        include: {
          host: true
        }
      });
    } catch (err: any) {
      logger.warn('Prisma createRoom fallback to in-memory store:', err.message);
      roomRecord = {
        id: 'rm_' + Math.random().toString(36).substring(2, 10),
        code,
        name: params.name.trim(),
        description: params.description?.trim() || null,
        visibility: params.visibility || 'PUBLIC',
        language: params.language || 'English',
        currentVideoId: 'dQw4w9WgXcQ',
        hostId: params.hostId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryRooms.set(code, roomRecord);
      inMemoryRooms.set(roomRecord.id, roomRecord);
    }

    return formatRoomDto(roomRecord);
  }

  async getRoomByCode(code: string): Promise<RoomDto | null> {
    const normalizedCode = code.toUpperCase().trim();

    try {
      const room = await prisma.room.findUnique({
        where: { code: normalizedCode },
        include: { host: true, participants: true }
      });
      if (room) return formatRoomDto(room);
    } catch (err: any) {
      logger.warn('Prisma getRoomByCode fallback:', err.message);
    }

    const memoryRoom = inMemoryRooms.get(normalizedCode);
    if (memoryRoom) return formatRoomDto(memoryRoom);

    return null;
  }

  async deleteRoomByCode(code: string): Promise<boolean> {
    const normalizedCode = code.toUpperCase().trim();
    try {
      await prisma.room.delete({
        where: { code: normalizedCode }
      });
      logger.info(`Deleted empty room from DB: ${normalizedCode}`);
    } catch (err: any) {
      // Room might have already been removed or DB fallback used
      logger.info(`Prisma deleteRoomByCode notice (${normalizedCode}): ${err.message}`);
    }

    inMemoryRooms.delete(normalizedCode);
    for (const [key, val] of inMemoryRooms.entries()) {
      if (val.code === normalizedCode) {
        inMemoryRooms.delete(key);
      }
    }
    return true;
  }

  async getPublicRooms(filters: { search?: string; language?: string }): Promise<RoomDto[]> {
    const socketServer = getSocketServer();
    const now = Date.now();

    try {
      const rooms = await prisma.room.findMany({
        where: {
          visibility: 'PUBLIC',
          isActive: true,
          ...(filters.language && filters.language !== 'All' ? { language: filters.language } : {}),
          ...(filters.search
            ? {
                OR: [
                  { name: { contains: filters.search, mode: 'insensitive' } },
                  { code: { contains: filters.search, mode: 'insensitive' } }
                ]
              }
            : {})
        },
        include: { host: true, participants: true },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      const activeRooms: RoomDto[] = [];
      for (const room of rooms) {
        const liveCount = socketServer ? socketServer.getParticipantCount(room.code) : 0;
        const createdAtTime = room.createdAt instanceof Date ? room.createdAt.getTime() : new Date(room.createdAt).getTime();
        const ageMs = now - createdAtTime;

        // Automatically delete stale empty rooms older than 2 minutes
        if (liveCount === 0 && ageMs > 2 * 60 * 1000) {
          this.deleteRoomByCode(room.code).catch(() => {});
          continue;
        }

        const dto = formatRoomDto(room);
        dto.participantCount = liveCount > 0 ? liveCount : (dto.participantCount || 0);
        activeRooms.push(dto);
      }

      return activeRooms;
    } catch (err: any) {
      logger.warn('Prisma getPublicRooms fallback to memory store:', err.message);
      const publicList: any[] = [];
      for (const room of inMemoryRooms.values()) {
        if (room.visibility === 'PUBLIC' && room.isActive) {
          if (filters.language && filters.language !== 'All' && room.language !== filters.language) {
            continue;
          }
          if (filters.search && !room.name.toLowerCase().includes(filters.search.toLowerCase())) {
            continue;
          }

          const liveCount = socketServer ? socketServer.getParticipantCount(room.code) : 0;
          const createdAtTime = room.createdAt instanceof Date ? room.createdAt.getTime() : new Date(room.createdAt).getTime();
          const ageMs = now - createdAtTime;

          if (liveCount === 0 && ageMs > 2 * 60 * 1000) {
            inMemoryRooms.delete(room.code);
            inMemoryRooms.delete(room.id);
            continue;
          }

          const dto = formatRoomDto(room);
          dto.participantCount = liveCount > 0 ? liveCount : (dto.participantCount || 0);
          publicList.push(dto);
        }
      }
      return publicList;
    }
  }

  async updateRoomVideo(roomId: string, videoId: string) {
    try {
      await prisma.room.update({
        where: { id: roomId },
        data: { currentVideoId: videoId }
      });
    } catch (err: any) {
      const mem = inMemoryRooms.get(roomId);
      if (mem) mem.currentVideoId = videoId;
    }
  }

  async updateRoomHost(code: string, newHostUserId: string): Promise<void> {
    const normalizedCode = code.toUpperCase().trim();
    try {
      await prisma.room.update({
        where: { code: normalizedCode },
        data: { hostId: newHostUserId }
      });
      logger.info(`Updated room host in DB for ${normalizedCode} -> ${newHostUserId}`);
    } catch (err: any) {
      logger.warn(`Prisma updateRoomHost notice (${normalizedCode}): ${err.message}`);
    }

    const mem = inMemoryRooms.get(normalizedCode);
    if (mem) mem.hostId = newHostUserId;
    for (const [k, v] of inMemoryRooms.entries()) {
      if (v.code === normalizedCode) {
        v.hostId = newHostUserId;
      }
    }
  }
}

export const roomsService = new RoomsService();
