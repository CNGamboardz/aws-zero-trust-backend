import AppError from '../../domain/errors/AppError.js';

export default class LoginUser {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ identity, password }) {
    const user = await this.userRepository.findByIdentity(identity);

    // Respuesta genérica para evitar enumeración de usuarios.
    if (!user || !user.activo) {
      throw new AppError('Credenciales inválidas.', 401, 'INVALID_CREDENTIALS');
    }

    const passwordMatches = await this.passwordHasher.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AppError('Credenciales inválidas.', 401, 'INVALID_CREDENTIALS');
    }

    const token = this.tokenService.sign({
      sub: String(user.id),
      ver: user.token_version,
    });

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        correo: user.correo,
        rol: user.rol,
        permisos: user.permisos,
      },
    };
  }
}
