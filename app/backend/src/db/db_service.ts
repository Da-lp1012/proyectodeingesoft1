import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { loadEnv } from '../config/env';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DbService.name);
  private readonly pool: Pool;

  constructor() {
    // Los datos de conexión vienen de variables de entorno, nunca del código.
    const { db } = loadEnv();
    this.pool = new Pool({
      host: db.host,
      port: db.port,
      user: db.user,
      password: db.password,
      database: db.name,
      connectionTimeoutMillis: 5000, // sin conexión falla en 5 s en vez de quedarse esperando
    });

    // Sin este listener, si la base se cae con conexiones inactivas el evento
    // 'error' no tiene manejador y tumba todo el proceso de Node.
    this.pool.on('error', (error) => {
      this.logger.error(`Error en una conexión inactiva: ${error.message}`);
    });
  }

  // Único punto por donde los repositorios hablan con la base (siempre con parámetros $1, $2...).
  query<T extends QueryResultRow>(text: string, params: unknown[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  // Prueba mínima de conexión. Los alias van entre comillas dobles para que
  // PostgreSQL conserve el camelCase (serverTime).
  async check() {
    const result = await this.pool.query(
      'SELECT current_database() AS "database", current_user AS "user", now() AS "serverTime"',
    );
    return result.rows[0] as { database: string; user: string; serverTime: string };
  }

  // Crea la tabla si no existe (idempotente). Sirve igual para la base remota y para una local.
  private async ensureSchema() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id         SERIAL PRIMARY KEY,
        title      VARCHAR(120) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`);
  }

  // Al arrancar deja en el log si la conexión funciona y prepara el esquema (sirve para la captura de la entrega).
  async onModuleInit() {
    try {
      const info = await this.check();
      this.logger.log(`Conexión OK -> base "${info.database}" como usuario "${info.user}"`);
      await this.ensureSchema();
      this.logger.log('Esquema verificado (tabla items lista)');
    } catch (error) {
      // No se tumba la API: el pool reintenta solo y /api/health reportará database:'down'.
      this.logger.error(`No se pudo preparar la base de datos: ${(error as Error).message}`);
    }
  }

  // Cierre ordenado: Nest lo llama al recibir SIGTERM/SIGINT (enableShutdownHooks).
  async onModuleDestroy() {
    await this.pool.end();
  }
}
