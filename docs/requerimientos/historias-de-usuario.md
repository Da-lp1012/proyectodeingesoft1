# Historias de usuario — Slackless

Versión 0.1 · 2026-09-25 · Borrador para discusión con el equipo

## Cómo leer este documento

Cada requerimiento funcional se escribe como **historia de usuario**:

> Como *rol*, quiero *acción*, para *beneficio*.

y lleva **criterios de aceptación** en formato *Dado / Cuando / Entonces*: son la prueba concreta de que la historia está terminada. Si no se puede escribir el criterio, la historia no está clara.

**Prioridad (MoSCoW):**

| Sigla | Significado | Compromiso |
|---|---|---|
| **M** | *Must* — imprescindible | Se entrega este semestre sí o sí |
| **S** | *Should* — importante | Se entrega si el ritmo lo permite |
| **C** | *Could* — deseable | Solo si sobra tiempo; se recorta sin culpa |

**Roles del sistema:**

- **Visitante:** persona sin sesión iniciada.
- **Usuario:** persona con cuenta.
- **Miembro:** usuario que pertenece a un equipo.
- **Admin:** miembro con permisos de administración de un equipo (quien lo creó, o a quien se le transfirió).

Al final hay una **tabla RF/RNF** numerada que resume todo, por si el formato requerido es el de un documento de especificación clásico.

---

## E1 · Cuentas y equipos

### HU-01 (M) Registro
Como visitante, quiero crear una cuenta con mi correo y una contraseña, para poder usar Slackless.

- Dado que ingreso un correo válido no registrado y una contraseña de al menos 8 caracteres, cuando envío el formulario, entonces se crea mi cuenta e inicio sesión automáticamente.
- Dado que el correo ya existe, cuando envío el formulario, entonces veo un mensaje de error y no se crea una cuenta duplicada.

### HU-02 (M) Iniciar y cerrar sesión
Como usuario, quiero iniciar y cerrar sesión, para que solo yo acceda a mis equipos.

- Dado que ingreso credenciales correctas, cuando inicio sesión, entonces veo la lista de mis equipos.
- Dado que ingreso una contraseña incorrecta, cuando inicio sesión, entonces veo un error genérico (sin revelar si el correo existe).
- Dado que tengo sesión, cuando cierro sesión, entonces no puedo ver ningún equipo sin volver a autenticarme.

### HU-03 (M) Crear equipo
Como usuario, quiero crear un equipo con nombre, para organizar el trabajo con mis compañeros.

- Dado que ingreso un nombre, cuando creo el equipo, entonces quedo como su admin y se crea el canal `#general` y un tablero vacío.

### HU-04 (M) Unirse a un equipo
Como usuario, quiero unirme a un equipo con un código de invitación, para trabajar con un grupo que ya existe.

- Dado que un admin generó un código, cuando lo ingreso, entonces quedo como miembro del equipo y veo sus canales y tablero.
- Dado que el código no existe o fue revocado, cuando lo ingreso, entonces veo un error y no me uno.

### HU-05 (M) Varios equipos
Como usuario, quiero pertenecer a varios equipos y cambiar entre ellos, porque participo en más de un proyecto.

- Dado que pertenezco a dos equipos, cuando cambio de uno a otro, entonces los canales, el tablero y las notificaciones que veo son solo del equipo seleccionado.

---

## E2 · Chat

### HU-06 (M) Canales
Como miembro, quiero crear y ver canales del equipo, para separar conversaciones por tema.

- Dado que soy miembro, cuando creo un canal con nombre, entonces aparece en la lista para todos los miembros del equipo.
- Dado que no soy miembro del equipo, cuando intento acceder a un canal por su URL, entonces recibo acceso denegado.

### HU-07 (M) Mensajes en tiempo real
Como miembro, quiero enviar mensajes en un canal y ver los de los demás sin recargar la página, para conversar con fluidez.

- Dado que dos miembros tienen el mismo canal abierto, cuando uno envía un mensaje, entonces el otro lo ve en menos de 1 segundo (red local).
- Dado que entro a un canal, cuando se carga, entonces veo los últimos 50 mensajes con autor y hora.

### HU-08 (S) Mensajes directos
Como miembro, quiero conversar en privado con otro miembro del equipo, para tratar temas que no le interesan a todos.

- Dado que abro una conversación directa con Ana, cuando envío un mensaje, entonces solo Ana y yo podemos verlo.

### HU-09 (S) Menciones
Como miembro, quiero mencionar a alguien con `@nombre`, para llamar su atención sobre un mensaje.

- Dado que escribo `@ana`, cuando envío el mensaje, entonces el nombre aparece resaltado y Ana recibe una notificación de mención (si la tiene activada, ver HU-21).

### HU-10 (S) Crear tarea desde el chat
Como miembro, quiero convertir un mensaje en una tarea del tablero, para que lo que se acuerda en la conversación no se pierda.

