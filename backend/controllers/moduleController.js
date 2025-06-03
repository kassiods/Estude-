// import * as moduleService from '../services/moduleService.js';

export const listModulesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    // TODO: Implementar moduleService.getByCourseId(courseId)
    res.status(200).json({ message: `Lista de módulos para o curso ${courseId} (placeholder).` });
  } catch (error) {
    next(error);
  }
};

export const createModule = async (req, res, next) => {
  try {
    // const moduleData = req.body; // Espera courseId aqui
    // TODO: Implementar moduleService.create(moduleData)
    res.status(201).json({ message: 'Módulo criado (placeholder).', data: req.body });
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const moduleUpdates = req.body;
    // TODO: Implementar moduleService.update(id, moduleUpdates)
    res.status(200).json({ message: `Módulo ${id} atualizado (placeholder).`, data: req.body });
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implementar moduleService.delete(id)
    res.status(200).json({ message: `Módulo ${id} deletado (placeholder).` });
  } catch (error) {
    next(error);
  }
};
