const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you'll use it

router.post('/register', userController.register);
router.post('/login', userController.login);

// Example of protected routes:
router.get('/me', authMiddleware, userController.getMe);
router.patch('/update', authMiddleware, userController.updateUser);

module.exports = router;
