// const jwt = require('jsonwebtoken');
// const supabase = require('../supabase'); // Assuming supabase client is exported from there

// Placeholder for authentication middleware
const authMiddleware = async (req, res, next) => {
  // Example using Supabase's way to get user from JWT:
  /*
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso não autorizado: Token não fornecido ou mal formatado.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // If using Supabase Auth to verify the session from a token:
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth middleware error or no user:', error);
      return res.status(401).json({ message: 'Acesso não autorizado: Token inválido ou expirado.' });
    }
    req.user = user; // Add user data to the request object

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Acesso não autorizado: Token inválido.' });
  }
  */

  // ATTENTION: This is a placeholder. Real authentication needs to be implemented.
  // For now, allows all requests to pass through.
  console.warn('Aviso: authMiddleware é um placeholder e não está protegendo rotas.');
  // For testing, you can mock a user:
  // req.user = { id: 'mockUserId', email: 'test@example.com', /* other mock data */ };
  next();
};

module.exports = authMiddleware;
