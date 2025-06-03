import express from 'express';
import * as aiChatController from '../controllers/aiChatController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Assumindo que esta rota é para usuários premium, ou alguma verificação de status
router.post('/ask', authMiddleware, aiChatController.askAI);

export default router;
