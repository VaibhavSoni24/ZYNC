import { Router } from 'express';
import { authController } from './auth.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/verify-otp', (req, res, next) => authController.verifyOtp(req, res, next));
router.post('/resend-otp', (req, res, next) => authController.resendOtp(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/me', requireAuth, (req, res, next) => authController.getMe(req as any, res, next));

export const authRoutes = router;
