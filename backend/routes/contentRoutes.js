import express from 'express';
import * as contentController from '../controllers/contentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/module/:moduleId', contentController.listContentsByModule);
// Para criar, atualizar, deletar - geralmente protegido
router.post('/', authMiddleware, contentController.createContent);
router.patch('/:id', authMiddleware, contentController.updateContent);
router.delete('/:id', authMiddleware, contentController.deleteContent);

export default router;
