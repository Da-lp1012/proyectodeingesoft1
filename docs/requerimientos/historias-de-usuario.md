# Historias de usuario — Slackless

Versión 0.2 · 2026-09-29 · Borrador para discusión con el equipo

> **Cambios en 0.2:** nueva épica E7 *Árbol de proyecto* (HU-29 a HU-33, y HU-35 color de rama) acordada por el equipo; HU-34 *editar y eliminar tarjeta*, que faltaba; los labels pasan a ser un vocabulario general del equipo con marca de habilidad (HU-16) y una tarjeta puede tener varios (HU-12). Los requerimientos no funcionales y la tabla RF salen de este archivo hacia la [especificación de requerimientos (SRS)](srs/README.md); cada historia indica ahora los requerimientos a los que responde.

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

**Historias y requerimientos son documentos distintos.** Los requerimientos son la especificación formal del sistema (qué debe hacer, verificable, estable) y viven en la [especificación de requerimientos (SRS)](srs/README.md). Las historias son la herramienta de planeación: cómo repartimos ese trabajo en sprints, desde la perspectiva de la persona. Cada historia indica los requerimientos a los que responde; la matriz completa está en el SRS.

**Los IDs son estables:** una historia nunca cambia de número aunque después se agreguen otras. Por eso pueden aparecer fuera de orden (HU-34 está en la épica 3 porque se agregó en la versión 0.2).

---

## E1 · Cuentas y equipos

### HU-01 (M) Registro
*Requerimientos: RF-CUE-01, RF-CUE-02*
Como visitante, quiero crear una cuenta con mi correo y una contraseña, para poder usar Slackless.

- Dado que ingreso un correo válido no registrado y una contraseña de al menos 8 caracteres, cuando envío el formulario, entonces se crea mi cuenta e inicio sesión automáticamente.
- Dado que el correo ya existe, cuando envío el formulario, entonces veo un mensaje de error y no se crea una cuenta duplicada.

### HU-02 (M) Iniciar y cerrar sesión
*Requerimientos: RF-CUE-03, RF-CUE-04, RF-CUE-05, RNF-SEG-04*
Como usuario, quiero iniciar y cerrar sesión, para que solo yo acceda a mis equipos.

- Dado que ingreso credenciales correctas, cuando inicio sesión, entonces veo la lista de mis equipos.
- Dado que ingreso una contraseña incorrecta, cuando inicio sesión, entonces veo un error genérico (sin revelar si el correo existe).
- Dado que tengo sesión, cuando cierro sesión, entonces no puedo ver ningún equipo sin volver a autenticarme.

### HU-03 (M) Crear equipo
*Requerimientos: RF-CUE-06, RF-CUE-07*
Como usuario, quiero crear un equipo con nombre, para organizar el trabajo con mis compañeros.

- Dado que ingreso un nombre, cuando creo el equipo, entonces quedo como su admin y se crea el canal `#general` y un tablero vacío.

### HU-04 (M) Unirse a un equipo
*Requerimientos: RF-CUE-08, RF-CUE-09*
Como usuario, quiero unirme a un equipo con un código de invitación, para trabajar con un grupo que ya existe.

- Dado que un admin generó un código, cuando lo ingreso, entonces quedo como miembro del equipo y veo sus canales y tablero.
- Dado que el código no existe o fue revocado, cuando lo ingreso, entonces veo un error y no me uno.

### HU-05 (M) Varios equipos
*Requerimientos: RF-CUE-10, RF-CUE-11*
Como usuario, quiero pertenecer a varios equipos y cambiar entre ellos, porque participo en más de un proyecto.

- Dado que pertenezco a dos equipos, cuando cambio de uno a otro, entonces los canales, el tablero y las notificaciones que veo son solo del equipo seleccionado.

---

## E2 · Chat

### HU-06 (M) Canales
*Requerimientos: RF-CHA-01, RF-CHA-02*
Como miembro, quiero crear y ver canales del equipo, para separar conversaciones por tema.

- Dado que soy miembro, cuando creo un canal con nombre, entonces aparece en la lista para todos los miembros del equipo.
- Dado que no soy miembro del equipo, cuando intento acceder a un canal por su URL, entonces recibo acceso denegado.

