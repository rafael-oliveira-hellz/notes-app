import { Router } from 'express';
import logger from '../config/winston-logger';
import NoteController from '../controllers/note.controller';
import { isAdmin } from '../middlewares/PermissionControl';
import { verifyToken } from '../middlewares/TokenControl';

const router = Router();

router.get('/notes', verifyToken, isAdmin, NoteController.listAll, () => {
  // #swagger.tags = ['Note']
  // #swagger.description = 'Endpoint para listar todas as notas.'
  /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
  /* #swagger.responses[200] = {
    description: 'Notas listadas com sucesso.',
    schema: { $ref: "#/definitions/NoteList" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
    #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
});
router.get(
  '/notes/my-notes',
  verifyToken,
  NoteController.listAllFromUser,
  () => {
    // #swagger.tags = ['Note']
    // #swagger.description = 'Endpoint para listar todas as notas de um usuário autenticado.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
    /* #swagger.responses[200] = {
    description: 'Notas listadas com sucesso.',
    schema: { $ref: "#/definitions/NoteList" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
  }
);
router.get(
  '/notes/user/:id',
  verifyToken,
  isAdmin,
  NoteController.getAllUserNotes,
  () => {
    // #swagger.tags = ['Note']
    // #swagger.description = 'Endpoint para listar todas as notas de um usuário.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
    /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/UserId" }
  } */
    /* #swagger.responses[200] = {
    description: 'Notas listadas com sucesso.',
    schema: { $ref: "#/definitions/NoteList" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
  }
);

router.get(
  '/notes/undated',
  verifyToken,
  isAdmin,
  NoteController.getNotesWithoutDates,
  () => {
    // #swagger.tags = ['Note']
    // #swagger.description = 'Endpoint para listar todas as notas sem data de início e data de conclusão.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
    /* #swagger.responses[200] = {
    description: 'Notas listadas com sucesso.',
    schema: { $ref: "#/definitions/NoteList" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
  }
);

router.get(
  '/notes/pending',
  verifyToken,
  isAdmin,
  NoteController.listPending,
  () => {
    // #swagger.tags = ['Note']
    // #swagger.description = 'Endpoint para listar notas pendentes.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
    /* #swagger.responses[200] = {
    description: 'Notas listadas com sucesso.',
    schema: { $ref: "#/definitions/NotePending" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
  }
);
router.get(
  '/notes/completed',
  verifyToken,
  isAdmin,
  NoteController.listCompleted,
  () => {
    // #swagger.tags = ['Note']
    // #swagger.description = 'Endpoint para listar notas completadas.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
    /* #swagger.responses[200] = {
    description: 'Notas listadas com sucesso.',
    schema: { $ref: "#/definitions/NoteCompleted" }
  }
#swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }*/
  }
);
router.get(
  '/notes/overdue',
  verifyToken,
  isAdmin,
  NoteController.listOverdue,
  () => {
    // #swagger.tags = ['Note']
    // #swagger.description = 'Endpoint para listar notas atrasadas.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
    /* #swagger.responses[200] = {
    description: 'Notas listadas com sucesso.',
    schema: { $ref: "#/definitions/NoteOverdue" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }*/
  }
);

router.get('/notes/:id', verifyToken, NoteController.findByid, () => {
  // #swagger.tags = ['Note']
  // #swagger.description = 'Endpoint para listar uma nota específica.'
  /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
  /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da nota.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/NoteId" }
  } */
  /* #swagger.responses[200] = {
    description: 'Nota listada com sucesso.',
    schema: { $ref: "#/definitions/Note" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
    #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
});
router.get(
  '/notes/search/request',
  verifyToken,
  NoteController.findByField,
  () => {
    // #swagger.tags = ['Note']
    // #swagger.description = 'Endpoint para listar uma nota específica.'
    /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
    /* #swagger.parameters['field'] = {
    in: 'query',
    description: 'Campo de busca.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/NoteRequest" }
  } */
    /* #swagger.parameters['value'] = {
    in: 'query',
    description: 'Valor do campo de busca.',
    required: false,
    type: 'string',
    schema: { $ref: "#/definitions/NoteRequest" }
  }
  /* #swagger.responses[200] = {
    description: 'Nota listada com sucesso.',
    schema: { $ref: "#/definitions/Note" }
  }
  #swagger.responses[400] = {
    description: 'Campo de busca inválido.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
    #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
    #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
  }
);

router.post('/notes', verifyToken, NoteController.create, () => {
  // #swagger.tags = ['Note']
  // #swagger.description = 'Endpoint para criar uma nova anotação.'
  /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
  /* #swagger.parameters['note'] = {
    in: 'body',
    description: 'Informações da anotação.',
    required: true,
    type: 'object',
    schema: { $ref: "#/definitions/NoteCreate" }
  } */
  /* #swagger.responses[201] = {
    description: 'Anotação criada com sucesso.',
    schema: { $ref: "#/definitions/NoteCreated" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }
  */
});
router.put('/notes/edit/:id', verifyToken, NoteController.update, () => {
  // #swagger.tags = ['Note']
  // #swagger.description = 'Endpoint para editar uma anotação.'
  /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
  /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da nota.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/NoteId" }
  } */
  /* #swagger.parameters['note'] = {
    in: 'body',
    description: 'Informações da anotação.',
    required: true,
    type: 'object',
    schema: { $ref: "#/definitions/NoteUpdate" }
  } */
  /* #swagger.responses[200] = {
    description: 'Anotação editada com sucesso.',
    schema: { $ref: "#/definitions/NoteUpdated" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
  #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }*/
});
router.delete('/notes/:id', verifyToken, NoteController.delete, () => {
  // #swagger.tags = ['Note']
  // #swagger.description = 'Endpoint para deletar uma anotação.'
  /* #swagger.parameters['authorization'] = {
    in: 'header',
    description: 'Token de autenticação do usuário.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/VerifyUser" }
  } */
  /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da nota.',
    required: true,
    type: 'string',
    schema: { $ref: "#/definitions/NoteId" }
  } */
  /* #swagger.responses[200] = {
    description: 'Anotação deletada com sucesso.',
    schema: { $ref: "#/definitions/NoteDeleted" }
  }
  #swagger.responses[400] = {
    description: 'Erro na requisição.',
    schema: { $ref: "#/definitions/BadRequest" }
  }
    #swagger.responses[401] = {
    description: 'Token inválido.',
    schema: { $ref: "#/definitions/Unauthorized" }
  }
    #swagger.responses[403] = {
    description: 'Usuário não autorizado.',
    schema: { $ref: "#/definitions/Forbidden" }
  }
  #swagger.responses[404] = {
    description: 'Nenhuma anotação encontrada.',
    schema: { $ref: "#/definitions/NotFound" }
  }
  #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { $ref: "#/definitions/InternalServerError" }
  }*/
});

logger.debug('Note routes initialized', {
  label: 'NoteController',
  paths: [
    '/notes',
    '/notes/:id',
    '/notes/my-notes',
    '/notes/find',
    '/notes/edit/:id',
    '/notes/search/request',
    '/notes/pending',
    '/notes/completed',
    '/notes/overdue',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

export { router };
