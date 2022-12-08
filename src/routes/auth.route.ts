import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/auth/signup', AuthController.createUser);
router.post('/auth/signin', AuthController.signIn);
router.post('/auth/refresh-token', AuthController.refreshToken);
router.get('/auth/verify-user', AuthController.verifyUser);

export { router };
