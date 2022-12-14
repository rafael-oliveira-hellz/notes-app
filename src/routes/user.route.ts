import { Router } from 'express';
import logger from '../config/winston-logger';
import UserController from '../controllers/user.controller';
import { imageUpload } from '../middlewares/Multer';
import { isAdmin } from '../middlewares/PermissionControl';
import { verifyToken } from '../middlewares/TokenControl';

const router = Router();

router.get(
  '/users',
  verifyToken,
  isAdmin,
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
    /* #swagger.parameters['page'] = {
      in: 'query',
      description: 'Número da página.',
      required: false,
      type: 'number',
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Limite de usuários por página.',
      required: false,
      type: 'number',
    }
    /* #swagger.responses[200] = {
    description: 'Listar todos os usuários no sistema.',
    schema: { $ref: "#/definitions/UserList" }
  }*/
    /* #swagger.responses[400] = {
    description: 'Requisição inválida.',
    schema: { $ref: "#/definitions/BadRequest" }
    }*/
    /* #swagger.responses[401] = {
    description: 'Acesso não autorizado.',
    schema: { $ref: "#/definitions/Unauthorized" }
    }*/
    /* #swagger.responses[403] = {
    description: 'Acesso negado.',
    schema: { $ref: "#/definitions/Forbidden" }
    }*/
    /* #swagger.responses[404] = {
    description: 'Usuário não encontrado.',
    schema: { $ref: "#/definitions/NotFound" }
    }*/
    /* #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }*/
  }
);
router.get(
  '/users/me',
  verifyToken,
  UserController.getUserProfile,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para obter o perfil do usuário.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de acesso.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  }*/
    /* #swagger.responses[200] = {
    description: 'Obter perfil do usuário.',
    schema: { $ref: "#/definitions/User" }
  }*/
    /* #swagger.responses[400] = {
    description: 'Requisição inválida.',
    schema: { $ref: "#/definitions/BadRequest" }
  }*/
    /* #swagger.responses[401] = {
    description: 'Acesso não autorizado.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }*/
    /* #swagger.responses[403] = {
    description: 'Acesso negado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }*/
    /* #swagger.responses[404] = {
    description: 'Usuário não encontrado.',
    schema: { $ref: "#/definitions/NotFound" }
  }*/
    /* #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }*/
  }
);
router.get(
  '/users/find',
  verifyToken,
  isAdmin,
  UserController.getUserByField,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para obter um usuário pelo campo.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de acesso.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  }*/
    /* #swagger.parameters['field'] = {
    in: 'query',
    description: 'Campo a ser pesquisado.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/UserQuery" }
  }*/
    /* #swagger.parameters['value'] = {
    in: 'query',
    description: 'Valor a ser pesquisado.',
    required: false,
    type: 'string',
  }*/
    /* #swagger.responses[200] = {
    description: 'Obter usuário pelo campo.',
    schema: { $ref: "#/definitions/User" }
  }*/
    /* #swagger.responses[400] = {
    description: 'Requisição inválida.',
    schema: { $ref: "#/definitions/BadRequest" }
  }*/
    /* #swagger.responses[401] = {
    description: 'Acesso não autorizado.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }*/
    /* #swagger.responses[403] = {
    description: 'Acesso negado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }*/
    /* #swagger.responses[404] = {
    description: 'Usuário não encontrado.',
    schema: { $ref: "#/definitions/NotFound" }
  }*/
    /* #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }*/
  }
);
router.get(
  '/users/active',
  verifyToken,
  isAdmin,
  UserController.getActiveUsers,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para obter todos os usuários ativos.'
    /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'Token de acesso.',
      required: true,
      type: 'string',
      schema: { $ref: "#/definitions/VerifyUser" }
    }*/
    /* #swagger.responses[200] = {
      description: 'Listar usuários ativos no sistema.',
      schema: { $ref: "#/definitions/UserList" }
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
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }*/
  }
);
router.get(
  '/users/inactive',
  verifyToken,
  isAdmin,
  UserController.getInactiveUsers,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para obter todos os usuários inativos.'
    /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'Token de acesso.',
      required: true,
      type: 'string',
      schema: { $ref: "#/definitions/VerifyUser" }
    }*/
    /* #swagger.responses[200] = {
      description: 'Listar usuários inativos no sistema.',
      schema: { $ref: "#/definitions/UserInactive" }
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
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
    */
  }
);
router.patch(
  '/users/change-password',
  verifyToken,
  UserController.updateUserPassword,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para alterar a senha do usuário.'
    /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'Token de acesso.',
      required: true,
      type: 'string',
      schema: { $ref: "#/definitions/VerifyUser" }
    }*/
    /* #swagger.parameters['oldPassword'] = {
      in: 'body',
      description: 'Senha antiga do usuário.',
      required: true,
      type: 'string',
      schema: { $ref: "#/definitions/ChangePassword" }
    }*/
    /* #swagger.parameters['newPassword'] = {
      in: 'body',
      description: 'Nova senha do usuário.',
      required: true,
      type: 'string',
      schema: { $ref: "#/definitions/ChangePassword" }
    }*/
    /* #swagger.responses[200] = {
      description: 'Alterar senha do usuário.',
      schema: { $ref: "#/definitions/ChangePasswordResponse" }
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
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
    */
  }
);
router.put(
  '/users/edit/profile',
  verifyToken,
  imageUpload.single('profile_picture'),
  UserController.updateUser,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para editar o perfil do usuário.'
    /* #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'Token de acesso.',
      required: true,
      type: 'string',
      schema: { $ref: "#/definitions/VerifyUser" }
    }*/
    /* #swagger.parameters['name'] = {
      in: 'body',
      description: 'Nome do usuário.',
      required: false,
      type: 'string',
      schema: { $ref: "#/definitions/UpdateUser" }
    }*/
    /* #swagger.parameters['email'] = {
      in: 'body',
      description: 'Email do usuário.',
      required: false,
      type: 'string',
      schema: { $ref: "#/definitions/UpdateUser" }
    }*/
    /* #swagger.parameters['role'] = {
      in: 'body',
      description: 'Cargo do usuário (admin ou user).',
      required: false,
      type: 'string',
      schema: { $ref: "#/definitions/UpdateUser" }
    }*/
    /* #swagger.responses[204] = {
      description: 'Editar perfil do usuário.',
      schema: { $ref: "#/definitions/NoContent" }
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
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
    */
  }
);
router.delete(
  '/users/me',
  verifyToken,
  UserController.deleteProfile,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para deletar o perfil do usuário.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de acesso.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  }*/
    /* #swagger.responses[204] = {
    description: 'Deletar perfil do usuário.',
    schema: { $ref: "#/definitions/NoContentR" }
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
  #swagger.responses[500] = {
  description: 'Erro interno do servidor.',
  schema: { $ref: "#/definitions/InternalServerError" }
}
  */
  }
);
router.delete(
  '/users/:id',
  verifyToken,
  isAdmin,
  UserController.deleteUser,
  (_req, _res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para deletar um usuário.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de acesso.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  }*/
    /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID do usuário a ser removido.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/DeleteUser" }
  }*/
    /* #swagger.responses[200] = {
    description: 'Remover um usuário.',
    schema: { $ref: "#/definitions/DeleteUserResponse" }
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
  #swagger.responses[500] = {
  description: 'Erro interno do servidor.',
  schema: { $ref: "#/definitions/InternalServerError" }
}
  */
  }
);

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