### HU-07 (M) Mensajes en tiempo real
*Requerimientos: RF-CHA-03, RF-CHA-04, RF-CHA-05, RNF-REN-01*
Como miembro, quiero enviar mensajes en un canal y ver los de los demás sin recargar la página, para conversar con fluidez.

- Dado que dos miembros tienen el mismo canal abierto, cuando uno envía un mensaje, entonces el otro lo ve en menos de 1 segundo (red local).
- Dado que entro a un canal, cuando se carga, entonces veo los últimos 50 mensajes con autor y hora.

### HU-08 (S) Mensajes directos
*Requerimientos: RF-CHA-07*
Como miembro, quiero conversar en privado con otro miembro del equipo, para tratar temas que no le interesan a todos.

- Dado que abro una conversación directa con Ana, cuando envío un mensaje, entonces solo Ana y yo podemos verlo.

### HU-09 (S) Menciones
*Requerimientos: RF-CHA-08*
Como miembro, quiero mencionar a alguien con `@nombre`, para llamar su atención sobre un mensaje.

- Dado que escribo `@ana`, cuando envío el mensaje, entonces el nombre aparece resaltado y Ana recibe una notificación de mención (si la tiene activada, ver HU-21).

### HU-10 (S) Crear tarea desde el chat
*Requerimientos: RF-CHA-09*
Como miembro, quiero convertir un mensaje en una tarea del tablero, para que lo que se acuerda en la conversación no se pierda.

- Dado que un mensaje dice "hay que arreglar el login", cuando elijo "Crear tarea" sobre ese mensaje, entonces se crea una tarjeta en *Por hacer* con ese texto como título y un enlace al mensaje original.

---

## E3 · Tablero kanban

### HU-11 (M) Tablero por equipo
*Requerimientos: RF-KAN-01, RF-CUE-07*
Como miembro, quiero ver el tablero del equipo con las columnas *Por hacer*, *En progreso* y *Hecho*, para saber en qué estado está cada cosa.

- Dado que entro al tablero, cuando se carga, entonces veo las tres columnas y las tarjetas de cada una.

### HU-12 (M) Crear tarjeta
*Requerimientos: RF-KAN-02, RF-KAN-03*
Como miembro, quiero crear una tarjeta con título, descripción, uno o más labels, responsable y fecha límite, para describir una tarea concreta.

- Dado que lleno al menos el título, cuando guardo, entonces la tarjeta aparece en *Por hacer*.
- Dado que elijo labels, cuando guardo, entonces cada uno es de los definidos por el admin del equipo (HU-16); por ejemplo *backend* + *importancia 5*.

### HU-13 (M) Mover tarjeta
*Requerimientos: RF-KAN-04, RF-KAN-05, RNF-REN-02*
Como miembro, quiero arrastrar una tarjeta entre columnas, para actualizar su estado sin formularios.

- Dado que arrastro una tarjeta de *Por hacer* a *En progreso*, cuando la suelto, entonces el cambio se guarda y los demás miembros lo ven sin recargar.

### HU-14 (C) Filtrar tarjetas
*Requerimientos: RF-KAN-08*
Como miembro, quiero filtrar el tablero por responsable o por label, para ver solo lo que me interesa.

- Dado que filtro por "Ana", cuando aplico el filtro, entonces solo veo tarjetas cuyo responsable es Ana.

### HU-34 (M) Editar y eliminar tarjeta
*Requerimientos: RF-KAN-06, RF-KAN-07, RF-ARB-12*
Como miembro, quiero editar los datos de una tarjeta y eliminarla, para corregir errores y limpiar el tablero.

- Dado que abro una tarjeta, cuando cambio su título, label, responsable o fecha y guardo, entonces los demás miembros ven el cambio sin recargar.
- Dado que elimino una tarjeta sin subtareas, cuando confirmo, entonces desaparece del tablero.
- Dado que elimino una tarjeta **con** subtareas, cuando confirmo, entonces las subtareas no se borran: quedan como tareas raíz (pierden el padre).

---

## E4 · Labels, roles y habilidades

### HU-15 (M) Roles del equipo
*Requerimientos: RF-LAB-04*
Como admin, quiero definir los roles del equipo (por ejemplo *backend*, *frontend*, *scrum master*) y asignarlos a miembros, para que quede claro quién hace qué.

