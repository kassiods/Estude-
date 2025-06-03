import express from 'express';
import * as progressController from '../controllers/progressController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Geralmente, o progresso é do usuário logado, ou um admin busca por userId
router.get('/user/:userId', authMiddleware, progressController.getUserProgress); // Admin pode buscar
router.get('/me', authMiddleware, progressController.getMyProgress); // Usuário logado busca seu progresso
router.post('/complete', authMiddleware, progressController.markModuleAsCompleted);

export default router;
