import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { container } from './container.js';
import authRoutes from './interfaces/http/routes/authRoutes.js';
import dashboardRoutes from './interfaces/http/routes/dashboardRoutes.js';
import errorHandler from './interfaces/http/middlewares/errorHandler.js';
import AppError from './domain/errors/AppError.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Zero Trust API</title>
  <style>
    :root {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #e9f3ff;
      background: #07111f;
      --panel: #0f1d30;
      --border: #20334d;
      --muted: #8da1b8;
      --cyan: #39d0ff;
      --green: #34d399;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 15% 10%, rgba(57, 208, 255, .15), transparent 28%),
        radial-gradient(circle at 85% 80%, rgba(77, 124, 255, .12), transparent 30%),
        #07111f;
    }
    .shell { max-width: 1180px; margin: 0 auto; padding: 54px 24px 70px; }
    .topline {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      margin-bottom: 42px;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo {
      width: 46px; height: 46px; display: grid; place-items: center; border-radius: 13px;
      background: linear-gradient(135deg, #39d0ff, #4d7cff); color: #04101c; font-weight: 900;
    }
    .brand strong { display: block; }
    .brand span { display: block; color: #72879f; font-size: 12px; margin-top: 2px; }
    .status {
      display: inline-flex; align-items: center; gap: 8px; padding: 8px 11px; border-radius: 999px;
      border: 1px solid rgba(52, 211, 153, .2); color: #a7f3d0; background: rgba(52, 211, 153, .08);
      font-size: 12px; font-weight: 800;
    }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 4px rgba(52,211,153,.12); }
    .hero { display: grid; grid-template-columns: 1.15fr .85fr; gap: 24px; align-items: stretch; }
    .hero-card, .panel {
      background: linear-gradient(180deg, rgba(15,29,48,.96), rgba(11,23,39,.96));
      border: 1px solid var(--border); border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,.18);
    }
    .hero-card { padding: 34px; }
    .eyebrow { margin: 0 0 10px; color: var(--cyan); text-transform: uppercase; letter-spacing: .14em; font-size: 11px; font-weight: 900; }
    h1 { margin: 0 0 14px; font-size: clamp(34px, 5vw, 58px); line-height: 1; letter-spacing: -.04em; }
    .lead { margin: 0; max-width: 700px; color: var(--muted); line-height: 1.7; }
    .stack { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 24px; }
    .chip { padding: 8px 10px; border-radius: 9px; background: #0b1727; border: 1px solid #1d324a; color: #a9bdd2; font-size: 12px; font-weight: 800; }
    .panel { padding: 24px; }
    .panel h2 { margin: 0 0 16px; font-size: 18px; }
    .metric-grid { display: grid; gap: 10px; }
    .metric {
      display: flex; align-items: center; justify-content: space-between; gap: 14px;
      padding: 13px; border-radius: 12px; background: #0b1727; border: 1px solid #1c3048;
    }
    .metric span { color: #7990a8; font-size: 12px; }
    .metric strong { font-size: 13px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 18px; }
    .card { padding: 20px; border-radius: 16px; background: #0d1b2d; border: 1px solid #1f354e; }
    .card b { display: block; margin-bottom: 6px; }
    .card p { margin: 0; color: #788ea6; font-size: 13px; line-height: 1.55; }
    .routes { margin-top: 18px; }
    .route {
      display: grid; grid-template-columns: 64px 1fr auto; gap: 12px; align-items: center;
      padding: 12px 0; border-bottom: 1px solid #1b3047;
    }
    .route:last-child { border-bottom: 0; }
    .method { color: #91e7ff; font-size: 11px; font-weight: 900; }
    code { color: #dce8f5; }
    .guard { color: #89d8ad; font-size: 11px; font-weight: 800; }
    footer { margin-top: 24px; color: #617890; font-size: 12px; text-align: center; }
    @media (max-width: 860px) {
      .hero, .grid { grid-template-columns: 1fr; }
      .topline { align-items: flex-start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <div class="topline">
      <div class="brand">
        <div class="logo">API</div>
        <div><strong>Zero Trust Backend</strong><span>Node.js · Express · PM2 · MySQL</span></div>
      </div>
      <span class="status"><i class="dot"></i> Servicio disponible</span>
    </div>

    <section class="hero">
      <article class="hero-card">
        <p class="eyebrow">Backend seguro</p>
        <h1>API protegida por identidad y mínimo privilegio.</h1>
        <p class="lead">
          Servicio REST desacoplado con autenticación JWT, autorización RBAC,
          validación de solicitudes y persistencia MySQL.
        </p>
        <div class="stack">
          <span class="chip">Node.js</span>
          <span class="chip">Express</span>
          <span class="chip">PM2</span>
          <span class="chip">JWT</span>
          <span class="chip">RBAC</span>
          <span class="chip">MySQL</span>
        </div>
      </article>

      <aside class="panel">
        <h2>Estado del servicio</h2>
        <div class="metric-grid">
          <div class="metric"><span>Entorno</span><strong>${env.NODE_ENV}</strong></div>
          <div class="metric"><span>Puerto API</span><strong>${env.PORT}</strong></div>
          <div class="metric"><span>Base de datos</span><strong>MySQL local</strong></div>
          <div class="metric"><span>Autenticación</span><strong>JWT</strong></div>
          <div class="metric"><span>Autorización</span><strong>RBAC</strong></div>
        </div>
      </aside>
    </section>

    <section class="grid">
      <article class="card">
        <b>Interfaces HTTP</b>
        <p>Routes, controllers y middlewares reciben y validan cada solicitud.</p>
      </article>
      <article class="card">
        <b>Application / Domain</b>
        <p>Casos de uso y puertos mantienen la lógica desacoplada de la infraestructura.</p>
      </article>
      <article class="card">
        <b>Infrastructure</b>
        <p>Repositorios MySQL, bcrypt y servicio JWT implementan las dependencias externas.</p>
      </article>
    </section>

    <section class="panel routes">
      <p class="eyebrow">Endpoints principales</p>
      <div class="route"><span class="method">GET</span><code>/api/health</code><span class="guard">Público</span></div>
      <div class="route"><span class="method">POST</span><code>/api/auth/login</code><span class="guard">Credenciales</span></div>
      <div class="route"><span class="method">GET</span><code>/api/auth/me</code><span class="guard">JWT</span></div>
      <div class="route"><span class="method">GET</span><code>/api/dashboard/stats</code><span class="guard">JWT + RBAC</span></div>
    </section>

    <footer>Zero Trust Backend · Verificación explícita · Mínimo privilegio · Segmentación</footer>
  </main>
</body>
</html>`);
});

app.get('/api/health', async (_req, res, next) => {
  try {
    await container.pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes({
  authController: container.authController,
  authenticate: container.authenticate,
}));

app.use('/api/dashboard', dashboardRoutes({
  dashboardController: container.dashboardController,
  authenticate: container.authenticate,
}));

app.use((_req, _res, next) => next(new AppError('Ruta no encontrada.', 404, 'NOT_FOUND')));
app.use(errorHandler);

export default app;
