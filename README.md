# AWS Zero Trust Backend

Backend Node.js + Express + MySQL con arquitectura inspirada en Hexagonal / Ports & Adapters.

## Capas
- `domain`: errores y contratos/puertos del negocio.
- `application`: casos de uso (`LoginUser`, `GetDashboardStats`).
- `infrastructure`: MySQL, bcrypt y JWT.
- `interfaces/http`: Express, controladores, rutas y middlewares.

La lógica de aplicación no depende directamente de Express ni de MySQL.

## Seguridad / Zero Trust
- JWT firmado y con expiración corta.
- El middleware verifica firma, expiración, issuer y audience.
- No se confía solamente en los claims: cada solicitud protegida vuelve a consultar usuario activo, `token_version`, rol y permisos.
- Logout revoca tokens incrementando `token_version`.
- RBAC y permiso `dashboard.view`.
- bcrypt con factor 12.
- Helmet.
- Rate limit en login.
- Validación Zod.
- Respuestas de login genéricas para reducir enumeración de usuarios.
- CORS allowlist.
- Usuario MySQL de mínimo privilegio.
- El `.env` queda fuera de Git.

## 1. Instalar
```bash
cp .env.example .env
npm install
```

## 2. Crear tablas
```bash
sudo mysql < database/schema.sql
```

## 3. Usuario MySQL de aplicación
Edita `database/least-privilege-user.sql` y ejecútalo:
```bash
sudo mysql < database/least-privilege-user.sql
```
Actualiza `DB_USER`, `DB_PASSWORD` y demás valores del `.env`.

> Para ejecutar `npm run seed:admin`, el usuario de BD necesita temporalmente `INSERT` además de `SELECT, UPDATE`, o puedes crear el administrador con una cuenta de migración y después volver al usuario de mínimo privilegio.

Ejemplo temporal:
```sql
GRANT SELECT, INSERT, UPDATE ON proyecto_aws.* TO 'aws_app'@'localhost';
```
Después del seed:
```sql
REVOKE INSERT ON proyecto_aws.* FROM 'aws_app'@'localhost';
```

## 4. Crear administrador
Completa en `.env` las variables `INITIAL_ADMIN_*` y ejecuta:
```bash
npm run seed:admin
```

## 5. Desarrollo
```bash
npm run dev
```

Prueba:
```bash
curl http://localhost:3000/api/health
```

Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"identity":"admin","password":"TU_PASSWORD_ADMIN"}'
```

## PM2 en EC2
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Segmentación recomendada en AWS
- Frontend EC2: público mediante Nginx, puertos 80/443.
- Backend EC2: puerto 3000 accesible únicamente desde el Security Group del frontend/Nginx.
- MySQL: 3306 accesible únicamente desde el Security Group del backend, o MySQL local al backend.
- SSH: restringido a tu IP administrativa, no `0.0.0.0/0`.
- Producción: HTTPS obligatorio.

## Repositorio GitHub
```bash
git init
git add .
git commit -m "feat: backend hexagonal con JWT, RBAC y Zero Trust"
git branch -M main
git remote add origin https://github.com/CNGamboardz/aws-zero-trust-backend.git
git push -u origin main
```
