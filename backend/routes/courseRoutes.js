import express from 'express';
import * as courseController from '../controllers/courseController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Exemplo para rotas de admin

const router = express.Router();

router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourseById);
// Para criar, atualizar, deletar - geralmente protegido
router.post('/', authMiddleware, courseController.createCourse); // Exemplo: apenas admin cria
router.patch('/:id', authMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);

export default router;
