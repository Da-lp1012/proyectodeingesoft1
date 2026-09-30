# RF-KAN · Tablero kanban

Módulo: tablero por equipo, tarjetas, movimiento entre columnas, edición, eliminación y filtros. El árbol de subtareas está en [rf-arbol-proyecto.md](rf-arbol-proyecto.md). Convenciones en el [índice](README.md#15-convenciones).

---

### RF-KAN-01 · Tablero con tres columnas
El sistema debe ofrecer a cada equipo un tablero con exactamente tres columnas, en este orden: *Por hacer*, *En progreso* y *Hecho*, mostrando en cada una sus tarjetas.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-11
- **Justificación:** columnas fijas mantienen el producto minimalista y hacen posible la regla de cierre del árbol (`RF-ARB-07`), que depende de saber cuál columna significa "terminado".
- **Verificación:** Demostración — abrir el tablero de un equipo nuevo y de uno con tarjetas.

### RF-KAN-02 · Creación de tarjeta
El sistema debe permitir a un miembro crear una tarjeta en el tablero de su equipo con un título obligatorio y, opcionalmente, descripción, labels, responsable y fecha límite; la tarjeta nueva debe ubicarse en *Por hacer*.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-12
- **Verificación:** Prueba — crear solo con título (éxito, aparece en *Por hacer*); intentar sin título (rechazo).

### RF-KAN-03 · Labels de la tarjeta
El sistema debe permitir asociar a una tarjeta cero o más labels, únicamente de entre los definidos en su equipo (`RF-LAB-01`).

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-12
- **Justificación:** una tarjeta suele necesitar más de una clasificación a la vez (*backend* + *importancia 5*).
- **Verificación:** Prueba — asociar dos labels del equipo (éxito); intentar asociar un label de otro equipo (rechazo).

### RF-KAN-04 · Movimiento entre columnas
El sistema debe permitir a un miembro mover una tarjeta a otra columna arrastrándola y soltándola, conservando la posición en la que se soltó dentro de la columna, y guardar el cambio de inmediato.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-13
- **Verificación:** Prueba — mover una tarjeta, recargar la página: sigue en la nueva columna y posición.

### RF-KAN-05 · Propagación en tiempo real del tablero
El sistema debe reflejar cualquier creación, movimiento, edición o eliminación de tarjeta en los tableros de los demás miembros que lo tengan abierto, sin que recarguen. El tiempo máximo lo fija `RNF-REN-02`.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-13, HU-34
- **Verificación:** Demostración — dos navegadores con el mismo tablero; el movimiento en uno se ve en el otro.

### RF-KAN-06 · Edición de tarjeta
El sistema debe permitir a un miembro modificar el título, la descripción, los labels, el responsable y la fecha límite de una tarjeta de su equipo.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-34
- **Verificación:** Prueba — editar cada campo y comprobar que persiste tras recargar.

### RF-KAN-07 · Eliminación de tarjeta
El sistema debe permitir a un miembro eliminar una tarjeta de su equipo, previa confirmación explícita. El efecto sobre las subtareas lo define `RF-ARB-12`.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-34
- **Verificación:** Prueba — eliminar y cancelar (la tarjeta sigue); eliminar y confirmar (desaparece).

### RF-KAN-08 · Filtro por responsable o label
El sistema debe permitir filtrar las tarjetas visibles del tablero por responsable, por label o por ambos a la vez, sin modificar los datos.

- **Prioridad:** Could · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-14
- **Verificación:** Prueba — filtrar por "Ana" y comprobar que solo se ven tarjetas cuyo responsable es Ana; quitar el filtro y comprobar que vuelven todas.