- Dado que un mensaje dice "hay que arreglar el login", cuando elijo "Crear tarea" sobre ese mensaje, entonces se crea una tarjeta en *Por hacer* con ese texto como título y un enlace al mensaje original.

---

## E3 · Tablero kanban

### HU-11 (M) Tablero por equipo
Como miembro, quiero ver el tablero del equipo con las columnas *Por hacer*, *En progreso* y *Hecho*, para saber en qué estado está cada cosa.

- Dado que entro al tablero, cuando se carga, entonces veo las tres columnas y las tarjetas de cada una.

### HU-12 (M) Crear tarjeta
Como miembro, quiero crear una tarjeta con título, descripción, label, responsable y fecha límite, para describir una tarea concreta.

- Dado que lleno al menos el título, cuando guardo, entonces la tarjeta aparece en *Por hacer*.
- Dado que elijo un label, cuando guardo, entonces el label es uno de los definidos por el admin del equipo (HU-16).

### HU-13 (M) Mover tarjeta
Como miembro, quiero arrastrar una tarjeta entre columnas, para actualizar su estado sin formularios.

- Dado que arrastro una tarjeta de *Por hacer* a *En progreso*, cuando la suelto, entonces el cambio se guarda y los demás miembros lo ven sin recargar.

### HU-14 (C) Filtrar tarjetas
Como miembro, quiero filtrar el tablero por responsable o por label, para ver solo lo que me interesa.

- Dado que filtro por "Ana", cuando aplico el filtro, entonces solo veo tarjetas cuyo responsable es Ana.

---

## E4 · Roles y habilidades

### HU-15 (M) Roles del equipo
Como admin, quiero definir los roles del equipo (por ejemplo *backend*, *frontend*, *scrum master*) y asignarlos a miembros, para que quede claro quién hace qué.

- Dado que creo el rol "scrum master", cuando se lo asigno a Ana, entonces el rol aparece junto a su nombre en el equipo.
- Dado que no soy admin, cuando intento crear un rol, entonces recibo acceso denegado.

### HU-16 (M) Labels de habilidad
Como admin, quiero definir los labels de habilidad del equipo (por ejemplo *backend*, *frontend*, *diseño*, *documentación*), para clasificar tareas y habilidades con el mismo vocabulario.

- Dado que creo el label "diseño", cuando guardo, entonces aparece disponible tanto para tarjetas como para la encuesta de habilidades.

### HU-17 (M) Encuesta de habilidades
Como miembro, quiero declarar, para cada label del equipo, si soy *bueno*, *regular* o *malo*, para que no me asignen cosas que no sé hacer.

- Dado que el equipo tiene 4 labels, cuando abro mi encuesta, entonces veo los 4 con tres opciones cada uno y puedo guardar respuestas parciales.
- Dado que el admin agrega un label nuevo, cuando abro mi encuesta, entonces ese label aparece como "sin responder".

### HU-18 (M) Asignar con información
Como admin, quiero ver el nivel de habilidad de cada miembro al asignar una tarea, para elegir con criterio.

- Dado que la tarea tiene label "backend", cuando abro el selector de responsable, entonces veo cada miembro con su nivel declarado en "backend" (*bueno / regular / malo / sin responder*).
- Dado que la tarea no tiene label, cuando abro el selector, entonces veo los miembros sin información de nivel.

### HU-19 (S) Advertencia, no bloqueo
Como admin, quiero recibir una advertencia si asigno una tarea a alguien que se declaró *malo* en ese label, para tomar la decisión conscientemente.

- Dado que Ana se declaró *mala* en "backend", cuando la asigno a una tarea "backend", entonces veo una advertencia y puedo confirmar o cancelar.

---

## E5 · Notificaciones

### HU-20 (M) Campana de notificaciones
Como miembro, quiero ver mis notificaciones en la app con un contador de no leídas, para enterarme de lo que me concierne.

- Dado que me asignan una tarea, cuando abro la campana, entonces veo la notificación con enlace a la tarjeta.
- Eventos que generan notificación: mención, tarea asignada, votación nueva en mis canales, mensaje nuevo en un canal.

### HU-21 (M) Preferencias por tipo de evento
Como usuario, quiero activar o desactivar cada tipo de notificación, para recibir solo lo que necesito.

- Dado que desactivo "mensaje nuevo en canal", cuando alguien escribe en `#general`, entonces no recibo notificación, pero sí la recibo si me mencionan (si "mención" sigue activa).
- Las preferencias son por usuario y aplican a todos sus equipos.

### HU-22 (S) Silenciar canales
Como miembro, quiero silenciar un canal específico, porque hay canales que no me interesan aunque sí quiera notificaciones de otros.

- Dado que silencio `#memes`, cuando escriben ahí, entonces no recibo notificación, incluso si me mencionan.

### HU-23 (S) Notificación por correo
Como usuario, quiero recibir por correo los eventos que yo elija, para enterarme aunque no tenga la app abierta.

- Dado que activo correo para "tarea asignada", cuando me asignan una tarea, entonces recibo un correo con el título y un enlace, en menos de 5 minutos.

