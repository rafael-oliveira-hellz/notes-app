import { Router } from 'express';
import logger from '../config/winston-logger';
import UserController from '../controllers/user.controller';
import { imageUpload } from '../middlewares/Multer';
import { isAdmin } from '../middlewares/PermissionControl';
import { verifyToken } from '../middlewares/TokenControl';

const router = Router();

router.get(
  '/users',
  // verifyToken,
  // isAdmin,
  UserController.getAllUsers,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para obter todos os usuários.'
    /* #swagger.parameters['authorization'] = {
     in: 'header',
      description: 'Token de acesso.',
      required: true,
      type: 'string',
      schema: { $ref: "#/definitions/VerifyUser" }
    }*/
    /* #swagger.responses[200] = {
    description: 'Listar todos os usuários no sistema.',
    schema: { $ref: "#/definitions/User" }
  }*/
  }
);
router.get('/users/me', verifyToken, UserController.getUserProfile);
router.get('/users/find', verifyToken, isAdmin, UserController.getUserByField);
router.get(
  '/users/active',
  verifyToken,
  isAdmin,
  UserController.getActiveUsers,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para obter todos os usuários ativos.'
    /* #swagger.responses[200] = {
      description: 'Listar usuários ativos no sistema.',
      schema: { $ref: "#/definitions/User" }
    }
      #swagger.responses[400] = {
      description: 'Requisição inválida.',
      schema: { $ref: "#/definitions/BadRequest" }
    }
      #swagger.responses[401] = {
      description: 'Acesso não autorizado.',
      schema: { $ref: "#/definitions/Unauthorized" }
    }
      #swagger.responses[403] = {
      description: 'Acesso negado.',
      schema: { $ref: "#/definitions/Forbidden" }
    }
    */
  }
);
router.get(
  '/users/inactive',
  verifyToken,
  isAdmin,
  UserController.getInactiveUsers
);
router.patch(
  '/users/change-password',
  verifyToken,
  UserController.updateUserPassword
);
router.put(
  '/users/edit/profile',
  verifyToken,
  imageUpload.single('profile_picture'),
  UserController.updateUser
);
router.delete('/users/me', verifyToken, UserController.deleteProfile);
router.delete('/users/:id', verifyToken, isAdmin, UserController.deleteUser);

logger.debug('User routes initialized', {
  label: 'UserController',
  paths: [
    '/users',
    '/users/me',
    '/users/:id',
    '/users/find',
    '/users/active',
    '/users/inactive',
    '/users/change-password',
    '/users/edit/profile',
  ],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
});

export { router };
