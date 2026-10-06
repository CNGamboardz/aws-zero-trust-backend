import UserRepository from '../../domain/ports/UserRepository.js';

export default class MySqlUserRepository extends UserRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findByIdentity(identity) {
    const [rows] = await this.pool.execute(
      `SELECT u.id, u.nombre, u.usuario, u.correo, u.password_hash, u.activo,
              u.token_version, r.nombre AS rol,
              COALESCE(GROUP_CONCAT(DISTINCT p.nombre ORDER BY p.nombre SEPARATOR ','), '') AS permisos_csv
       FROM usuarios u
       INNER JOIN roles r ON r.id = u.rol_id
       LEFT JOIN rol_permisos rp ON rp.rol_id = r.id
       LEFT JOIN permisos p ON p.id = rp.permiso_id
       WHERE u.usuario = ? OR u.correo = ?
       GROUP BY u.id, r.nombre
       LIMIT 1`,
      [identity, identity],
    );

    if (!rows[0]) return null;
    return {
      ...rows[0],
      activo: Boolean(rows[0].activo),
      permisos: rows[0].permisos_csv ? rows[0].permisos_csv.split(',') : [],
    };
  }

  async findAuthContextById(id) {
    const [rows] = await this.pool.execute(
      `SELECT u.id, u.nombre, u.usuario, u.correo, u.activo, u.token_version,
              r.nombre AS rol,
              COALESCE(GROUP_CONCAT(DISTINCT p.nombre ORDER BY p.nombre SEPARATOR ','), '') AS permisos_csv
       FROM usuarios u
       INNER JOIN roles r ON r.id = u.rol_id
       LEFT JOIN rol_permisos rp ON rp.rol_id = r.id
       LEFT JOIN permisos p ON p.id = rp.permiso_id
       WHERE u.id = ?
       GROUP BY u.id, r.nombre
       LIMIT 1`,
      [id],
    );

    if (!rows[0]) return null;
    return {
      ...rows[0],
      activo: Boolean(rows[0].activo),
      permisos: rows[0].permisos_csv ? rows[0].permisos_csv.split(',') : [],
    };
  }

  async incrementTokenVersion(userId) {
    await this.pool.execute(
      'UPDATE usuarios SET token_version = token_version + 1 WHERE id = ?',
      [userId],
    );
  }

  async countActiveUsers() {
    const [rows] = await this.pool.query('SELECT COUNT(*) AS total FROM usuarios WHERE activo = TRUE');
    return Number(rows[0].total);
  }

  async countRoles() {
    const [rows] = await this.pool.query('SELECT COUNT(*) AS total FROM roles');
    return Number(rows[0].total);
  }

  async countPermissions() {
    const [rows] = await this.pool.query('SELECT COUNT(*) AS total FROM permisos');
    return Number(rows[0].total);
  }
}
