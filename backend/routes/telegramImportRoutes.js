import express from 'express';
import * as telegramImportController from '../controllers/telegramImportController.js';
// Considere um middleware de chave de API ou IP para proteger esta rota privada
// import apiKeyAuthMiddleware from '../middlewares/apiKeyAuthMiddleware.js';

const router = express.Router();

// Endpoint privado para o bot do Telegram
// router.post('/import', apiKeyAuthMiddleware, telegramImportController.importContentFromTelegram);
router.post('/import', telegramImportController.importContentFromTelegram); // Placeholder sem auth específico por agora

export default router;
