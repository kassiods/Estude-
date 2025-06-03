// import * as courseService from '../services/courseService.js';

export const listCourses = async (req, res, next) => {
  try {
    // TODO: Implementar courseService.getAll()
    res.status(200).json({ message: 'Lista de todos os cursos (placeholder).' });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implementar courseService.getById(id)
    res.status(200).json({ message: `Detalhes do curso ${id} (placeholder).` });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    // const courseData = req.body;
    // TODO: Implementar courseService.create(courseData)
    res.status(201).json({ message: 'Curso criado (placeholder).', data: req.body });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const courseUpdates = req.body;
    // TODO: Implementar courseService.update(id, courseUpdates)
    res.status(200).json({ message: `Curso ${id} atualizado (placeholder).`, data: req.body });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implementar courseService.delete(id)
    res.status(200).json({ message: `Curso ${id} deletado (placeholder).` });
  } catch (error) {
    next(error);
  }
};
