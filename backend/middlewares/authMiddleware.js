
import supabase from '../supabase.js'; // Assuming supabase client is exported from there

const authMiddleware = async (req, res, next) => {
  console.log('Auth Middleware: Received Authorization Header:', req.headers.authorization); // Log para depuração
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('Auth Middleware: Token não fornecido ou mal formatado.');
    return res.status(401).json({ message: 'Acesso não autorizado: Token não fornecido ou mal formatado.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token with Supabase
    // Note: The supabase client used here should be configured with the anon key
    // if it's just for getUser, or service_role if it needs elevated privileges
    // but getUser typically works with anon key if RLS allows or for the user themselves.
    // The current `../supabase.js` is likely configured with SERVICE_ROLE.
    // For `getUser(token)`, it's fine.
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth middleware error or no user:', error ? error.message : 'No user for token');
      return res.status(401).json({ message: 'Acesso não autorizado: Token inválido ou expirado.' });
    }
    
    // Attach the Supabase user object (which includes id, email, etc.) to the request object
    req.user = user; 
    next();
  } catch (error) {
    // This catch block might be redundant if supabase.auth.getUser handles its own errors gracefully
    // and returns them in the 'error' object, but it's good for unexpected issues.
    console.error('Erro de autenticação no middleware (catch block):', error.message);
    return res.status(401).json({ message: 'Acesso não autorizado: Erro ao processar o token.' });
  }
};

export default authMiddleware;
