import { Card, Column } from './card_model';

// Contrato que usa el Modulo Dashboard para hablar con la persistencia de tarjetas.
// Las firmas y el comportamiento estan especificados en el diseno del equipo
// (docs/design/01_Architectural_and_Detailed_Design.md, seccion 3.2, y
// docs/design/02_Interaction_and_Data_Design.md, secciones 3.4, 3.5 y 3.7).
//
// La implementacion real contra PostgreSQL (PgCardRepository) es la tarea T1.2 de
// Silvana; las pruebas usan una version en memoria. CardMoveService depende de esta
// interfaz y no de PostgreSQL, igual que el walking skeleton separa ItemRepository
// de PgItemRepository.
export interface CardRepository {
  // Busca una tarjeta por equipo e identificador (D2 seccion 3.4). Devuelve null si no
  // existe en ese equipo; una tarjeta de otro equipo tambien devuelve null, de modo que
  // no se distingue de una inexistente (RN-01, RN-06). Es el unico metodo que recibe teamId.
  findById(teamId: string, cardId: string): Promise<Card | null>;

  // Subtareas directas de una tarjeta, es decir las que tienen a cardId como padre
  // (D2 seccion 3.5). Lista vacia si no tiene. Solo el nivel directo, sin nietas.
  findDirectSubtasks(cardId: string): Promise<Card[]>;

  // Guarda la columna y la posicion de una tarjeta (D2 seccion 3.7). No aplica reglas:
  // la decision de RN-12 ya la tomo CardMoveService antes de llamar aqui.
  updateColumn(cardId: string, column: Column, position: number): Promise<void>;
}

// Las interfaces no existen en tiempo de ejecucion, asi que Nest necesita este token
// para inyectar la implementacion. El modulo decide cual usar (PgCardRepository en la
// app, una en memoria en los tests).
export const cardRepositoryToken = Symbol('CardRepository');
