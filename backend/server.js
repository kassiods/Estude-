import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Polyfill __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import routes
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import communityChatRoutes from './routes/communityChatRoutes.js';
import aiChatRoutes from './routes/aiChatRoutes.js';
import telegramImportRoutes from './routes/telegramImportRoutes.js';

// Middlewares
import errorHandler from './middlewares/errorHandler.js';
// import authMiddleware from './middlewares/authMiddleware.js'; // If needed globally

const app = express();
const port = process.env.PORT || 3002;

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/chat/community', communityChatRoutes);
app.use('/api/chat/ai', aiChatRoutes);
app.use('/api/telegram', telegramImportRoutes);

// Root route to check if the server is online
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Study Hub Backend is online!' });
});

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port} no modo ${process.env.NODE_ENV || 'development'}`);
});
