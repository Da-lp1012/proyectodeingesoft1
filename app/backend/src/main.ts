import 'dotenv/config'; // debe ir primero: carga el .env (si existe) antes de leer variables
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app_module';
import { loadEnv } from './config/env';

async function bootstrap() {
  const env = loadEnv(); // falla aquí, con mensaje claro, si falta alguna variable
  const app = await NestFactory.create(AppModule);

  // Al recibir SIGTERM/SIGINT Nest llama onModuleDestroy y cierra el pool de conexiones.
  app.enableShutdownHooks();

  // 0.0.0.0: dentro de Docker hay que escuchar en todas las interfaces para ser accesible.
  await app.listen(env.port, '0.0.0.0');
}

bootstrap().catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});
