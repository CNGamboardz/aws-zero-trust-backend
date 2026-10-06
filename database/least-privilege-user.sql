-- Ejecuta como administrador de MySQL y cambia la contraseña antes de usar.
CREATE USER IF NOT EXISTS 'aws_app'@'localhost'
IDENTIFIED BY 'CAMBIA_ESTA_PASSWORD';

-- Mínimo privilegio para este proyecto: leer datos y actualizar token_version al cerrar sesión.
GRANT SELECT, UPDATE ON proyecto_aws.* TO 'aws_app'@'localhost';
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'aws_app'@'localhost';
