import AppError from '../../../domain/errors/AppError.js';

export default function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError('Datos de entrada inválidos.', 400, 'VALIDATION_ERROR'));
    }
    req.validatedBody = result.data;
    next();
  };
}
