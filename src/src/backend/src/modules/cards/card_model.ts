// Modelo de dominio de una tarjeta (nodo del arbol de proyecto, RF-ARB-07).
// Lo que ve el resto del sistema: camelCase. El repositorio traduce desde la
// forma snake_case de la base (ver card_repository.ts).

// Estados posibles de una tarjeta en el tablero kanban.
// Coincide exactamente con el CHECK de la tabla `tarjetas` (001_rf_arb_07.sql):
//   CHECK (columna IN ('por_hacer', 'en_progreso', 'hecho'))
// Tenerlo como union de literales deja que TypeScript rechace un estado
// invalido antes de llegar a la base.
export type Columna = 'por_hacer' | 'en_progreso' | 'hecho';

// Una tarjeta tal como la ve el servicio, el controlador y el frontend.
// Las fechas viajan como texto ISO (JSON no tiene tipo fecha).
export interface Card {
  id: string; // uuid
  equipoId: string; // uuid, equipo al que pertenece
  padreId: string | null; // uuid del nodo padre; null si es tarea raiz
  responsableId: string | null; // uuid de la membresia responsable; null si no tiene
  titulo: string;
  descripcion: string | null;
  columna: Columna;
  posicion: number;
  fechaLimite: string | null; // fecha ISO (YYYY-MM-DD) o null
  color: string | null;
}

// Lo que hace falta para crear una tarjeta nueva. El id lo pone la base
// (gen_random_uuid()); columna y posicion tienen DEFAULT en la tabla, por eso
// son opcionales aqui.
export interface NewCard {
  equipoId: string;
  titulo: string;
  padreId?: string | null;
  responsableId?: string | null;
  descripcion?: string | null;
  columna?: Columna;
  posicion?: number;
  fechaLimite?: string | null;
  color?: string | null;
}