- Dado que creo el rol "scrum master", cuando se lo asigno a Ana, entonces el rol aparece junto a su nombre en el equipo.
- Dado que no soy admin, cuando intento crear un rol, entonces recibo acceso denegado.

### HU-16 (M) Labels del equipo
*Requerimientos: RF-LAB-01, RF-LAB-02, RF-LAB-03*
Como admin, quiero crear los labels del equipo y marcar cuáles son habilidades, para clasificar tarjetas con nuestro propio vocabulario y usar ese mismo vocabulario en la encuesta de habilidades.

- Dado que creo el label "backend" marcado como habilidad, cuando guardo, entonces aparece disponible para las tarjetas **y** en la encuesta de habilidades.
- Dado que creo el label "importancia 5" sin marcarlo como habilidad, cuando guardo, entonces aparece disponible para las tarjetas pero **no** en la encuesta.
- Dado que no soy admin, cuando intento crear, editar o eliminar un label, entonces recibo acceso denegado.
- Dado que elimino un label que usan 7 tarjetas, cuando confirmo (el sistema me dice cuántas lo usan), entonces se quita de esas tarjetas y de las respuestas de la encuesta.
- Los labels **no tienen color**: el color de una tarjeta significa una sola cosa, su rama del árbol (HU-35).

### HU-17 (M) Encuesta de habilidades
*Requerimientos: RF-LAB-05, RF-LAB-06, RF-LAB-09*
Como miembro, quiero declarar, para cada label de habilidad del equipo, si soy *bueno*, *regular* o *malo*, para que no me asignen cosas que no sé hacer.

- Dado que el equipo tiene 4 labels de habilidad y otros 3 que no lo son, cuando abro mi encuesta, entonces veo solo los 4 de habilidad, con tres opciones cada uno, y puedo guardar respuestas parciales.
- Dado que el admin agrega un label de habilidad nuevo, cuando abro mi encuesta, entonces ese label aparece como "sin responder".

### HU-18 (M) Asignar con información
*Requerimientos: RF-LAB-07, RF-LAB-09*
Como admin, quiero ver el nivel de habilidad de cada miembro al asignar una tarea, para elegir con criterio.

- Dado que la tarea tiene el label de habilidad "backend", cuando abro el selector de responsable, entonces veo cada miembro con su nivel declarado en "backend" (*bueno / regular / malo / sin responder*).
- Dado que la tarea tiene dos labels de habilidad ("backend" y "diseño"), cuando abro el selector, entonces veo el nivel de cada miembro en ambos.
- Dado que la tarea solo tiene labels que no son de habilidad ("importancia 5") o no tiene ninguno, cuando abro el selector, entonces veo los miembros sin información de nivel.

### HU-19 (S) Advertencia, no bloqueo
*Requerimientos: RF-LAB-08*
Como admin, quiero recibir una advertencia si asigno una tarea a alguien que se declaró *malo* en ese label, para tomar la decisión conscientemente.

- Dado que Ana se declaró *mala* en "backend", cuando la asigno a una tarea con el label "backend", entonces veo una advertencia y puedo confirmar o cancelar.

---

## E5 · Notificaciones

### HU-20 (M) Campana de notificaciones
*Requerimientos: RF-NOT-01, RF-NOT-02*
Como miembro, quiero ver mis notificaciones en la app con un contador de no leídas, para enterarme de lo que me concierne.

- Dado que me asignan una tarea, cuando abro la campana, entonces veo la notificación con enlace a la tarjeta.
- Eventos que generan notificación: mención, tarea asignada, votación nueva en mis canales, mensaje nuevo en un canal.

### HU-21 (M) Preferencias por tipo de evento
*Requerimientos: RF-NOT-03, RF-NOT-04*
Como usuario, quiero activar o desactivar cada tipo de notificación, para recibir solo lo que necesito.

- Dado que desactivo "mensaje nuevo en canal", cuando alguien escribe en `#general`, entonces no recibo notificación, pero sí la recibo si me mencionan (si "mención" sigue activa).
- Las preferencias son por usuario y aplican a todos sus equipos.

### HU-22 (S) Silenciar canales
*Requerimientos: RF-NOT-05*
Como miembro, quiero silenciar un canal específico, porque hay canales que no me interesan aunque sí quiera notificaciones de otros.

- Dado que silencio `#memes`, cuando escriben ahí, entonces no recibo notificación, incluso si me mencionan.

