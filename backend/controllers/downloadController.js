// import * as downloadService from '../services/downloadService.js';

export const registerCourseDownload = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const { courseId } = req.params;
    // TODO: Implementar downloadService.register(userId, courseId)
    // Verificar limite de downloads, incrementar contador etc.
    res.status(200).json({ message: `Download do curso ${courseId} registrado (placeholder).` });
  } catch (error) {
    next(error);
  }
};
