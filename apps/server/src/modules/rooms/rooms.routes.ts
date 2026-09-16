import { Router } from 'express';
import { roomsController } from './rooms.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.post('/', requireAuth, (req, res, next) => roomsController.create(req as any, res, next));
router.get('/public', (req, res, next) => roomsController.getPublicRooms(req, res, next));
router.get('/:code', (req, res, next) => roomsController.getByCode(req, res, next));

export const roomsRoutes = router;
