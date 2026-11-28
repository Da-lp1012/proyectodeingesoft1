import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app_module';
import { DbService } from '../src/db/db_service';
import { Item, NewItem } from '../src/modules/items/item_model';
import { ItemRepository, itemRepositoryToken } from '../src/modules/items/item_repository';

// Misma interfaz que PgItemRepository, pero en memoria: los tests no necesitan Postgres.
class InMemoryItemRepository implements ItemRepository {
  private items: Item[] = [];

  async findAll(): Promise<Item[]> {
    return [...this.items];
  }

  async create(newItem: NewItem): Promise<Item> {
    const item: Item = {
      id: this.items.length + 1,
      title: newItem.title,
      createdAt: new Date().toISOString(),
    };
    this.items.push(item);
    return item;
  }
}

let app: INestApplication;

// Arma la app real (mismos módulos y filtro) reemplazando solo la base y el repositorio.
async function buildApp(databaseUp: boolean): Promise<INestApplication> {
  const fakeDb = {
    check: async () => {
      if (!databaseUp) throw new Error('base caída (simulada)');
      return { database: 'test', user: 'test', serverTime: new Date().toISOString() };
    },
  };

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(DbService)
    .useValue(fakeDb)
    .overrideProvider(itemRepositoryToken)
    .useValue(new InMemoryItemRepository())
    .compile();

  app = moduleRef.createNestApplication({ logger: false });
  await app.init();
  return app;
}

afterEach(async () => {
  await app?.close();
});

describe('walking skeleton', () => {
  it('GET /api/health responde 200 con database:"up"', async () => {
    const server = (await buildApp(true)).getHttpServer();

    const response = await request(server).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', api: 'up', database: 'up' });
    expect(response.body.timestamp).toBeTypeOf('string');
  });

  it('GET /api/health responde 503 con database:"down" si la base falla', async () => {
    const server = (await buildApp(false)).getHttpServer();

    const response = await request(server).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({ api: 'up', database: 'down' });
  });

  it('crea un item y luego aparece en el listado', async () => {
    const server = (await buildApp(true)).getHttpServer();

    const created = await request(server).post('/api/items').send({ title: '  Mi item  ' });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe('Mi item'); // el servicio hace trim

    const list = await request(server).get('/api/items');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).toMatchObject({ id: 1, title: 'Mi item' });
  });

  it('POST con título vacío responde 400', async () => {
    const server = (await buildApp(true)).getHttpServer();

    const response = await request(server).post('/api/items').send({ title: '   ' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTypeOf('string');
  });
});
