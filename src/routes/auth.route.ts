import { Router } from 'express';
import logger from '../config/winston-logger';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/auth/signup', AuthController.createUser, () => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint para criar um novo usuário.'
  /* #swagger.parameters['signup'] = {
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
router.post('/auth/signin', AuthController.signIn, () => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint para realizar o login de um usuário.'
  /* #swagger.parameters['signin'] = {
     in: 'body',
     description: 'Dados do usuário para o login.',
     required: true,
     type: 'object',
     schema: { $ref: "#/definitions/UserLogin" }
   }*/
  /* #swagger.responses[200] = {
    description: 'Usuário logado com sucesso.',
    schema: { $ref: "#/definitions/UserLoginResponse" }
  }
    #swagger.responses[400] = {
    description: 'Requisição inválida.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
    #swagger.responses[404] = {
    description: 'Usuário não encontrado.',
    schema: { $ref: "#/definitions/NotFound" }
  }
  #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
});
router.post('/auth/refresh-token', AuthController.refreshToken, () => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint para atualizar o token de um usuário.'
  /* #swagger.parameters['authorization'] = {
     in: 'header',
     description: 'Token para atualização do acesso.',
     required: true,
     type: 'string',
     schema: { $ref: "#/definitions/RefreshToken" }
   }*/
  /* #swagger.responses[200] = {
    description: 'Token atualizado com sucesso.',
    schema: { $ref: "#/definitions/RefreshTokenResponse" }
  }
    #swagger.responses[400] = {
    description: 'Requisição inválida.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[404] = {
    description: 'Usuário não encontrado.',
    schema: { $ref: "#/definitions/NotFound" }
  }
  #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
});
router.get('/auth/verify-user', AuthController.verifyUser, () => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint para verificar se o usuário existe.'
  /* #swagger.parameters['authorization'] = {
     in: 'header',
     description: 'Token para autenticação do usuário.',
     required: true,
     type: 'string',
     schema: { $ref: "#/definitions/VerifyUser" }
   }*/
  /* #swagger.responses[200] = {
    description: 'Usuário verificado com sucesso.',
    schema: { $ref: "#/definitions/VerifyUserResponse" }
  }
    #swagger.responses[400] = {
    description: 'Requisição inválida.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[404] = {
    description: 'Usuário não encontrado.',
    schema: { $ref: "#/definitions/NotFound" }
  }
  #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
});

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
