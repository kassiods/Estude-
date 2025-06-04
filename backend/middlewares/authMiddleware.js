import supabase from '../supabase.js';

const authMiddleware = async (req, res, next) => {
  console.log('Auth Middleware: Received Authorization Header:', req.headers.authorization); 
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('Auth Middleware: Token não fornecido ou mal formatado.');
    return res.status(401).json({ message: 'Acesso não autorizado: Token não fornecido ou mal formatado.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth middleware error or no user:', error ? error.message : 'No user for token');
      return res.status(401).json({ message: 'Acesso não autorizado: Token inválido ou expirado.' });
    }
    
    req.user = user; 
    next();
  } catch (error) {
    console.error('Erro de autenticação no middleware (catch block):', error.message, error.stack);
    // Changed to 500 as per user prompt's implied suggestion for catch-all in auth middleware
    return res.status(500).json({ message: 'Erro interno no servidor durante a autenticação.' });
  }
};

export default authMiddleware;
