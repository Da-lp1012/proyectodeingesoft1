// Modelo del tablero para RF-ARB-07. Solo los atributos que intervienen en mover una
// tarjeta y aplicar la regla de cierre RN-12; una tarjeta real tiene ademas titulo,
// labels, responsable, fecha y color (RF-ARB-01, RF-ARB-13), omitidos a proposito.

// Las tres columnas fijas del tablero (RF-KAN-01). DONE es la unica que significa "terminado".
export enum Column {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

// Una tarjeta del tablero. isDone() esconde como se representa "Hecho": CompletionRule
// no compara columnas, solo pregunta si la tarjeta esta terminada.
export interface Card {
  id: string;
  teamId: string;
  column: Column;
  position: number;
}

export function isDone(card: Card): boolean {
  return card.column === Column.DONE;
}

// Resultado de mover una tarjeta. Solo se crea con success() o blocked(n), de modo que
// nunca exista un resultado contradictorio (movido y con subtareas pendientes a la vez).
// El texto del mensaje para el usuario lo arma la interfaz (RNF-USA-04).
export class MoveResult {
  private constructor(
    private readonly moved: boolean,
    private readonly pendingCount: number,
  ) {}

  static success(): MoveResult {
    return new MoveResult(true, 0);
  }

  static blocked(pendingCount: number): MoveResult {
    return new MoveResult(false, pendingCount);
  }

  isMoved(): boolean {
    return this.moved;
  }

  getPendingCount(): number {
    return this.pendingCount;
  }
}
