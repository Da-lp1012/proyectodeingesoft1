import { Card, Column } from './card_model';

// Contrato que usa CardMoveService para hablar con la persistencia de tarjetas.
// La implementacion real (PgCardRepository, contra PostgreSQL) es la tarea T1.2 de
// Silvana; las pruebas usan una version en memoria. El servicio depende de esta
// interfaz y no de PostgreSQL, igual que el walking skeleton separa ItemRepository
// de PgItemRepository.
export interface CardRepository {
  // Busca una tarjeta por equipo e identificador. Devuelve null si no existe en ese
  // equipo (una tarjeta de otro equipo tambien devuelve null: no se distingue de una
  // inexistente, RN-01 y RN-06). Es el unico metodo que recibe teamId.
  findById(teamId: string, cardId: string): Promise<Card | null>;

  // Subtareas directas de una tarjeta (Tarjeta.padre_id = cardId). Lista vacia si no tiene.
  findDirectSubtasks(cardId: string): Promise<Card[]>;

  // Guarda la columna y la posicion de una tarjeta.
  updateColumn(cardId: string, column: Column, position: number): Promise<void>;
}

// Las interfaces no existen en tiempo de ejecucion, asi que Nest necesita este token
// para inyectar la implementacion. El modulo decide cual usar (PgCardRepository en la
// app, una en memoria en los tests).
export const cardRepositoryToken = Symbol('CardRepository');
