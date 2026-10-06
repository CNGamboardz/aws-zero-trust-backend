import AppError from '../../../domain/errors/AppError.js';

export default function authorize(permission) {
  return (req, _res, next) => {
    if (!req.auth?.permisos?.includes(permission)) {
      return next(new AppError('No tienes permiso para acceder a este recurso.', 403, 'FORBIDDEN'));
    }
    next();
  };
}
