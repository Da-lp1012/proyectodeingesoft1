import { Inject, Injectable } from '@nestjs/common';
import { ValidationError } from '../../common/validation_error';
import { Column, MoveResult } from './card_model';
import { CompletionRule } from './completion_rule';
import { CardRepository, cardRepositoryToken } from './card_repository';

// Reglas de negocio de RF-ARB-07 (ADR 0003). No sabe de HTTP ni de SQL: depende de la
// interfaz CardRepository y de CompletionRule. Atiende la solicitud explicita de mover
// una tarjeta; cuando el destino es Hecho, aplica RN-12 antes de guardar.
//
// Supuesto (diseno 3.4): la validacion de la entrada y la membresia del equipo ya se
// hicieron antes de llegar aqui (en BoardController.requestMoveCard, tarea de API). Este
// servicio no valida entrada ni membresia ni emite eventos de WebSocket.
@Injectable()
export class CardMoveService {
  constructor(
    private readonly rule: CompletionRule,
    @Inject(cardRepositoryToken) private readonly cards: CardRepository,
  ) {}

  // Devuelve MoveResult.success() si la tarjeta se movio, o MoveResult.blocked(n) si la
  // regla RN-12 lo impide (n = subtareas directas fuera de Hecho). Lanza ValidationError
  // (CARD_NOT_FOUND) si la tarjeta no existe en el equipo.
  //
  // Los pasos de leer las subtareas y guardar el movimiento deben ejecutarse como una
  // sola operacion atomica (Risk 2 del REQ); el mecanismo (transaccion) se resuelve en la
  // capa de persistencia (T1.2) y queda como OQ-4.
  async moveCard(
    teamId: string,
    cardId: string,
    targetColumn: Column,
    position: number,
  ): Promise<MoveResult> {
    const card = await this.cards.findById(teamId, cardId);
    if (card === null) {
      throw new ValidationError('La tarjeta no existe'); // CARD_NOT_FOUND: no se guarda nada
    }

    // RF-KAN-04: la regla de cierre solo aplica al mover a Hecho. Otras columnas se guardan directo.
    if (targetColumn !== Column.DONE) {
      await this.cards.updateColumn(cardId, targetColumn, position);
      return MoveResult.success();
    }

    const subtasks = await this.cards.findDirectSubtasks(cardId);
    const pending = this.rule.countPending(subtasks); // 0 si la tarjeta no tiene subtareas
    if (pending > 0) {
      return MoveResult.blocked(pending); // RN-12: nada se guarda
    }

    await this.cards.updateColumn(cardId, Column.DONE, position);
    return MoveResult.success();
  }
}
