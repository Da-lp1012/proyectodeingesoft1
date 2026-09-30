# RF-ARB · Árbol de proyecto

Módulo: subtareas, progreso del padre, bloqueo de cierre, vista de esquema, reorganización y color por rama. Depende del tablero ([rf-kanban.md](rf-kanban.md)). Convenciones en el [índice](README.md#15-convenciones).

---

### RF-ARB-01 · Creación de subtarea
El sistema debe permitir a un miembro crear una tarjeta como subtarea de otra tarjeta del mismo equipo; la subtarea es una tarjeta completa del tablero (con columna, labels, responsable y fecha) que además registra cuál es su tarea padre.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-29
- **Justificación:** convierte un trabajo grande en pasos concretos que se pueden repartir entre personas con distintas habilidades.
- **Verificación:** Prueba — crear subtarea desde una tarjeta; aparece en *Por hacer* y su detalle indica el padre.

### RF-ARB-02 · Profundidad ilimitada
El sistema debe permitir que una subtarea tenga a su vez subtareas, sin límite en el número de niveles.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-29
- **Verificación:** Prueba — crear una cadena de cuatro niveles y comprobar que cada tarjeta muestra su padre correcto.

### RF-ARB-03 · Sin herencia al crear
Al crear una subtarea, el sistema debe dejar vacíos sus labels, responsable, fecha límite y color, sin copiar los valores de la tarea padre.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-29
- **Justificación:** el propósito de dividir es repartir; copiar el responsable iría en contra. El color no se copia porque se muestra por rama (`RF-ARB-14`).
- **Verificación:** Prueba — padre con label, responsable y color; crear subtarea y comprobar que los tres campos están vacíos.

### RF-ARB-04 · Referencia al padre en la tarjeta
El sistema debe mostrar en cada subtarea, tanto en el tablero como en su detalle, el título de su tarea padre con un enlace que abra el detalle del padre.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-30
- **Verificación:** Demostración — tarjeta subtarea muestra "↳ parte de: <padre>" y el enlace funciona.

### RF-ARB-05 · Indicador de progreso
El sistema debe mostrar en cada tarjeta que tenga subtareas el número de subtareas directas en *Hecho* sobre el total de subtareas directas (por ejemplo "3/5"); el valor debe reflejar siempre el estado actual de las subtareas.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-30
- **Justificación:** el progreso se deriva del estado de las hijas; si se almacenara aparte podría quedar desactualizado.
- **Verificación:** Prueba — padre con 5 subtareas; mover 3 a *Hecho*; el indicador muestra "3/5"; mover una de vuelta; muestra "2/5".

### RF-ARB-06 · Subtareas en el detalle
El sistema debe mostrar en el detalle de una tarjeta la lista de sus subtareas directas, con la columna actual y el responsable de cada una, y permitir abrir cada subtarea desde ahí.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-30
- **Verificación:** Demostración — abrir el detalle de un padre y navegar a una subtarea.

### RF-ARB-07 · Bloqueo de cierre con subtareas pendientes
El sistema debe rechazar mover a *Hecho* una tarjeta que tenga al menos una subtarea directa fuera de *Hecho*, devolviendo la tarjeta a su columna e informando cuántas subtareas están pendientes.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-31
- **Justificación:** el tablero no debe poder decir "terminado" sobre algo que tiene partes sin terminar.
- **Verificación:** Prueba — padre con una subtarea en *En progreso*; arrastrar el padre a *Hecho*: vuelve y muestra "Tiene 1 subtarea pendiente". Terminar la subtarea y repetir: el padre se mueve.

### RF-ARB-08 · Sin movimiento automático del padre
El sistema no debe cambiar la columna de una tarjeta padre como consecuencia de cambios en sus subtareas; solo un miembro, de forma explícita, mueve el padre.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-31
- **Justificación:** una tarjeta que se mueve sola sorprende y oculta decisiones; el equipo prefirió cero comportamiento implícito.
- **Verificación:** Prueba — terminar la última subtarea de un padre; el padre permanece en su columna.

### RF-ARB-09 · Vista de esquema
El sistema debe ofrecer una vista de esquema del equipo que muestre todas las tareas raíz y, indentadas debajo de cada una, sus subtareas en todos los niveles, indicando para cada tarea su columna actual y responsable, y permitiendo abrir el detalle de cualquiera.

- **Prioridad:** Should · **Fuente:** equipo 2026-09-29 · **Historias:** HU-32
- **Verificación:** Demostración — árbol de tres niveles se ve completo e indentado; clic abre el detalle.

### RF-ARB-10 · Cambio de padre
El sistema debe permitir a un miembro cambiar la tarea padre de una tarjeta por otra tarjeta del mismo equipo, o quitarle el padre para convertirla en raíz; los indicadores de progreso de los padres afectados deben actualizarse.

- **Prioridad:** Should · **Fuente:** equipo 2026-09-29 · **Historias:** HU-33
- **Verificación:** Prueba — mover una subtarea de un padre a otro; ambos indicadores cambian; quitar el padre; la tarjeta aparece como raíz.

### RF-ARB-11 · Prevención de ciclos
El sistema debe rechazar cualquier cambio de padre que convierta a una tarjeta en descendiente de sí misma (asignar como padre a la propia tarjeta o a cualquiera de sus descendientes), informando el motivo.

- **Prioridad:** Should · **Fuente:** modelo de dominio (RN-11) · **Historias:** HU-33
- **Justificación:** un ciclo rompería el cálculo de progreso y de color, que recorren el árbol hacia arriba.
- **Verificación:** Prueba — A → B → C; intentar poner a C como padre de A (rechazo); intentar poner a A como padre de A (rechazo).

### RF-ARB-12 · Eliminación de tarea con subtareas
Al eliminar una tarjeta que tenga subtareas, el sistema debe conservar las subtareas y convertirlas en tareas raíz; no debe eliminarlas en cascada. La confirmación debe indicar cuántas subtareas quedarán como raíces.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-34
- **Justificación:** borrar trabajo ajeno por accidente es peor que dejar tarjetas sueltas.
- **Verificación:** Prueba — eliminar un padre con 3 subtareas; las 3 siguen en el tablero sin padre.

### RF-ARB-13 · Asignación de color
El sistema debe permitir a un miembro asignar a una tarjeta un color elegido de una paleta fija de 8 colores definida por la aplicación, cambiarlo o quitarlo.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-35
- **Justificación:** una paleta fija mantiene el tablero legible y garantiza que los colores se distingan entre sí (`RNF-USA-05`).
- **Verificación:** Prueba — asignar, cambiar y quitar el color; no debe existir forma de ingresar un color fuera de la paleta.

### RF-ARB-14 · Color efectivo de una tarjeta
El sistema debe mostrar cada tarjeta con su propio color si lo tiene; si no, con el color del ancestro más cercano que tenga uno; si ninguno lo tiene, en gris neutro. Al cambiar el color de una tarjeta, todas sus descendientes sin color propio deben reflejarlo de inmediato.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-35
- **Justificación:** el color identifica la rama; se define una vez y se ve en todas las tarjetas de la rama sin copiar datos.
- **Verificación:** Prueba — raíz verde con dos niveles debajo: todo verde; poner azul a una del segundo nivel: ella y sus hijas azules, el resto verde; quitar el azul: vuelven a verde.

### RF-ARB-15 · Color en la vista de esquema
La vista de esquema debe dibujar cada tarea con su color efectivo (`RF-ARB-14`), de modo que las ramas se distingan a simple vista.

- **Prioridad:** Should · **Fuente:** equipo 2026-09-29 · **Historias:** HU-32, HU-35
- **Verificación:** Demostración — esquema con dos ramas de colores distintos.
