import { describe, expect, it } from 'vitest';
import { ValidationError } from '../src/common/validation_error';
import { Card, Column } from '../src/modules/dashboard/card_model';
import { CardMoveService } from '../src/modules/dashboard/card_move_service';
import { CompletionRule } from '../src/modules/dashboard/completion_rule';
import { CardRepository } from '../src/modules/dashboard/card_repository';

// Repositorio en memoria: prueba la regla RN-12 sin PostgreSQL. La implementacion real
// contra la base es la tarea T1.2 (Silvana); aqui solo se necesita el contrato.
class InMemoryCardRepository implements CardRepository {
  private cards = new Map<string, Card>();
  private children = new Map<string, Card[]>();
  updates: Array<{ cardId: string; column: Column; position: number }> = [];

  constructor(cards: Card[], children: Record<string, Card[]> = {}) {
    for (const card of cards) this.cards.set(card.id, card);
    for (const [parentId, subtasks] of Object.entries(children)) {
      this.children.set(parentId, subtasks);
    }
  }

  async findById(teamId: string, cardId: string): Promise<Card | null> {
    const card = this.cards.get(cardId);
    if (!card || card.teamId !== teamId) return null; // filtra por equipo (RN-01, RN-06)
    return card;
  }

  async findDirectSubtasks(cardId: string): Promise<Card[]> {
    return this.children.get(cardId) ?? [];
  }

  async updateColumn(cardId: string, column: Column, position: number): Promise<void> {
    this.updates.push({ cardId, column, position });
    const card = this.cards.get(cardId);
    if (card) card.column = column;
  }
}

function card(id: string, column: Column, teamId = 'equipoA'): Card {
  return { id, teamId, column, position: 1 };
}

function buildService(repo: CardRepository): CardMoveService {
  return new CardMoveService(new CompletionRule(), repo);
}

describe('CardMoveService.moveCard (RF-ARB-07 / RN-12)', () => {
  it('mueve el padre a Hecho cuando todas sus subtareas estan en Hecho (AC-ARB-07.2)', async () => {
    const repo = new InMemoryCardRepository(
      [card('P', Column.IN_PROGRESS)],
      { P: [card('S1', Column.DONE), card('S2', Column.DONE)] },
    );
    const result = await buildService(repo).moveCard('equipoA', 'P', Column.DONE, 1);

    expect(result.isMoved()).toBe(true);
    expect(result.getPendingCount()).toBe(0);
    expect(repo.updates).toEqual([{ cardId: 'P', column: Column.DONE, position: 1 }]);
  });

  it('mueve a Hecho una tarjeta sin subtareas', async () => {
    const repo = new InMemoryCardRepository([card('Q', Column.TO_DO)]);
    const result = await buildService(repo).moveCard('equipoA', 'Q', Column.DONE, 1);

    expect(result.isMoved()).toBe(true);
    expect(result.getPendingCount()).toBe(0);
  });

  it('bloquea el cierre con una subtarea pendiente y no guarda nada (AC-ARB-07.1)', async () => {
    const repo = new InMemoryCardRepository(
      [card('P', Column.IN_PROGRESS)],
      { P: [card('S1', Column.DONE), card('S2', Column.IN_PROGRESS)] },
    );
    const result = await buildService(repo).moveCard('equipoA', 'P', Column.DONE, 1);

    expect(result.isMoved()).toBe(false);
    expect(result.getPendingCount()).toBe(1);
    expect(repo.updates).toEqual([]); // nada se guarda
  });

  it('cuenta varias subtareas pendientes (AC-ARB-07.3)', async () => {
    const repo = new InMemoryCardRepository(
      [card('P', Column.IN_PROGRESS)],
      {
        P: [
          card('S1', Column.DONE),
          card('S2', Column.DONE),
          card('S3', Column.DONE),
          card('S4', Column.TO_DO),
          card('S5', Column.IN_PROGRESS),
        ],
      },
    );
    const result = await buildService(repo).moveCard('equipoA', 'P', Column.DONE, 1);

    expect(result.isMoved()).toBe(false);
    expect(result.getPendingCount()).toBe(2);
  });

  it('mover a una columna distinta de Hecho no aplica RN-12 (RF-KAN-04)', async () => {
    const repo = new InMemoryCardRepository(
      [card('P', Column.TO_DO)],
      { P: [card('S1', Column.TO_DO)] }, // hija pendiente, pero el destino no es Hecho
    );
    const result = await buildService(repo).moveCard('equipoA', 'P', Column.IN_PROGRESS, 1);

    expect(result.isMoved()).toBe(true);
    expect(repo.updates).toEqual([{ cardId: 'P', column: Column.IN_PROGRESS, position: 1 }]);
  });

  it('una tarjeta de otro equipo responde como inexistente (CARD_NOT_FOUND, RN-01)', async () => {
    const repo = new InMemoryCardRepository([card('X', Column.TO_DO, 'equipoB')]);
    await expect(buildService(repo).moveCard('equipoA', 'X', Column.DONE, 1)).rejects.toBeInstanceOf(
      ValidationError,
    );
  });
});

describe('CompletionRule.countPending (RN-12)', () => {
  const rule = new CompletionRule();

  it('devuelve 0 con lista vacia', () => {
    expect(rule.countPending([])).toBe(0);
  });

  it('devuelve 0 si todas estan en Hecho', () => {
    expect(rule.countPending([card('S1', Column.DONE), card('S2', Column.DONE)])).toBe(0);
  });

  it('cuenta las que estan en Por hacer o En progreso', () => {
    expect(
      rule.countPending([
        card('S1', Column.DONE),
        card('S2', Column.TO_DO),
        card('S3', Column.IN_PROGRESS),
      ]),
    ).toBe(2);
  });
});
