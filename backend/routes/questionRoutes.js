import express from 'express';
import * as questionController from '../controllers/questionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/module/:moduleId', questionController.listQuestionsByModule);
router.get('/filter', questionController.listQuestionsByFilter); // Ex: /filter?vestibular=ENEM&tema=matematica
// Para criar, atualizar, deletar - geralmente protegido
router.post('/', authMiddleware, questionController.createQuestion);
router.patch('/:id', authMiddleware, questionController.updateQuestion);
router.delete('/:id', authMiddleware, questionController.deleteQuestion);

export default router;
