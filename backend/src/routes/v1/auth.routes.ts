import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';
import  verifyAuth  from '@/middlewares/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', verifyAuth, authController.logout);
router.get('/me', verifyAuth, authController.getCurrentUser);
router.patch('/change-password', verifyAuth, authController.changePassword);

export default router;
