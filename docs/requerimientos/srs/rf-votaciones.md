# RF-VOT · Votaciones

Módulo: encuestas publicadas en canales, votos, anonimato, cierre y conexión con el tablero. Convenciones en el [índice](README.md#15-convenciones).

---

### RF-VOT-01 · Creación de encuesta
El sistema debe permitir a un miembro publicar en un canal de su equipo una encuesta con una pregunta y dos o más opciones de respuesta; la encuesta debe aparecer en el canal como un mensaje especial visible para todos sus miembros.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-24
- **Verificación:** Prueba — crear con 3 opciones (éxito); intentar con 1 opción (rechazo).

### RF-VOT-02 · Emisión y cambio de voto
El sistema debe permitir a cada miembro del equipo votar por exactamente una opción de una encuesta abierta; si vuelve a votar, el nuevo voto debe reemplazar al anterior, nunca sumarse.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-24
- **Verificación:** Prueba — votar A, luego B: el conteo de A baja en 1 y el de B sube en 1; el total no cambia.

### RF-VOT-03 · Resultados en tiempo real
El sistema debe mostrar, junto a la encuesta, el número de votos de cada opción y el total, actualizándolos para todos los miembros que tengan el canal abierto sin que recarguen.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-24
- **Verificación:** Demostración — dos navegadores; un voto en uno actualiza los conteos en el otro.

### RF-VOT-04 · Encuesta anónima
El sistema debe permitir al creador marcar la encuesta como anónima al crearla; en una encuesta anónima, el sistema debe mostrar los conteos pero no debe exponer a ningún usuario, incluido el creador y el administrador, qué opción eligió cada miembro, manteniendo igualmente la regla de un voto por miembro.

- **Prioridad:** Should · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-25
- **Justificación:** decisiones incómodas y retrospectivas necesitan que la gente vote sin presión.
- **Verificación:** Prueba — encuesta anónima con 3 votos; ninguna vista ni respuesta del servidor asocia miembro con opción; el mismo miembro no puede sumar dos votos.

### RF-VOT-05 · Cierre de encuesta
El sistema debe permitir al creador cerrar una encuesta; una vez cerrada, el sistema debe rechazar nuevos votos y mostrar el resultado final marcado como cerrado.

- **Prioridad:** Should · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-26
- **Verificación:** Prueba — cerrar; intentar votar (rechazo); el resultado sigue visible.

### RF-VOT-06 · Tarea desde el resultado
El sistema debe permitir, sobre una encuesta cerrada, crear una tarjeta en el tablero a partir de la opción ganadora, usando su texto como título y enlazando la tarjeta con la encuesta.

- **Prioridad:** Could · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-27
- **Verificación:** Prueba — cerrar encuesta y crear tarea desde la ganadora: aparece en *Por hacer* con el enlace.

### RF-VOT-07 · Votación de responsable
El sistema debe permitir crear, desde una tarjeta, una encuesta cuyas opciones sean los miembros del equipo; al cerrarla, debe ofrecer asignar al miembro ganador como responsable de esa tarjeta, aplicando `RF-LAB-07` y `RF-LAB-08` en ese momento.

- **Prioridad:** Could · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-28
- **Verificación:** Prueba — crear votación de responsable, cerrar, aceptar la asignación: la tarjeta tiene ese responsable.
