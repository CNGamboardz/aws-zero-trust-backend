import AppError from '../../../domain/errors/AppError.js';

export default function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message, code: error.code });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({ message: 'Error interno del servidor.', code: 'INTERNAL_ERROR' });
}
