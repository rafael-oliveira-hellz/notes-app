import { Router } from 'express';
import logger from '../config/winston-logger';
import NoteController from '../controllers/note.controller';
import { isAdmin } from '../middlewares/PermissionControl';
import { verifyToken } from '../middlewares/TokenControl';

const router = Router();

router.get('/notes', verifyToken, isAdmin, NoteController.listAll);
router.get('/notes/my-notes', verifyToken, NoteController.listAllFromUser);
router.get('/notes/:id', verifyToken, NoteController.findByid);
router.get('/notes/find', verifyToken, NoteController.findByField);
router.post('/notes', verifyToken, NoteController.create);
router.put('/notes/:id', verifyToken, NoteController.update);
router.delete('/notes/:id', verifyToken, NoteController.delete);

logger.debug('Note routes initialized', {
  label: 'NoteController',
  paths: ['/notes', '/notes/:id', '/notes/find'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

export { router };
