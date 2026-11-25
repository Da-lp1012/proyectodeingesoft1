import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { DbService } from '../../db/db_service';

@Controller()
export class HealthController {
  // @Inject explícito: así la inyección no depende de la metadata de tipos de TypeScript
  // (tsx y Vitest usan esbuild, que no la emite).
  constructor(@Inject(DbService) private readonly db: DbService) {}

  // GET /api/health -> frontend -> API -> base de datos. Lo usan el panel de estado y el healthcheck de Docker.
  @Get('api/health')
  async health() {
    const timestamp = new Date().toISOString();
    try {
      await this.db.check();
      return { status: 'ok', api: 'up', database: 'up', timestamp };
    } catch {
      // 503: la API vive pero no puede cumplir su trabajo sin la base.
      throw new ServiceUnavailableException({ status: 'degraded', api: 'up', database: 'down', timestamp });
    }
  }

  // Ruta de la guía (paso B7): devuelve base, usuario y hora del servidor.
  @Get('health/db')
  async healthDb() {
    try {
      const info = await this.db.check();
      return { status: 'ok', ...info };
    } catch (error) {
      throw new ServiceUnavailableException({ status: 'error', message: (error as Error).message });
    }
  }
}
