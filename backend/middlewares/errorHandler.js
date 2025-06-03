// Middleware genérico para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro não tratado:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor.';

  res.status(statusCode).json({
    status: 'erro',
    statusCode,
    message,
    // Opcional: incluir stack trace em ambiente de desenvolvimento
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
