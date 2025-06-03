const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Specify path for .env

// Import initial routes
const userRoutes = require('./routes/userRoutes');

// Placeholder for other routes (to be converted to CommonJS and imported later)
// const courseRoutes = require('./routes/courseRoutes');
// const moduleRoutes = require('./routes/moduleRoutes');
// const contentRoutes = require('./routes/contentRoutes');
// const questionRoutes = require('./routes/questionRoutes');
// const progressRoutes = require('./routes/progressRoutes');
// const downloadRoutes = require('./routes/downloadRoutes');
// const communityChatRoutes = require('./routes/communityChatRoutes');
// const aiChatRoutes = require('./routes/aiChatRoutes');
// const telegramImportRoutes = require('./routes/telegramImportRoutes');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');
// const authMiddleware = require('./middlewares/authMiddleware'); // If needed globally

const app = express();
const port = process.env.PORT || 3001;

// Global Middlewares
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulário URL-encoded

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/users', userRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/modules', moduleRoutes);
// app.use('/api/contents', contentRoutes);
// app.use('/api/questions', questionRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/downloads', downloadRoutes);
// app.use('/api/chat/community', communityChatRoutes);
// app.use('/api/chat/ai', aiChatRoutes);
// app.use('/api/telegram', telegramImportRoutes);

// Root route to check if the server is online
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Study Hub!' });
});

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
