
const userService = require('../services/userService');

async function register(req, res, next) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  }
  try {
    // userService.createUser now returns { user, session, profile }
    const { user, session /*, profile */ } = await userService.createUser({ email, password, name });
    
    // If email confirmation is required, session might be null.
    // The user object will contain the created user.
    res.status(201).json({ 
      message: 'Usuário registrado com sucesso. Verifique seu email para confirmação se necessário.', 
      user, // Auth user object
      session // Session object (contains access_token)
      // profile // Profile data from 'profiles' table
    });
  } catch (error) {
    console.error('Register controller error:', error.message, error.stack);
    res.status(400).json({ error: error.message || 'Falha ao registrar usuário.' });
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }
  try {
    // userService.loginUser now returns combined user+profile data
    const { user, session, error } = await userService.loginUser({ email, password });
    if (error && (!session || !session.access_token) ) { // If service throws, it's caught below. This is for service returning error obj.
        // This check might be redundant if userService.loginUser throws on error.
        return res.status(401).json({ error: error.message || 'Credenciais inválidas.' });
    }
    res.status(200).json({ 
        message: 'Login bem-sucedido.', 
        user, // Combined auth user + profile data
        session, // Contains access_token
        token: session?.access_token // Explicitly include token for convenience
    });
  } catch (error) {
    console.error('Login controller error:', error.message);
    res.status(401).json({ error: error.message || 'Credenciais inválidas.' });
  }
}

async function getMe(req, res, next) {
  try {
    // req.user should be populated by authMiddleware with the authenticated Supabase user object
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Não autenticado ou ID do usuário não encontrado no token.'});
    }
    const userId = req.user.id; 
    const userProfile = await userService.getUserById(userId);
    
    if (!userProfile) {
        // This case implies an auth user exists, but their profile in 'profiles' table is missing.
        return res.status(404).json({ message: 'Perfil do usuário não encontrado na tabela de perfis.' });
    }
    // Return the profile data from 'profiles' table
    res.status(200).json({ message: 'Dados do perfil do usuário.', user: userProfile });
  } catch (error) {
    console.error('GetMe controller error:', error.message);
    next(error); // Pass to generic error handler
  }
}

async function updateUser(req, res, next) {
   try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Não autenticado ou ID do usuário não encontrado no token.'});
    }
    const userId = req.user.id;
    const updates = req.body; // e.g., { name, photo_url, is_premium }
    
    // userService.updateUserProfile handles not updating id/email
    const updatedUserProfile = await userService.updateUserProfile(userId, updates);
    res.status(200).json({ message: 'Perfil atualizado com sucesso.', user: updatedUserProfile });
  } catch (error) {
    console.error('UpdateUser controller error:', error.message);
    next(error);
  }
}

module.exports = { 
  register,
  login,
  getMe,
  updateUser
};
