
import express from 'express';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// Example of protected routes:
router.get('/me', authMiddleware, userController.getMe);
router.patch('/update', authMiddleware, userController.updateUser);

export default router;
