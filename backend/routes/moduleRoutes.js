import express from 'express';
import * as moduleController from '../controllers/moduleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', moduleController.listModulesByCourse);
// Para criar, atualizar, deletar - geralmente protegido
router.post('/', authMiddleware, moduleController.createModule);
router.patch('/:id', authMiddleware, moduleController.updateModule);
router.delete('/:id', authMiddleware, moduleController.deleteModule);

export default router;
