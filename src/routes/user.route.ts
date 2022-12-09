import { Router } from 'express';
import logger from '../config/winston-logger';
import UserController from '../controllers/user.controller';
import { imageUpload } from '../middlewares/Multer';
import { isAdmin } from '../middlewares/PermissionControl';
import { verifyToken } from '../middlewares/TokenControl';

const router = Router();

router.get('/users', UserController.getAllUsers);
router.get('/users/me', verifyToken, UserController.getUserProfile);
router.get('/users/find', verifyToken, isAdmin, UserController.getUserByField);
router.patch('/users/me', verifyToken, UserController.updateUserPassword);
router.put(
  '/users/me',
  verifyToken,
  imageUpload.single('profile_picture'),
  UserController.updateUser
);
router.delete('/users/me', verifyToken, UserController.deleteProfile);
router.delete('/users/:id', verifyToken, isAdmin, UserController.deleteUser);

logger.debug('User routes initialized', {
  label: 'UserController',
  paths: ['/users', '/users/me', '/users/find'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
});

export { router };