---

## E6 · Votaciones

### HU-24 (M) Encuesta en un canal
Como miembro, quiero publicar una encuesta con opciones en un canal, votar y ver el resultado, para tomar decisiones sin salir de la conversación.

- Dado que publico "¿Qué hacemos primero?" con 3 opciones, cuando los miembros votan, entonces todos ven el conteo por opción actualizado en tiempo real.
- Dado que ya voté, cuando intento votar de nuevo, entonces mi voto se cambia (no se suma).

### HU-25 (S) Encuesta anónima
Como creador de una encuesta, quiero marcarla como anónima, para que la gente vote sin presión.

- Dado que la encuesta es anónima, cuando alguien ve los resultados, entonces ve los conteos pero no quién votó qué.

### HU-26 (S) Cerrar votación
Como creador de una encuesta, quiero cerrarla, para fijar el resultado.

- Dado que cierro la encuesta, cuando alguien intenta votar, entonces no puede y ve el resultado final.

### HU-27 (C) Resultado crea tarea
Como miembro, quiero que la opción ganadora de una encuesta pueda convertirse en una tarea, para pasar de la decisión a la acción.

### HU-28 (C) Votar responsable
Como equipo, queremos votar quién toma una tarea, para repartir el trabajo de forma participativa.

---

## Requerimientos no funcionales

| ID | Requerimiento | Cómo se verifica |
|---|---|---|
| RNF-01 | La interfaz funciona correctamente desde 360 px de ancho (celular) | Probar en navegador con emulación móvil |
| RNF-02 | Un mensaje enviado llega a los demás miembros conectados en menos de 1 s en red local | Medir con dos navegadores abiertos |
| RNF-03 | Las contraseñas se almacenan hasheadas (bcrypt); nunca en texto plano ni en logs | Inspeccionar la base de datos |
| RNF-04 | Solo los miembros de un equipo pueden ver sus canales, tablero, votaciones y habilidades; la verificación se hace en el backend | Intentar acceder por URL con otra cuenta |
| RNF-05 | Interfaz en español | Revisión visual |
| RNF-06 | Todo el sistema se levanta localmente con un solo comando (`docker compose up`) | Clonar en una máquina limpia y ejecutarlo |
| RNF-07 | Todo cambio entra a `main` por pull request con al menos una revisión | Configuración del repositorio |

---

## Tabla resumen RF / RNF

| ID | Historia | Prioridad | Épica |
|---|---|---|---|
| RF-01 | HU-01 Registro | M | Cuentas |
| RF-02 | HU-02 Iniciar/cerrar sesión | M | Cuentas |
| RF-03 | HU-03 Crear equipo | M | Equipos |
| RF-04 | HU-04 Unirse con código | M | Equipos |
| RF-05 | HU-05 Varios equipos | M | Equipos |
| RF-06 | HU-06 Canales | M | Chat |
| RF-07 | HU-07 Mensajes en tiempo real | M | Chat |
| RF-08 | HU-08 Mensajes directos | S | Chat |
| RF-09 | HU-09 Menciones | S | Chat |
| RF-10 | HU-10 Crear tarea desde chat | S | Chat |
| RF-11 | HU-11 Tablero | M | Kanban |
| RF-12 | HU-12 Crear tarjeta | M | Kanban |
| RF-13 | HU-13 Mover tarjeta | M | Kanban |
| RF-14 | HU-14 Filtrar | C | Kanban |
| RF-15 | HU-15 Roles del equipo | M | Habilidades |
| RF-16 | HU-16 Labels de habilidad | M | Habilidades |
| RF-17 | HU-17 Encuesta de habilidades | M | Habilidades |
| RF-18 | HU-18 Asignar con información | M | Habilidades |
| RF-19 | HU-19 Advertencia | S | Habilidades |
| RF-20 | HU-20 Campana | M | Notificaciones |
| RF-21 | HU-21 Preferencias por evento | M | Notificaciones |
| RF-22 | HU-22 Silenciar canal | S | Notificaciones |
| RF-23 | HU-23 Correo | S | Notificaciones |
| RF-24 | HU-24 Encuesta en canal | M | Votaciones |
| RF-25 | HU-25 Anónima | S | Votaciones |
| RF-26 | HU-26 Cerrar | S | Votaciones |
| RF-27 | HU-27 Resultado → tarea | C | Votaciones |
| RF-28 | HU-28 Votar responsable | C | Votaciones |

**Conteo:** 16 Must · 9 Should · 3 Could.

## Preguntas abiertas

- ¿El profesor exige un formato específico (casos de uso UML, SRS IEEE 830)? Este documento se adapta a ambos.
- ¿Los roles del equipo (HU-15) deben tener permisos distintos, o son solo etiquetas informativas? Propuesta inicial: solo informativas; el único rol con permisos es *admin*.
- ¿Qué pasa con el admin si sale del equipo? Propuesta: debe transferir el rol antes de salir.
