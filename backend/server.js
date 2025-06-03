import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rotas
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

// Middlewares (placeholders)
import authMiddleware from './middlewares/authMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares globais
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulário URL-encoded

// Middleware de logging simples
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/chat/community', communityChatRoutes);
app.use('/api/chat/ai', aiChatRoutes);
app.use('/api/telegram', telegramImportRoutes); // Rota privada, considere protegê-la adequadamente

// Rota raiz para verificar se o servidor está online
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Study Hub!' });
});

// Middleware de tratamento de erros (deve ser o último middleware)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
