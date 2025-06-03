import express from 'express';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Exemplo de uso

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', authMiddleware, userController.getMe); // Rota protegida
router.patch('/update', authMiddleware, userController.updateUser); // Rota protegida

export default router;
