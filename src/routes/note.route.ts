import { Router } from 'express';
import logger from '../config/winston-logger';
import NoteController from '../controllers/note.controller';
import { isAdmin } from '../middlewares/PermissionControl';
import { verifyToken } from '../middlewares/TokenControl';

const router = Router();

router.get('/notes', verifyToken, isAdmin, NoteController.listAll);
router.get('/notes/my-notes', verifyToken, NoteController.listAllFromUser);
router.get('/notes/:id', verifyToken, NoteController.findByid);
router.get('/notes/search/request', verifyToken, NoteController.findByField);
router.get('/notes/pending', verifyToken, isAdmin, NoteController.listPending);
router.get(
  '/notes/completed',
  verifyToken,
  isAdmin,
  NoteController.listCompleted
);
router.get('/notes/overdue', verifyToken, isAdmin, NoteController.listOverdue);
router.post('/notes', verifyToken, NoteController.create);
router.put('/notes/edit/:id', verifyToken, NoteController.update);
router.delete('/notes/:id', verifyToken, NoteController.delete);

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
