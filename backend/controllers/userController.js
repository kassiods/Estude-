// import * as userService from '../services/userService.js'; // Placeholder para o serviço

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }
    // TODO: Chamar userService.register(name, email, password)
    console.log('Tentativa de registro:', req.body);
    res.status(201).json({ message: 'Usuário registrado com sucesso (placeholder).', data: { name, email } });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }
    // TODO: Chamar userService.login(email, password) e retornar token
    console.log('Tentativa de login:', req.body);
    res.status(200).json({ message: 'Login bem-sucedido (placeholder).', token: 'seu.jwt.token.aqui' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user viria do authMiddleware
    // const userId = req.user.id;
    // TODO: Chamar userService.getById(userId)
    console.log('Buscando dados do usuário logado (placeholder).'); //, req.user);
    res.status(200).json({ message: 'Dados do usuário (placeholder).', user: { id: 'mockUserId', name: 'Usuário Mock', email: 'mock@exemplo.com' } });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const updates = req.body;
    // TODO: Chamar userService.update(userId, updates)
    console.log('Atualizando perfil do usuário (placeholder):', updates);
    res.status(200).json({ message: 'Perfil atualizado com sucesso (placeholder).', data: updates });
  } catch (error) {
    next(error);
  }
};
