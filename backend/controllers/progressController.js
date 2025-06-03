// import * as progressService from '../services/progressService.js';

export const getUserProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // TODO: Implementar progressService.getByUserId(userId)
    // Adicionar verificação se o requisitante é admin ou o próprio usuário
    res.status(200).json({ message: `Progresso do usuário ${userId} (placeholder).` });
  } catch (error) {
    next(error);
  }
};

export const getMyProgress = async (req, res, next) => {
  try {
    // const userId = req.user.id; // Do authMiddleware
    // TODO: Implementar progressService.getByUserId(userId)
    res.status(200).json({ message: `Meu progresso (placeholder).` });
  } catch (error) {
    next(error);
  }
};

export const markModuleAsCompleted = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const { moduleId, courseId } = req.body; // courseId pode ser útil para contexto
    if (!moduleId) {
        return res.status(400).json({ message: "moduleId é obrigatório."})
    }
    // TODO: Implementar progressService.completeModule(userId, moduleId, courseId)
    res.status(200).json({ message: `Módulo ${moduleId} marcado como concluído (placeholder).` });
  } catch (error) {
    next(error);
  }
};
