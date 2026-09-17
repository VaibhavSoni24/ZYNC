import { Router } from 'express';
import { usersController } from './users.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.put('/profile', requireAuth, (req, res, next) => usersController.updateProfile(req as any, res, next));
router.get('/check-username', requireAuth, (req, res, next) => usersController.checkUsername(req as any, res, next));
router.put('/username', requireAuth, (req, res, next) => usersController.updateUsername(req as any, res, next));
router.put('/change-password', requireAuth, (req, res, next) => usersController.changePassword(req as any, res, next));
router.post('/request-delete-otp', requireAuth, (req, res, next) => usersController.requestDeleteOtp(req as any, res, next));
router.delete('/account', requireAuth, (req, res, next) => usersController.deleteAccount(req as any, res, next));

export const usersRoutes = router;

