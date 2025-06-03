// import * as contentService from '../services/contentService.js';

export const listContentsByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    // TODO: Implementar contentService.getByModuleId(moduleId)
    res.status(200).json({ message: `Lista de conteúdos para o módulo ${moduleId} (placeholder).` });
  } catch (error) {
    next(error);
  }
};

export const createContent = async (req, res, next) => {
  try {
    // const contentData = req.body; // Espera moduleId aqui
    // TODO: Implementar contentService.create(contentData)
    res.status(201).json({ message: 'Conteúdo criado (placeholder).', data: req.body });
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const contentUpdates = req.body;
    // TODO: Implementar contentService.update(id, contentUpdates)
    res.status(200).json({ message: `Conteúdo ${id} atualizado (placeholder).`, data: req.body });
  } catch (error) {
    next(error);
  }
};

export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implementar contentService.delete(id)
    res.status(200).json({ message: `Conteúdo ${id} deletado (placeholder).` });
  } catch (error) {
    next(error);
  }
};