### HU-23 (S) Notificación por correo
*Requerimientos: RF-NOT-06*
Como usuario, quiero recibir por correo los eventos que yo elija, para enterarme aunque no tenga la app abierta.

- Dado que activo correo para "tarea asignada", cuando me asignan una tarea, entonces recibo un correo con el título y un enlace, en menos de 5 minutos.

---

## E6 · Votaciones

### HU-24 (M) Encuesta en un canal
*Requerimientos: RF-VOT-01, RF-VOT-02, RF-VOT-03*
Como miembro, quiero publicar una encuesta con opciones en un canal, votar y ver el resultado, para tomar decisiones sin salir de la conversación.

- Dado que publico "¿Qué hacemos primero?" con 3 opciones, cuando los miembros votan, entonces todos ven el conteo por opción actualizado en tiempo real.
- Dado que ya voté, cuando intento votar de nuevo, entonces mi voto se cambia (no se suma).

### HU-25 (S) Encuesta anónima
*Requerimientos: RF-VOT-04*
Como creador de una encuesta, quiero marcarla como anónima, para que la gente vote sin presión.

- Dado que la encuesta es anónima, cuando alguien ve los resultados, entonces ve los conteos pero no quién votó qué.

### HU-26 (S) Cerrar votación
*Requerimientos: RF-VOT-05*
Como creador de una encuesta, quiero cerrarla, para fijar el resultado.

- Dado que cierro la encuesta, cuando alguien intenta votar, entonces no puede y ve el resultado final.

### HU-27 (C) Resultado crea tarea
*Requerimientos: RF-VOT-06*
Como miembro, quiero que la opción ganadora de una encuesta pueda convertirse en una tarea, para pasar de la decisión a la acción.

### HU-28 (C) Votar responsable
*Requerimientos: RF-VOT-07*
Como equipo, queremos votar quién toma una tarea, para repartir el trabajo de forma participativa.

---

## E7 · Árbol de proyecto

Una tarea grande o complicada se divide en subtareas. Cada subtarea es una tarjeta normal del kanban (con sus labels, responsable y columna) que además sabe cuál es su tarea padre. Una subtarea se puede volver a dividir: el árbol no tiene límite de profundidad. Cada rama puede tener un color, que se ve en todas sus tarjetas y en la vista de esquema. Es la versión viva de una *estructura de desglose del trabajo* (WBS), conectada al tablero en vez de vivir en un documento aparte.

### HU-29 (M) Dividir una tarea en subtareas
*Requerimientos: RF-ARB-01, RF-ARB-02, RF-ARB-03*
Como miembro, quiero dividir una tarea en subtareas, para convertir un trabajo grande o complicado en pasos concretos que se puedan repartir.

- Dado que abro la tarea "Implementar login", cuando creo la subtarea "Endpoint de autenticación", entonces la subtarea aparece como tarjeta propia en *Por hacer* y queda vinculada a "Implementar login" como su tarea padre.
- Dado que creo una subtarea, cuando se abre el formulario, entonces labels, responsable y fecha empiezan vacíos (no se heredan del padre). El color tampoco se copia: la subtarea simplemente se muestra con el color de su rama (HU-35).
- Dado que abro una subtarea, cuando la divido a su vez, entonces se crea un tercer nivel sin restricción.

### HU-30 (M) Ver la conexión en el kanban
*Requerimientos: RF-ARB-04, RF-ARB-05, RF-ARB-06*
Como miembro, quiero ver en cada tarjeta si es parte de otra tarea y cuánto avanzan sus subtareas, para entender el tablero sin abrir cada tarjeta.

- Dado que una tarjeta es subtarea, cuando la veo en el tablero, entonces muestra "↳ parte de: Implementar login" con enlace a la tarea padre.
- Dado que una tarjeta tiene 5 subtareas y 3 están en *Hecho*, cuando la veo en el tablero, entonces muestra "3/5".
- Dado que abro una tarjeta, cuando veo su detalle, entonces veo la lista de sus subtareas con la columna actual de cada una.

### HU-31 (M) El padre no se cierra con hijas pendientes
*Requerimientos: RF-ARB-07, RF-ARB-08*
Como miembro, quiero que una tarea no pueda pasar a *Hecho* mientras tenga subtareas sin terminar, para que el tablero nunca mienta.

