# RF-CHA · Chat

Módulo: canales, mensajes en tiempo real, conversaciones directas, menciones y creación de tareas desde el chat. Convenciones en el [índice](README.md#15-convenciones).

---

### RF-CHA-01 · Creación de canal
El sistema debe permitir a un miembro crear un canal en su equipo con un nombre único dentro de ese equipo.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-06
- **Verificación:** Prueba — crear `#backend`; intentar crear otro `#backend` en el mismo equipo (rechazo); crear `#backend` en otro equipo (éxito).

### RF-CHA-02 · Lista de canales
El sistema debe mostrar a cada miembro la lista de canales de su equipo activo y permitirle entrar a cualquiera de ellos.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-06
- **Verificación:** Demostración — un canal creado por un miembro aparece en la lista de otro miembro del mismo equipo.

### RF-CHA-03 · Envío de mensajes
El sistema debe permitir a un miembro enviar mensajes de texto en un canal de su equipo, registrando autor y fecha y hora de envío.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-07
- **Verificación:** Prueba — enviar un mensaje y comprobar que se almacena con autor y marca de tiempo.

### RF-CHA-04 · Entrega en tiempo real
El sistema debe entregar cada mensaje nuevo a todos los miembros que tengan ese canal abierto, sin que recarguen la página. El tiempo máximo de entrega lo fija `RNF-REN-01`.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-07
- **Verificación:** Demostración — dos navegadores en el mismo canal; el mensaje enviado en uno aparece en el otro sin acción del usuario.

### RF-CHA-05 · Historial reciente
Al abrir un canal, el sistema debe mostrar los últimos 50 mensajes en orden cronológico, con autor y hora.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-07
- **Verificación:** Prueba — canal con 60 mensajes; al abrirlo se ven exactamente los 50 más recientes.

### RF-CHA-06 · Carga de mensajes anteriores
El sistema debe permitir al miembro cargar mensajes anteriores a los mostrados, en bloques de 50, hasta llegar al primero del canal.

- **Prioridad:** Should · **Fuente:** derivado de RF-CHA-05 · **Historias:** sin historia (propuesta HU-38)
- **Justificación:** sin esto, los mensajes anteriores a los 50 más recientes serían inaccesibles.
- **Verificación:** Prueba — canal con 120 mensajes; cargar anteriores dos veces y comprobar que se llega al primero.

### RF-CHA-07 · Conversaciones directas
El sistema debe permitir a un miembro iniciar una conversación privada con otro miembro del mismo equipo, cuyos mensajes solo pueden leer esas dos personas.

- **Prioridad:** Should · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-08
- **Verificación:** Prueba — tres miembros A, B, C; A escribe a B; C intenta acceder a la conversación por su URL (rechazo).

### RF-CHA-08 · Menciones
El sistema debe reconocer en un mensaje la forma `@nombre` de un miembro del equipo, resaltarla visualmente y generar para ese miembro el evento *mención* (ver `RF-NOT-01`).

- **Prioridad:** Should · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-09
- **Verificación:** Prueba — enviar `@ana hola`; el texto se resalta y Ana recibe notificación si la tiene activa.

### RF-CHA-09 · Tarea desde un mensaje
El sistema debe permitir a un miembro crear una tarjeta del tablero a partir de un mensaje de canal, usando el texto del mensaje como título inicial y conservando en la tarjeta un enlace al mensaje de origen.

- **Prioridad:** Should · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-10
- **Justificación:** lo acordado en la conversación no debe perderse; es el puente entre el chat y el tablero.
- **Verificación:** Prueba — crear tarea desde un mensaje; la tarjeta aparece en *Por hacer* con ese título y el enlace lleva al mensaje.
