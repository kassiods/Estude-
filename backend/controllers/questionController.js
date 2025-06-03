// import * as questionService from '../services/questionService.js';

export const listQuestionsByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    // TODO: Implementar questionService.getByModuleId(moduleId)
    res.status(200).json({ message: `Lista de questões para o módulo ${moduleId} (placeholder).` });
  } catch (error) {
    next(error);
  }
};

export const listQuestionsByFilter = async (req, res, next) => {
  try {
    const filters = req.query; // Ex: { vestibular: 'ENEM', tema: 'matematica' }
    // TODO: Implementar questionService.getByFilters(filters)
    res.status(200).json({ message: 'Lista de questões filtradas (placeholder).', filters });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    // const questionData = req.body; // Espera moduleId, etc.
    // TODO: Implementar questionService.create(questionData)
    res.status(201).json({ message: 'Questão criada (placeholder).', data: req.body });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const questionUpdates = req.body;
    // TODO: Implementar questionService.update(id, questionUpdates)
    res.status(200).json({ message: `Questão ${id} atualizada (placeholder).`, data: req.body });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implementar questionService.delete(id)
    res.status(200).json({ message: `Questão ${id} deletada (placeholder).` });
  } catch (error) {
    next(error);
  }
};
