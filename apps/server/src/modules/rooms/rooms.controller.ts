import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { roomsService } from './rooms.service';
import { AuthenticatedRequest } from '../../middleware/auth';

const createRoomSchema = z.object({
  name: z.string().min(2, 'Room name must be at least 2 characters').max(60),
  description: z.string().max(300).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
  language: z.string().default('English')
});

export class RoomsController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Authentication required to create a room' });
        return;
      }

      const validated = createRoomSchema.parse(req.body);
      const room = await roomsService.createRoom({
        ...validated,
        hostId: req.user.userId
      });

      res.status(201).json({ success: true, data: room });
    } catch (err) {
      next(err);
    }
  }

  async getPublicRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const language = req.query.language as string | undefined;
      const rooms = await roomsService.getPublicRooms({ search, language });
      res.status(200).json({ success: true, data: rooms });
    } catch (err) {
      next(err);
    }
  }

  async getByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      const room = await roomsService.getRoomByCode(code);
      if (!room) {
        res.status(404).json({ success: false, error: 'Room not found' });
        return;
      }
      res.status(200).json({ success: true, data: room });
    } catch (err) {
      next(err);
    }
  }
}

export const roomsController = new RoomsController();
