import express from 'express';
import * as downloadController from '../controllers/downloadController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/course/:courseId', authMiddleware, downloadController.registerCourseDownload);

export default router;
