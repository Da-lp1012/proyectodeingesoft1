// Lo que ve el resto del sistema. createdAt viaja como texto ISO (JSON no tiene fechas).
export interface Item {
  id: number;
  title: string;
  createdAt: string;
}

// Lo que hace falta para crear uno; id y fecha los pone la base.
export interface NewItem {
  title: string;
}
