# RF-LAB · Labels, roles y habilidades

Módulo: vocabulario de labels del equipo, roles informativos, encuesta de habilidades y asignación informada de tareas. Convenciones en el [índice](README.md#15-convenciones).

---

### RF-LAB-01 · Creación de labels
El sistema debe permitir al administrador crear labels en su equipo, cada uno con un nombre único dentro del equipo y una marca que indique si es un label de habilidad.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-16
- **Justificación:** un mismo vocabulario sirve para clasificar tarjetas (*importancia 5*, *backend*) y, cuando lleva la marca, para la encuesta de habilidades (*backend*).
- **Verificación:** Prueba — crear "backend" con marca y "importancia 5" sin marca; intentar crear otro "backend" (rechazo).

### RF-LAB-02 · Edición y eliminación de labels
El sistema debe permitir al administrador renombrar un label, cambiar su marca de habilidad y eliminarlo. Antes de eliminar, debe informar cuántas tarjetas lo usan; al confirmar, debe quitarlo de esas tarjetas y eliminar las respuestas de encuesta asociadas.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-16
- **Verificación:** Prueba — label usado por 3 tarjetas; eliminar: el aviso dice 3; tras confirmar, las tarjetas ya no lo tienen.

### RF-LAB-03 · Gestión de labels restringida al administrador
El sistema debe denegar a cualquier miembro que no sea administrador la creación, edición o eliminación de labels, verificándolo en el servidor.

- **Prioridad:** Must · **Fuente:** equipo 2026-09-29 · **Historias:** HU-16
- **Verificación:** Prueba — enviar la petición de crear label con la sesión de un miembro común directamente al servidor (sin pasar por la interfaz): debe rechazarse.

### RF-LAB-04 · Roles del equipo
El sistema debe permitir al administrador crear roles con nombre en su equipo (por ejemplo *backend*, *frontend*, *scrum master*), asignar uno o varios roles a cada miembro y quitarlos; los roles deben mostrarse junto al nombre del miembro y no deben otorgar permisos.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-15
- **Verificación:** Prueba — crear rol, asignarlo, verlo junto al nombre; comprobar que un miembro con rol "scrum master" sigue sin poder crear labels.

### RF-LAB-05 · Encuesta de habilidades
El sistema debe presentar a cada miembro los labels de habilidad de su equipo y permitirle declarar, para cada uno, un nivel *bueno*, *regular* o *malo*, guardando respuestas parciales y permitiendo cambiarlas después.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-17
- **Verificación:** Prueba — equipo con 4 labels de habilidad y 3 sin marca; la encuesta muestra solo los 4; responder 2, salir, volver: las 2 respuestas persisten.

### RF-LAB-06 · Labels de habilidad nuevos en la encuesta
Cuando el administrador cree un label de habilidad o marque como habilidad uno existente, el sistema debe incluirlo en la encuesta de todos los miembros con estado *sin responder*.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-17
- **Verificación:** Prueba — crear label de habilidad; abrir la encuesta de otro miembro: aparece sin responder.

### RF-LAB-07 · Niveles visibles al asignar
Al elegir el responsable de una tarjeta, el sistema debe mostrar al administrador, para cada miembro, el nivel declarado en cada uno de los labels de habilidad de esa tarjeta (*bueno*, *regular*, *malo* o *sin responder*). Si la tarjeta no tiene labels de habilidad, no debe mostrar niveles.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-18
- **Justificación:** es el corazón del diferenciador: el sistema informa, la persona decide.
- **Verificación:** Prueba — tarjeta con "backend" y "diseño": el selector muestra dos niveles por miembro; tarjeta solo con "importancia 5": ninguno.

### RF-LAB-08 · Advertencia por nivel bajo
Si el responsable elegido declaró *malo* en alguno de los labels de habilidad de la tarjeta, el sistema debe mostrar una advertencia y permitir confirmar o cancelar la asignación; no debe impedirla.

- **Prioridad:** Should · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-19
- **Justificación:** el equipo decidió que el sistema informa y advierte, pero nunca restringe.
- **Verificación:** Prueba — asignar a alguien "malo" en backend: aparece advertencia; confirmar: la asignación se guarda.

### RF-LAB-09 · Confidencialidad de los niveles
El sistema debe mostrar los niveles de habilidad de un miembro únicamente a ese miembro y al administrador en el contexto de asignar una tarjeta; ningún otro miembro debe poder consultarlos.

- **Prioridad:** Must · **Fuente:** RFC 0001 §5 (riesgo de incomodidad) · **Historias:** HU-17, HU-18
- **Verificación:** Prueba — con la sesión de un miembro común, solicitar al servidor los niveles de otro miembro: debe rechazarse.
