import { Router } from 'express';
import logger from '../config/winston-logger';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/auth/signup', AuthController.createUser, (_req, _res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint para criar um novo usuário.'
  /* #swagger.parameters['createUser'] = {
     in: 'body',
     description: 'Dados do novo usuário.',
     required: true,
     type: 'object',
     schema: { $ref: "#/definitions/newUser" }
   }*/
  /* #swagger.responses[201] = {
    description: 'Usuário criado com sucesso.',
    schema: { $ref: "#/definitions/CreateUser" }
  }
    #swagger.responses[400] = {
    description: 'Requisição inválida.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[409] = {
    description: 'Usuário já existe.',
    schema: { $ref: "#/definitions/Conflict" }
  }
  #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
});
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
