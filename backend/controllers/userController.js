
import * as userService from '../services/userService.js';

export async function register(req, res, next) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  }
  try {
    // userService.createUser agora retorna { user, session, profile }
    // session será null porque admin.createUser não loga o usuário.
    const { user, profile } = await userService.createUser({ email, password, name });
    
    res.status(201).json({ 
      message: 'Usuário registrado com sucesso. Por favor, faça login.', 
      userId: user.id, // Retorna o ID do usuário auth
      profileId: profile.id // Retorna o ID do perfil criado
    });
  } catch (error) {
    console.error('Register controller error:', error.message, error.stack);
    // Se o erro for sobre falha na criação do perfil, pode ser um 500.
    // Outros erros (ex: email já existe) podem ser 400 ou 409.
    // A mensagem de erro do userService deve ser específica.
    if (error.message.includes('Falha ao criar perfil') || error.message.includes('inesperado')) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(400).json({ error: error.message });
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }
  try {
    // userService.loginUser agora retorna { user (combinado), session, error }
    const { user, session } = await userService.loginUser({ email, password });

    // A verificação de erro já é feita dentro do userService.loginUser, que lança um erro.
    // Se chegarmos aqui, o login foi bem-sucedido e temos usuário e sessão.
    
    res.status(200).json({ 
        message: 'Login bem-sucedido.', 
        user, // Dados combinados do auth.user e da tabela profiles
        session, // Contém access_token, refresh_token, etc.
        token: session?.access_token // Incluir token explicitamente para conveniência do cliente
    });
  } catch (error) {
    console.error('Login controller error:', error.message);
    // O userService.loginUser já personaliza algumas mensagens de erro (ex: 'Email ou senha inválidos.')
    return res.status(401).json({ error: error.message || 'Credenciais inválidas ou falha ao processar login.' });
  }
}

export async function getMe(req, res, next) {
  try {
    // req.user deve ser populado por authMiddleware com o objeto de usuário do Supabase Auth
    if (!req.user || !req.user.id) {
        // Este log pode ser útil para depurar se o middleware está funcionando como esperado
        console.warn('GetMe controller: req.user não definido ou sem ID. Token pode estar ausente ou inválido.');
        return res.status(401).json({ message: 'Não autenticado ou ID do usuário não encontrado no token.'});
    }
    const userId = req.user.id; 
    const userProfile = await userService.getUserById(userId); // Busca da tabela 'profiles'
    
    if (!userProfile) {
        // Isso implica que um usuário auth existe, mas seu perfil na tabela 'profiles' está faltando.
        // Isso pode acontecer se o processo de criação do perfil falhou ou se é um usuário antigo.
        console.warn(`GetMe controller: Perfil não encontrado na tabela 'profiles' para o usuário ID: ${userId}.`);
        return res.status(404).json({ message: 'Perfil do usuário não encontrado na tabela de perfis.' });
    }
    // Retorna os dados do perfil da tabela 'profiles'
    res.status(200).json({ message: 'Dados do perfil do usuário.', user: userProfile });
  } catch (error) {
    console.error('GetMe controller error:', error.message, error.stack);
    next(error); // Passa para o manipulador de erros genérico
  }
}

export async function updateUser(req, res, next) {
   try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Não autenticado ou ID do usuário não encontrado no token.'});
    }
    const userId = req.user.id;
    const updates = req.body; // e.g., { name, photo_url, is_premium }
    
    // userService.updateUserProfile lida com não atualizar id/email na tabela profiles
    const updatedUserProfile = await userService.updateUserProfile(userId, updates);
    res.status(200).json({ message: 'Perfil atualizado com sucesso.', user: updatedUserProfile });
  } catch (error) {
    console.error('UpdateUser controller error:', error.message, error.stack);
    next(error);
  }
}
