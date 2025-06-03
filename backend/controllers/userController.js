const userService = require('../services/userService');

async function register(req, res, next) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  }
  try {
    const { user, session, error } = await userService.createUser({ email, password, name });
    if (error) throw error;
    // Depending on your Supabase email confirmation settings, session might be null here.
    // user object will contain the created user.
    res.status(201).json({ message: 'Usuário registrado com sucesso. Verifique seu email para confirmação se necessário.', user, session });
  } catch (error) {
    // Pass error to the error handling middleware if you have one, or handle here
    console.error('Register controller error:', error.message);
    // Supabase often returns specific error messages that can be useful to the client
    // Be careful not to expose sensitive error details in production
    res.status(400).json({ error: error.message || 'Falha ao registrar usuário.' });
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }
  try {
    const { user, session, error } = await userService.loginUser({ email, password });
    if (error) throw error;
    res.status(200).json({ message: 'Login bem-sucedido.', user, session, token: session?.access_token });
  } catch (error) {
    console.error('Login controller error:', error.message);
    res.status(401).json({ error: error.message || 'Credenciais inválidas.' });
  }
}

// Assuming authMiddleware populates req.user
async function getMe(req, res, next) {
  try {
    // If authMiddleware verifies a JWT and extracts user ID:
    // const userId = req.user.id; 
    // const userProfile = await userService.getUserById(userId);
    // For now, returning the user object from Supabase auth (if available from middleware)
    if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado.'});
    }
    // req.user might already be the user profile if your authMiddleware fetches it.
    // Or it might just be the decoded token payload.
    res.status(200).json({ message: 'Dados do usuário.', user: req.user });
  } catch (error) {
    console.error('GetMe controller error:', error.message);
    next(error);
  }
}

async function updateUser(req, res, next) {
   try {
    // const userId = req.user.id; // From authMiddleware
    const updates = req.body;
    // TODO: Implement userService.updateUserProfile(userId, updates)
    // const updatedUser = await userService.updateUserProfile(userId, updates);
    console.log('Atualizando perfil do usuário (placeholder):', updates);
    res.status(200).json({ message: 'Perfil atualizado com sucesso (placeholder).', data: updates });
  } catch (error) {
    next(error);
  }
}


module.exports = { 
  register,
  login,
  getMe,
  updateUser
};
