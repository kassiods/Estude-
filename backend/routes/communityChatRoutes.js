import express from 'express';
import * as communityChatController from '../controllers/communityChatController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/channel/:name', authMiddleware, communityChatController.listMessagesByChannel);
router.post('/message', authMiddleware, communityChatController.sendMessage);

export default router;
