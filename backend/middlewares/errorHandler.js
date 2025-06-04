
// Generic error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Erro não tratado:', err.message);
  console.error(err.stack); // Log stack trace for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor.';

  res.status(statusCode).json({
    status: 'erro',
    statusCode,
    message,
    // Optional: include stack trace in development environment
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
