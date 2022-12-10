import { Router } from 'express';
import logger from '../config/winston-logger';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/auth/signup', AuthController.createUser);
router.post('/auth/signin', AuthController.signIn);
router.post('/auth/refresh-token', AuthController.refreshToken);
router.get('/auth/verify-user', AuthController.verifyUser);

logger.debug('Auth routes initialized', {
  label: 'AuthController',
  paths: [
    '/auth/signup',
    '/auth/signin',
    '/auth/refresh-token',
    '/auth/verify-user',
  ],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
});

export { router };
