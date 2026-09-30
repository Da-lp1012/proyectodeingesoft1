# RF-NOT · Notificaciones

Módulo: eventos que notifican, centro de notificaciones, preferencias por persona, silencio de canales y correo. Convenciones en el [índice](README.md#15-convenciones).

---

### RF-NOT-01 · Eventos que generan notificación
El sistema debe generar una notificación para un usuario ante cada uno de estos eventos en sus equipos: (a) es mencionado en un mensaje, (b) se le asigna una tarjeta, (c) se publica una encuesta en un canal de su equipo, (d) se envía un mensaje en un canal de su equipo. Cada notificación debe indicar el tipo, un texto corto y un enlace al recurso (mensaje, tarjeta o encuesta).

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-20
- **Verificación:** Prueba — provocar cada uno de los cuatro eventos y comprobar que se genera la notificación correspondiente con su enlace.

### RF-NOT-02 · Centro de notificaciones
El sistema debe mostrar un indicador permanente ("campana") con el número de notificaciones no leídas del usuario y, al abrirlo, la lista de notificaciones de la más reciente a la más antigua, permitiendo marcarlas como leídas individualmente o todas a la vez.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-20
- **Verificación:** Demostración — recibir dos notificaciones: el contador marca 2; abrir una: marca 1; "marcar todas": 0.

### RF-NOT-03 · Preferencias por tipo de evento
El sistema debe permitir a cada usuario activar o desactivar, de forma independiente, cada uno de los tipos de evento de `RF-NOT-01`. Las preferencias son del usuario y aplican a todos sus equipos.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-21
- **Justificación:** lo que para una persona es información necesaria, para otra es ruido; es el diferenciador 1 del RFC.
- **Verificación:** Prueba — desactivar "mensaje en canal", cambiar de equipo: sigue desactivado.

### RF-NOT-04 · Aplicación de preferencias
El sistema no debe generar notificaciones de un tipo que el usuario tenga desactivado, mientras sigue generando las de los tipos activos. En particular, con "mensaje en canal" desactivado y "mención" activa, un mensaje que lo mencione sí debe notificarse.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-21
- **Verificación:** Prueba — el caso descrito: mensaje sin mención (no notifica), mensaje con mención (notifica).

### RF-NOT-05 · Silenciar un canal
El sistema debe permitir a un miembro silenciar un canal concreto de su equipo; mientras esté silenciado, el sistema no debe generar para ese miembro ninguna notificación originada en ese canal, incluidas las menciones. El silencio debe poder revertirse.

- **Prioridad:** Should · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-22
- **Verificación:** Prueba — silenciar `#memes`; recibir mención ahí: sin notificación; quitar el silencio; nueva mención: notifica.

### RF-NOT-06 · Notificación por correo
El sistema debe permitir al usuario activar, por tipo de evento y de forma independiente de las preferencias en la aplicación, el envío por correo electrónico; para los tipos activados, debe enviar un correo con el texto de la notificación y el enlace al recurso en un plazo máximo de 5 minutos desde el evento.

- **Prioridad:** Should · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-23
- **Justificación:** enterarse aunque la aplicación esté cerrada; se deja como *Should* porque introduce una dependencia externa (`RES-05`).
- **Verificación:** Prueba — activar correo para "tarea asignada"; asignar una tarjeta; el correo llega en menos de 5 minutos con el enlace correcto.
