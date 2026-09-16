import { Router } from 'express';
import { usersController } from './users.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.put('/profile', requireAuth, (req, res, next) => usersController.updateProfile(req as any, res, next));
router.put('/username', requireAuth, (req, res, next) => usersController.updateUsername(req as any, res, next));

export const usersRoutes = router;
