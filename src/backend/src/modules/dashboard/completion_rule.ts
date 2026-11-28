import { Injectable } from '@nestjs/common';
import { Card, isDone } from './card_model';

// Regla RN-12: decide cuantas subtareas directas impiden cerrar una tarjeta.
// No consulta la base de datos: recibe la lista de subtareas y devuelve un numero,
// asi se puede probar sin Postgres (RNF-MAN-02). Si cambia que cuenta como
// "pendiente" (Open Question 3 del REQ), solo hay que tocar esta clase.
@Injectable()
export class CompletionRule {
  // Cuenta las subtareas directas que NO estan en Hecho. 0 si la lista esta vacia.
  countPending(subtasks: Card[]): number {
    return subtasks.filter((subtask) => !isDone(subtask)).length;
  }
}
