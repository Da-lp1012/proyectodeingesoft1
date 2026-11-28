import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../../db/db_service';
import { Card, Columna, NewCard } from './card_model';

// Contrato que usa el servicio (T2.1 de David). Un test puede implementarlo en
// memoria, sin Postgres, igual que con items.
export interface CardRepository {
  // Todas las tarjetas de un equipo (lista plana; el arbol se arma por padreId
  // en el servicio o el frontend, no aqui).
  findByTeam(equipoId: string): Promise<Card[]>;
  // Una tarjeta por id. null si no existe (el servicio decide si es un 404).
  findById(id: string): Promise<Card | null>;
  // Subtareas directas de un nodo.
  findChildren(padreId: string): Promise<Card[]>;
  // Cuenta las subtareas directas que NO estan en 'hecho'. Base de RN-12:
  // si devuelve > 0, el padre no se puede cerrar.
  countOpenChildren(padreId: string): Promise<number>;
  // Cambia el estado de una tarjeta. Devuelve la tarjeta actualizada, o null si
  // no existe (el servicio decide si es un 404).
  updateColumna(id: string, columna: Columna): Promise<Card | null>;
  // Crea una tarjeta.
  create(newCard: NewCard): Promise<Card>;
}

// Las interfaces no existen en runtime; Nest necesita este token para inyectarla.
export const cardRepositoryToken = Symbol('CardRepository');

// Columnas que se leen de la tabla, en el mismo orden en todas las consultas.
const cardColumns =
  'id, equipo_id, padre_id, responsable_id, titulo, descripcion, columna, posicion, fecha_limite, color';

// Forma de la fila tal como sale de la base (snake_case).
interface CardRow {
  id: string;
  equipo_id: string;
  padre_id: string | null;
  responsable_id: string | null;
  titulo: string;
  descripcion: string | null;
  columna: Columna;
  posicion: number;
  fecha_limite: Date | null;
  color: string | null;
}

// Traduce snake_case -> camelCase; el resto del sistema nunca ve snake_case.
// fecha_limite (DATE) sale como Date de pg; se expone como 'YYYY-MM-DD'.
function toCard(row: CardRow): Card {
  return {
    id: row.id,
    equipoId: row.equipo_id,
    padreId: row.padre_id,
    responsableId: row.responsable_id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    columna: row.columna,
    posicion: row.posicion,
    fechaLimite: row.fecha_limite ? row.fecha_limite.toISOString().slice(0, 10) : null,
    color: row.color,
  };
}

// Solo acceso a datos: SQL explicito y parametrizado ($1, $2...), sin reglas de
// negocio. La validacion de RN-12 vive en el servicio (ADR 0003), no aqui.
@Injectable()
export class PgCardRepository implements CardRepository {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async findByTeam(equipoId: string): Promise<Card[]> {
    const result = await this.db.query<CardRow>(
      `SELECT ${cardColumns} FROM tarjetas WHERE equipo_id = $1 ORDER BY posicion, id`,
      [equipoId],
    );
    return result.rows.map(toCard);
  }

  async findById(id: string): Promise<Card | null> {
    const result = await this.db.query<CardRow>(
      `SELECT ${cardColumns} FROM tarjetas WHERE id = $1`,
      [id],
    );
    return result.rows.length > 0 ? toCard(result.rows[0]) : null;
  }

  async findChildren(padreId: string): Promise<Card[]> {
    const result = await this.db.query<CardRow>(
      `SELECT ${cardColumns} FROM tarjetas WHERE padre_id = $1 ORDER BY posicion, id`,
      [padreId],
    );
    return result.rows.map(toCard);
  }

  async countOpenChildren(padreId: string): Promise<number> {
    // count(*) es bigint y pg lo devuelve como string; ::int lo trae ya como
    // number para que el servicio pueda comparar con 0 sin sorpresas.
    const result = await this.db.query<{ total: number }>(
      `SELECT count(*)::int AS total FROM tarjetas WHERE padre_id = $1 AND columna <> 'hecho'`,
      [padreId],
    );
    return result.rows[0].total;
  }

  async updateColumna(id: string, columna: Columna): Promise<Card | null> {
    const result = await this.db.query<CardRow>(
      `UPDATE tarjetas SET columna = $2 WHERE id = $1 RETURNING ${cardColumns}`,
      [id, columna],
    );
    return result.rows.length > 0 ? toCard(result.rows[0]) : null;
  }

  async create(newCard: NewCard): Promise<Card> {
    const result = await this.db.query<CardRow>(
      `INSERT INTO tarjetas
         (equipo_id, padre_id, responsable_id, titulo, descripcion, columna, posicion, fecha_limite, color)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'por_hacer'), COALESCE($7, 0), $8, $9)
       RETURNING ${cardColumns}`,
      [
        newCard.equipoId,
        newCard.padreId ?? null,
        newCard.responsableId ?? null,
        newCard.titulo,
        newCard.descripcion ?? null,
        newCard.columna ?? null,
        newCard.posicion ?? null,
        newCard.fechaLimite ?? null,
        newCard.color ?? null,
      ],
    );
    return toCard(result.rows[0]);
  }
}
