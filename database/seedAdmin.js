import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { env } from '../src/config/env.js';

const required = [
  env.INITIAL_ADMIN_NAME,
  env.INITIAL_ADMIN_USERNAME,
  env.INITIAL_ADMIN_EMAIL,
  env.INITIAL_ADMIN_PASSWORD,
];

if (required.some((value) => !value)) {
  console.error('Define INITIAL_ADMIN_NAME, INITIAL_ADMIN_USERNAME, INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD en .env');
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

try {
  const [roles] = await connection.execute('SELECT id FROM roles WHERE nombre = ? LIMIT 1', ['admin']);
  if (!roles[0]) throw new Error('No existe el rol admin. Ejecuta database/schema.sql primero.');

  const hash = await bcrypt.hash(env.INITIAL_ADMIN_PASSWORD, 12);
  await connection.execute(
    `INSERT INTO usuarios (nombre, usuario, correo, password_hash, rol_id)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       nombre = VALUES(nombre),
       password_hash = VALUES(password_hash),
       rol_id = VALUES(rol_id),
       activo = TRUE,
       token_version = token_version + 1`,
    [env.INITIAL_ADMIN_NAME, env.INITIAL_ADMIN_USERNAME, env.INITIAL_ADMIN_EMAIL, hash, roles[0].id],
  );
  console.log('Administrador inicial creado/actualizado correctamente.');
} finally {
  await connection.end();
}
