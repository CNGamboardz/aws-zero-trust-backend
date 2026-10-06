import AppError from '../../../domain/errors/AppError.js';

export default function authenticate({ tokenService, userRepository }) {
  return async (req, _res, next) => {
    try {
      const header = req.get('authorization');
      if (!header?.startsWith('Bearer ')) {
        throw new AppError('Autenticación requerida.', 401, 'AUTH_REQUIRED');
      }

      const token = header.slice(7);
      const payload = tokenService.verify(token);

      // Zero Trust: no se confía únicamente en el contenido del JWT.
      // Se vuelve a consultar el estado del usuario y sus permisos.
      const user = await userRepository.findAuthContextById(payload.sub);
      if (!user || !user.activo || Number(payload.ver) !== Number(user.token_version)) {
        throw new AppError('Sesión inválida o revocada.', 401, 'INVALID_SESSION');
      }

      req.auth = {
        userId: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        correo: user.correo,
        rol: user.rol,
        permisos: user.permisos,
      };
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        return next(new AppError('Token inválido o expirado.', 401, 'INVALID_TOKEN'));
      }
      next(error);
    }
  };
}