- Dado que la tarea padre tiene una subtarea en *En progreso*, cuando intento arrastrarla a *Hecho*, entonces la tarjeta vuelve a su columna y veo "Tiene 1 subtarea pendiente".
- Dado que todas las subtareas están en *Hecho*, cuando arrastro el padre a *Hecho*, entonces se mueve normalmente. **Nada se mueve solo:** el padre nunca cambia de columna automáticamente.

### HU-32 (S) Vista de esquema del proyecto
*Requerimientos: RF-ARB-09, RF-ARB-15*
Como miembro, quiero ver todas las tareas del equipo como un árbol indentado, para entender el plan completo y no solo tres columnas.

- Dado que entro a "Esquema", cuando se carga, entonces veo las tareas raíz y, debajo e indentadas, sus subtareas, cada una con su columna actual y responsable.
- Dado que hago clic en una tarea del esquema, entonces se abre su detalle.
- Dado que una rama tiene color, cuando veo el esquema, entonces las líneas y tarjetas de esa rama se dibujan con ese color.

### HU-33 (S) Reorganizar el árbol
*Requerimientos: RF-ARB-10, RF-ARB-11*
Como miembro, quiero cambiar la tarea padre de una tarea (o quitárselo), para reorganizar el plan cuando aprendemos algo nuevo.

- Dado que cambio el padre de "Endpoint de autenticación" a "Implementar registro", cuando guardo, entonces la tarjeta muestra el nuevo padre y los contadores de ambos padres se actualizan.
- Dado que intento poner como padre a una de sus propias subtareas (o nietas), cuando guardo, entonces el sistema lo rechaza: no se permiten ciclos.

### HU-35 (M) Color de rama
*Requerimientos: RF-ARB-13, RF-ARB-14, RF-ARB-15, RNF-USA-05*
Como miembro, quiero asignarle un color a una tarea, para que ella y todas sus subtareas se distingan en el kanban de un vistazo.

- Dado que le asigno verde a "Implementar login", cuando veo el tablero, entonces "Implementar login" y todas sus subtareas, en cualquier nivel, muestran una franja verde.
- Dado que una subtarea tiene su propio color, cuando veo el tablero, entonces ella y sus descendientes usan ese color: **gana el color más cercano hacia arriba**.
- Dado que una tarea raíz no tiene color, cuando veo el tablero, entonces su rama se muestra en gris neutro.
- Dado que le quito el color a una tarea, cuando guardo, entonces vuelve a mostrar el de su ancestro más cercano (o gris si no hay).
- El color se elige de una paleta fija de 8 colores de la aplicación (no un selector libre), para que el tablero se mantenga legible y los colores se distingan entre sí.

---

## Trazabilidad

Los requerimientos no funcionales, las reglas de negocio y la matriz completa historia → requerimiento están en la [especificación de requerimientos](srs/README.md). Tres requerimientos funcionales todavía no tienen historia: RF-CUE-12 (transferir administración), RF-CUE-13 (salir de un equipo) y RF-CHA-06 (cargar mensajes anteriores). Se agregarán como HU-36 a HU-38 en la versión 0.3.

**Conteo:** 21 Must · 11 Should · 3 Could (35 historias).

---

## Preguntas abiertas

- El profesor distingue requerimientos de historias de usuario: la especificación formal está ahora en `srs/`. Falta confirmar si además pide casos de uso UML.
- ¿Los roles del equipo (HU-15) deben tener permisos distintos, o son solo etiquetas informativas? Propuesta inicial: solo informativas; el único rol con permisos es *admin*.
- ¿Qué pasa con el admin si sale del equipo? Propuesta: debe transferir el rol antes de salir.
- ¿Conviene limitar la profundidad del árbol (por ejemplo a 4 niveles) para que la interfaz no se vuelva ilegible? El modelo no lo necesita; sería solo una regla de la interfaz.
- "Importancia" como label (*importancia 1* … *importancia 5*) funciona, pero si el equipo la usa siempre, un campo numérico de prioridad en la tarjeta sería más cómodo para filtrar y ordenar. Decidir después del primer sprint de uso real.
- ¿Los labels deberían tener color propio? Por ahora no, para que el color de la tarjeta signifique una sola cosa (la rama).
