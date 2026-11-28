import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../../db/db_service';
import { Item, NewItem } from './item_model';

// Contrato que usa el servicio. Los tests lo implementan en memoria, sin Postgres.
export interface ItemRepository {
  findAll(): Promise<Item[]>;
  create(newItem: NewItem): Promise<Item>;
}

// Las interfaces no existen en tiempo de ejecución, así que Nest necesita este token para inyectarla.
export const itemRepositoryToken = Symbol('ItemRepository');

// Forma de la fila tal como sale de la base (snake_case).
interface ItemRow {
  id: number;
  title: string;
  created_at: Date;
}

// Aquí se traduce created_at -> createdAt; el resto del código nunca ve snake_case.
function toItem(row: ItemRow): Item {
  return { id: row.id, title: row.title, createdAt: row.created_at.toISOString() };
}

// Solo acceso a datos: SQL explícito y parametrizado, sin reglas de negocio.
@Injectable()
export class PgItemRepository implements ItemRepository {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async findAll(): Promise<Item[]> {
    const result = await this.db.query<ItemRow>(
      'SELECT id, title, created_at FROM items ORDER BY id',
    );
    return result.rows.map(toItem);
  }

  async create(newItem: NewItem): Promise<Item> {
    const result = await this.db.query<ItemRow>(
      'INSERT INTO items (title) VALUES ($1) RETURNING id, title, created_at',
      [newItem.title],
    );
    return toItem(result.rows[0]);
  }
}
