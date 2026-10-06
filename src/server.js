import app from './app.js';
import { env } from './config/env.js';
import { container } from './container.js';

async function start() {
  await container.pool.query('SELECT 1');
  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Backend escuchando en puerto ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error('No fue posible iniciar el backend:', error.message);
  process.exit(1);
});
