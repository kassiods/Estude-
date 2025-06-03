// import jwt from 'jsonwebtoken';
// import { supabase } from '../supabase.js';

// Placeholder para middleware de autenticação
const authMiddleware = async (req, res, next) => {
  // Exemplo de como você poderia verificar um token JWT:
  /*
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso não autorizado: Token não fornecido ou mal formatado.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Se estiver usando JWTs auto-gerenciados:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded; // Adiciona os dados do usuário ao objeto req

    // Se estiver usando o Supabase Auth para verificar a sessão a partir de um token:
    // const { data: { user }, error } = await supabase.auth.getUser(token);
    // if (error || !user) {
    //   return res.status(401).json({ message: 'Acesso não autorizado: Token inválido.' });
    // }
    // req.user = user;

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Acesso não autorizado: Token inválido.' });
  }
  */

  // ATENÇÃO: Este é um placeholder. A autenticação real precisa ser implementada.
  // Por enquanto, permite todas as requisições passarem.
  console.warn('Aviso: authMiddleware é um placeholder e não está protegendo rotas.');
  next();
};

export default authMiddleware;
