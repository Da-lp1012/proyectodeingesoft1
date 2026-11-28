import { describe, expect, it } from 'vitest';
import { Card, Column, MoveResult } from '../src/modules/dashboard/card_model';
import { CompletionRule } from '../src/modules/dashboard/completion_rule';

function card(column: Column): Card {
  return { id: 'x', teamId: 'equipoA', column, position: 1 };
}

describe('CompletionRule.countPending (RN-12)', () => {
  const rule = new CompletionRule();

  it('devuelve 0 con una lista vacia', () => {
    expect(rule.countPending([])).toBe(0);
  });

  it('devuelve 0 si todas las subtareas estan en Hecho', () => {
    expect(rule.countPending([card(Column.DONE), card(Column.DONE)])).toBe(0);
  });

  it('cuenta las que estan en Por hacer o En progreso (AC-ARB-07.3)', () => {
    const subtasks = [
      card(Column.DONE),
      card(Column.DONE),
      card(Column.DONE),
      card(Column.TO_DO),
      card(Column.IN_PROGRESS),
    ];
    expect(rule.countPending(subtasks)).toBe(2);
  });

  it('cuenta una sola subtarea pendiente (AC-ARB-07.1)', () => {
    expect(rule.countPending([card(Column.DONE), card(Column.IN_PROGRESS)])).toBe(1);
  });

  it('no supera el tamano de la lista', () => {
    const subtasks = [card(Column.TO_DO), card(Column.IN_PROGRESS)];
    expect(rule.countPending(subtasks)).toBe(2);
  });
});

describe('MoveResult', () => {
  it('success() indica movido y 0 pendientes', () => {
    const result = MoveResult.success();
    expect(result.isMoved()).toBe(true);
    expect(result.getPendingCount()).toBe(0);
  });

  it('blocked(n) indica no movido y n pendientes', () => {
    const result = MoveResult.blocked(3);
    expect(result.isMoved()).toBe(false);
    expect(result.getPendingCount()).toBe(3);
  });
});
