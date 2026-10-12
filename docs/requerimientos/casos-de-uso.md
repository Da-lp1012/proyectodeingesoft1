# Casos de uso — Slackless

Versión 0.1 · 2026-10-11 · Borrador para discusión con el equipo

> **Alcance de la 0.1:** Casos de uso de los módulos Cuentas y equipos (`RF-CUE`), Chat (`RF-CHA`), Árbol de proyecto (`RF-ARB`), Tablero Kanban (`RF-KAN`), Labels, roles y habilidades (`RF-LAB`), Notificaciones (`RF-NOT`) y Votaciones (`RF-VOT`). Los 67 requerimientos funcionales están cubiertos en 40 casos de uso. Los requerimientos no funcionales aplicables se indican en la sección *Requisitos no funcionales aplicables a todos los casos* y en el campo *Requisitos especiales* de cada caso cuando corresponda.

## Cómo leer este documento

Un **caso de uso** describe cómo un actor alcanza un objetivo completo con el sistema. Un caso puede cubrir varios requerimientos funcionales, y cada requerimiento aparece en al menos un caso. La trazabilidad completa está en la [especificación de requerimientos (SRS)](srs/README.md).

Cada caso sigue esta plantilla:

| Campo | Contenido |
|---|---|
| **Actor** | Quién inicia el caso |
| **Prioridad** | MoSCoW, heredada de los requerimientos que cubre |
| **Precondiciones** | Lo que debe ser cierto antes de empezar |
| **Flujo principal** | Camino normal, paso a paso |
| **Alternos** | Desvíos y errores, numerados según el paso donde ocurren (2a, 3b…) |
| **Postcondiciones** | Lo que queda garantizado al terminar |
| **Requisitos especiales** | Requerimientos no funcionales específicos del caso |
| **Trazabilidad** | RF, RN, RNF e historias de usuario relacionados |

**Prioridad (MoSCoW):** *Must* se entrega al finalizar el proyecto · *Should* se entrega si el ritmo lo permite · *Could* solo si sobra tiempo.

**Actores:**

- **Visitante:** persona sin sesión iniciada.
- **Usuario:** persona con cuenta y sesión activa; puede no pertenecer aún al equipo del que se habla.
- **Miembro:** usuario que pertenece a un equipo.
- **Administrador:** miembro con permisos de administración de un equipo (quien lo creó, o a quien se le transfirió). Es el único permiso especial (`RN-04`).
- **Sistema:** Slackless, como actor secundario cuando ejecuta reglas automáticas.

Documentos relacionados: [historias de usuario](historias-de-usuario.md) · [reglas de negocio](srs/reglas-negocio.md) · [requerimientos no funcionales](srs/rnf.md).

## Índice

| Módulo | Archivo de requerimientos | Casos de uso |
|---|---|---|
| [Cuentas y equipos](#cuentas-y-equipos) | [rf-cuentas-equipos.md](srs/rf-cuentas-equipos.md) | CU-01 a CU-09 |
| [Chat](#chat) | [rf-chat.md](srs/rf-chat.md) | CU-10 a CU-16 |
| [Árbol de proyecto](#árbol-de-proyecto) | [rf-arbol-proyecto.md](srs/rf-arbol-proyecto.md) | CU-17 a CU-24 |
| [Tablero kanban](#Tablero-Kanban) | [rf-kanban.md](srs/rf-kanban.md) | CU-25 a CU-29 |
| [Labels, roles y habilidades](#Labels-Habilidades) | [rf-labels-habilidades.md](srs/rf-labels-habilidades.md) | CU-30 a CU-33 |
| [Notificaciones](#Notificaciones) | [rf-notificaciones.md](srs/rf-notificaciones.md) | CU-34 a CU-36 |
| [Votaciones](#Votaciones) | [rf-votaciones.md](srs/rf-votaciones.md) | CU-37 a CU-40 |

## Requisitos no funcionales aplicables a todos los casos

| RNF | Qué impone |
|---|---|
| `RNF-SEG-02` | El servidor verifica membresía y permisos en cada operación sobre un recurso de equipo. Todo "acceso denegado" se aplica en el servidor, no solo en la interfaz. |
| `RNF-SEG-03` | El servidor valida toda entrada (tipos, longitudes, valores permitidos) y rechaza lo malformado sin ejecutar operaciones parciales. |
| `RNF-CON-02` | Toda operación confirmada al usuario persiste aunque el servidor se reinicie. |
| `RNF-USA-01` | La interfaz es utilizable desde 360 px hasta escritorio, sin desplazamiento horizontal. |
| `RNF-USA-02` | Interfaz, mensajes de error y correos en español. |
| `RNF-USA-04` | Todo mensaje de rechazo dice qué ocurrió y qué puede hacer el usuario, sin trazas ni códigos internos. |
| `RNF-REN-04` | Los tiempos se cumplen con 10 usuarios simultáneos por equipo y 5 equipos activos. |
| `RNF-POR-01` | Funciona en las dos últimas versiones de Chrome, Firefox y Edge (escritorio), Chrome Android y Safari iOS. |

---

## Cuentas y equipos

Registro, sesión, creación de equipos, invitaciones, membresías y administración. Requerimientos en [rf-cuentas-equipos.md](srs/rf-cuentas-equipos.md).

### CU-01 · Registrar cuenta

- **Actor:** Visitante · **Prioridad:** Must
- **Precondiciones:** no tiene sesión iniciada.
- **Flujo principal:**
  1. El visitante abre el formulario de registro.
  2. Ingresa correo, nombre y contraseña.
  3. El sistema valida el formato, que la contraseña tenga al menos 8 caracteres y que el correo no exista.
  4. El sistema crea la cuenta e inicia la sesión.
- **Alternos:**
  - 3a. Contraseña de menos de 8 caracteres: rechaza e indica el requisito.
  - 3b. Correo ya registrado: rechaza, informa el error y no crea otra cuenta.
- **Postcondiciones:** existe una única cuenta con ese correo y el usuario tiene sesión activa.
- **Requisitos especiales:** `RNF-SEG-01` (la contraseña se almacena solo como hash con bcrypt o equivalente, nunca en claro en base de datos, registros ni respuestas). `RNF-USA-03` (un usuario nuevo debe poder registrarse, crear un equipo, crear una tarjeta y enviar un mensaje en máximo 5 minutos, sin ayuda).
- **Trazabilidad:** `RF-CUE-01`, `RF-CUE-02` · HU-01

### CU-02 · Iniciar sesión

- **Actor:** Visitante · **Prioridad:** Must
- **Precondiciones:** tiene una cuenta.
- **Flujo principal:**
  1. Ingresa correo y contraseña.
  2. El sistema los verifica.
  3. Establece la sesión y muestra la lista de sus equipos.
- **Alternos:**
  - 2a. Credenciales inválidas: muestra un único mensaje genérico, sin revelar si falló el correo o la contraseña.
  - 3a. La sesión supera 7 días sin renovación: el sistema la expira y redirige al inicio de sesión.
- **Postcondiciones:** sesión activa con acceso a sus equipos.
- **Requisitos especiales:** `RNF-SEG-04` (expiración a los 7 días; el identificador de sesión no viaja en la URL).
- **Trazabilidad:** `RF-CUE-03`, `RF-CUE-04` · `RNF-SEG-04` · HU-02

### CU-03 · Cerrar sesión

- **Actor:** Usuario · **Prioridad:** Must
- **Precondiciones:** sesión activa.
- **Flujo principal:**
  1. Selecciona "Cerrar sesión".
  2. El sistema invalida la sesión y redirige al inicio de sesión.
- **Alternos:**
  - 2a. Si luego intenta abrir la URL de un recurso del equipo, el sistema lo redirige al inicio de sesión.
  - 2b. Si reutiliza el token de la sesión cerrada, el sistema lo rechaza.
- **Postcondiciones:** ningún recurso de equipo es accesible hasta autenticarse de nuevo.
- **Requisitos especiales:** `RNF-SEG-04`.
- **Trazabilidad:** `RF-CUE-05` · `RNF-SEG-04` · HU-02

### CU-04 · Crear equipo

- **Actor:** Usuario · **Prioridad:** Must
- **Precondiciones:** sesión activa.
- **Flujo principal:**
  1. Elige "Crear equipo" e ingresa el nombre.
  2. El sistema crea el equipo y asigna al creador como administrador.
  3. El sistema crea el canal `#general` y un tablero vacío con las columnas *Por hacer*, *En progreso* y *Hecho*.
  4. Muestra el equipo listo para usar.
- **Alternos:**
  - 1a. Nombre vacío: rechaza.
- **Postcondiciones:** el equipo tiene al menos un administrador (`RN-03`), el canal `#general` y el tablero creados.
- **Requisitos especiales:** `RNF-USA-03` (forma parte del recorrido de primer uso de 5 minutos).
- **Trazabilidad:** `RF-CUE-06`, `RF-CUE-07` · `RN-03` · HU-03, HU-11

### CU-05 · Gestionar código de invitación

- **Actor:** Administrador · **Prioridad:** Must
- **Precondiciones:** es administrador del equipo.
- **Flujo principal:**
  1. Elige "Generar código de invitación".
  2. El sistema genera un código único y lo muestra.
- **Alternos:**
  - 1a. Ya existe un código vigente y elige "Revocar": el sistema lo invalida.
  - 1b. Genera un código nuevo: el sistema invalida el anterior.
  - 1c. Un miembro sin rol de administrador no ve ni puede ejecutar esta opción.
- **Postcondiciones:** a lo sumo un código vigente; los revocados ya no sirven.
- **Requisitos especiales:** `RNF-SEG-02` (la restricción a administradores se verifica en el servidor).
- **Trazabilidad:** `RF-CUE-08` · HU-04

### CU-06 · Unirse a un equipo con código

- **Actor:** Usuario · **Prioridad:** Must
- **Precondiciones:** sesión activa; tiene un código de invitación.
- **Flujo principal:**
  1. Ingresa el código.
  2. El sistema verifica que exista y esté vigente.
  3. Crea la membresía sin permisos de administrador.
  4. El equipo aparece en su lista y el usuario ve sus canales y tablero.
- **Alternos:**
  - 2a. Código inexistente o revocado: rechaza e informa el error.
  - 2b. Ya es miembro del equipo: rechaza (`RN-02`).
- **Postcondiciones:** el usuario tiene exactamente una membresía en ese equipo.
- **Requisitos especiales:** ninguno específico.
- **Trazabilidad:** `RF-CUE-09` · `RN-02` · HU-04

### CU-07 · Cambiar de equipo activo

- **Actor:** Usuario · **Prioridad:** Must
- **Precondiciones:** pertenece a uno o más equipos.
- **Flujo principal:**
  1. Abre el selector de equipos.
  2. Elige uno.
  3. El sistema lo marca como activo.
  4. Muestra únicamente los canales, el tablero, las votaciones y las notificaciones de ese equipo.
- **Alternos:**
  - 2a. Elige un equipo del que no es miembro: el sistema lo rechaza (`RN-01`).
- **Postcondiciones:** el contexto es el equipo elegido, sin mezclar datos de otros equipos.
- **Requisitos especiales:** `RNF-SEG-02`.
- **Trazabilidad:** `RF-CUE-10`, `RF-CUE-11` · `RN-01` · HU-05

### CU-08 · Transferir la administración

- **Actor:** Administrador · **Prioridad:** Should
- **Precondiciones:** el equipo tiene al menos otro miembro.
- **Flujo principal:**
  1. Selecciona a otro miembro y elige "Hacer administrador".
  2. El sistema le otorga el rol.
  3. Opcionalmente, el administrador elige renunciar a su rol.
  4. El sistema verifica que quede al menos un administrador y aplica el cambio.
- **Alternos:**
  - 4a. El único administrador intenta renunciar sin haber designado a otro: el sistema rechaza (`RN-03`).
- **Postcondiciones:** el equipo conserva al menos un administrador.
- **Requisitos especiales:** `RNF-MAN-02` (`RN-03` debe tener prueba automatizada).
- **Trazabilidad:** `RF-CUE-12` · `RN-03` · HU-36 (propuesta)

### CU-09 · Salir de un equipo

- **Actor:** Miembro · **Prioridad:** Should
- **Precondiciones:** es miembro del equipo.
- **Flujo principal:**
  1. Elige "Salir del equipo" y confirma.
  2. El sistema elimina su membresía.
  3. Las tarjetas que tenía como responsable quedan sin responsable (`RN-07`).
- **Alternos:**
  - 2a. Es el único administrador: el sistema rechaza y exige transferir antes la administración (CU-08).
- **Postcondiciones:** el usuario ya no accede al equipo; el equipo conserva administrador.
- **Requisitos especiales:** `RNF-MAN-02` (`RN-03`).
- **Trazabilidad:** `RF-CUE-13` · `RN-03`, `RN-07` · HU-37 (propuesta)

---

## Chat

Canales, mensajes en tiempo real, conversaciones directas, menciones y creación de tareas desde el chat. Requerimientos en [rf-chat.md](srs/rf-chat.md).

### CU-10 · Crear canal

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** equipo activo.
- **Flujo principal:**
  1. Elige "Nuevo canal" e ingresa un nombre.
  2. El sistema verifica que sea único dentro del equipo.
  3. Crea el canal.
- **Alternos:**
  - 2a. Nombre repetido en el mismo equipo: rechaza. El mismo nombre en otro equipo es válido.
- **Postcondiciones:** el canal existe y pertenece al equipo.
- **Requisitos especiales:** `RNF-SEG-03` (límite de longitud del nombre validado en el servidor).
- **Trazabilidad:** `RF-CHA-01` · HU-06

### CU-11 · Consultar y entrar a canales

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** equipo activo.
- **Flujo principal:**
  1. El sistema muestra la lista de canales del equipo.
  2. El miembro elige uno y entra.
- **Alternos:**
  - 2a. Quien no es miembro del equipo intenta entrar a un canal por su URL: el sistema responde "acceso denegado" (`RN-01`).
- **Postcondiciones:** el miembro tiene el canal abierto.
- **Requisitos especiales:** `RNF-SEG-02`.
- **Trazabilidad:** `RF-CHA-02` · `RN-01` · HU-06

### CU-12 · Enviar mensaje en un canal

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** tiene un canal del equipo abierto.
- **Flujo principal:**
  1. Escribe el texto y lo envía.
  2. El sistema lo almacena con autor, fecha y hora de envío.
  3. Lo entrega a todos los miembros que tengan el canal abierto, sin recargar la página.
  4. Si el mensaje contiene menciones, el sistema las procesa (CU-15).
- **Alternos:**
  - 1a. Mensaje vacío: no se envía.
  - 3a. Un miembro que no tenía el canal abierto lo ve al abrirlo (CU-13).
  - 3b. Si un cliente pierde la conexión, se reconecta solo y muestra los mensajes enviados durante la desconexión.
- **Postcondiciones:** el mensaje pertenece a exactamente un canal (`RN-09`).
- **Requisitos especiales:** `RNF-REN-01` (entrega en máximo 1 s, en red local, en al menos el 95 % de los envíos). `RNF-CON-01` (reconexión automática). `RNF-USA-03` (parte del recorrido de primer uso). `RNF-SEG-03` (longitud máxima del mensaje validada).
- **Trazabilidad:** `RF-CHA-03`, `RF-CHA-04` · `RNF-REN-01` · `RN-09` · HU-07

### CU-13 · Consultar historial de mensajes

- **Actor:** Miembro · **Prioridad:** Must (`RF-CHA-05`), Should (`RF-CHA-06`)
- **Precondiciones:** canal abierto.
- **Flujo principal:**
  1. Al abrir el canal, el sistema muestra los 50 mensajes más recientes en orden cronológico, con autor y hora.
  2. El miembro elige "Cargar anteriores".
  3. El sistema agrega un bloque de 50 mensajes anteriores.
  4. Repite hasta llegar al primer mensaje del canal.
- **Alternos:**
  - 3a. Ya no hay mensajes anteriores: el sistema oculta la opción.
- **Postcondiciones:** ninguna (consulta).
- **Requisitos especiales:** ninguno específico.
- **Trazabilidad:** `RF-CHA-05`, `RF-CHA-06` · HU-07, HU-38 (propuesta)

### CU-14 · Conversar en privado (conversación directa)

- **Actor:** Miembro · **Prioridad:** Should
- **Precondiciones:** equipo activo; otro miembro del mismo equipo.
- **Flujo principal:**
  1. Elige a un compañero y "Mensaje directo".
  2. El sistema abre la conversación existente o crea una nueva.
  3. Se intercambian mensajes como en CU-12, visibles solo para esas dos personas.
- **Alternos:**
  - 2a. Ya existe una conversación entre ese par: el sistema reutiliza la existente (`RN-10`).
  - 3a. Un tercero intenta acceder por URL: el sistema rechaza.
- **Postcondiciones:** a lo sumo una conversación por par de miembros; sus mensajes pertenecen solo a ella (`RN-09`).
- **Requisitos especiales:** `RNF-SEG-02` (privacidad verificada en el servidor).
- **Trazabilidad:** `RF-CHA-07` · `RN-09`, `RN-10` · HU-08

### CU-15 · Mencionar a un miembro

- **Actor:** Miembro · **Prioridad:** Should
- **Precondiciones:** está escribiendo un mensaje (CU-12).
- **Flujo principal:**
  1. Incluye `@nombre` de un miembro del equipo.
  2. El sistema resalta la mención.
  3. Genera el evento *mención* para el mencionado.
  4. Si el mencionado tiene activo ese tipo de evento y no silenció el canal, recibe la notificación.
- **Alternos:**
  - 1a. El nombre no corresponde a un miembro del equipo: no se resalta ni se genera evento.
  - 4a. Evento desactivado o canal silenciado: no se notifica (`RN-19`; ver `RF-NOT-04` y `RF-NOT-05`). Silenciar el canal suprime también las menciones; desactivar solo "mensaje nuevo" no las suprime.
- **Postcondiciones:** mención registrada; notificación generada solo si aplica.
- **Requisitos especiales:** ninguno específico.
- **Trazabilidad:** `RF-CHA-08` · `RN-19` · HU-09

### CU-16 · Crear tarea desde un mensaje

- **Actor:** Miembro · **Prioridad:** Should
- **Precondiciones:** ve un mensaje de un canal de su equipo.
- **Flujo principal:**
  1. Elige "Crear tarea" sobre el mensaje.
  2. El sistema crea una tarjeta en *Por hacer* con el texto del mensaje como título.
  3. La tarjeta conserva un enlace al mensaje de origen.
- **Alternos:**
  - 2a. El texto excede el límite del título: el sistema lo recorta o pide editarlo.
- **Postcondiciones:** nueva tarjeta en el tablero del mismo equipo (`RN-06`), enlazada al mensaje.
- **Requisitos especiales:** `RNF-REN-02` (la tarjeta aparece en los demás clientes en máximo 1 s).
- **Trazabilidad:** `RF-CHA-09` · `RN-06` · HU-10

---

## Árbol de proyecto

Subtareas, progreso del padre, bloqueo de cierre, vista de esquema, reorganización y color por rama. Requerimientos en [rf-arbol-proyecto.md](srs/rf-arbol-proyecto.md).

### CU-17 · Crear subtarea

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** existe una tarjeta del equipo para usar como padre.
- **Flujo principal:**
  1. Desde la tarjeta padre elige "Agregar subtarea" e ingresa el título.
  2. El sistema crea una tarjeta completa en *Por hacer* y registra su padre.
  3. Deja vacíos labels, responsable, fecha límite y color, sin heredar valores del padre.
- **Alternos:**
  - 2a. La subtarea puede dividirse a su vez, sin límite de niveles: el caso se repite con ella como padre.
  - 2b. Se intenta usar como padre una tarjeta de otro equipo: rechaza (`RN-06`).
  - 2c. Título excesivamente largo: rechaza sin crear nada.
- **Postcondiciones:** subtarea del tablero vinculada a su padre.
- **Requisitos especiales:** `RNF-SEG-03` (validación del título). `RNF-REN-02` (cambio visible a los demás en máximo 1 s).
- **Trazabilidad:** `RF-ARB-01`, `RF-ARB-02`, `RF-ARB-03` · `RN-06` · HU-29

### CU-18 · Consultar subtareas y progreso

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** existen tarjetas con relación padre-hijo.
- **Flujo principal:**
  1. En el tablero, cada subtarea muestra "↳ parte de: < padre >" con enlace al detalle del padre.
  2. Cada padre muestra el progreso "hechas/total" de sus subtareas directas (por ejemplo "3/5").
  3. Al abrir el detalle de un padre, el miembro ve la lista de sus subtareas con la columna actual y el responsable de cada una.
  4. Abre una subtarea desde esa lista.
- **Alternos:**
  - 2a. Una tarjeta sin subtareas no muestra indicador.
  - 2b. Si una subtarea cambia de columna, el indicador refleja siempre el estado actual (se deriva, no se almacena).
- **Postcondiciones:** ninguna (consulta).
- **Requisitos especiales:** `RNF-REN-03` (un tablero de hasta 200 tarjetas, con árbol, se muestra completo en máximo 2 s).
- **Trazabilidad:** `RF-ARB-04`, `RF-ARB-05`, `RF-ARB-06` · HU-30

### CU-19 · Mover una tarjeta con subtareas a *Hecho*

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** la tarjeta está en otra columna (ver `RF-KAN-04`).
- **Flujo principal:**
  1. Arrastra la tarjeta a *Hecho*.
  2. El sistema verifica que todas sus subtareas directas estén en *Hecho*.
  3. Mueve la tarjeta.
- **Alternos:**
  - 2a. Hay subtareas pendientes: el sistema devuelve la tarjeta a su columna e informa cuántas faltan (por ejemplo "Tiene 1 subtarea pendiente") (`RN-12`).
  - 3a. Terminar la última subtarea no mueve al padre: solo un miembro lo mueve, de forma explícita (`RN-13`).
- **Postcondiciones:** ninguna tarjeta en *Hecho* tiene subtareas directas fuera de *Hecho*.
- **Requisitos especiales:** `RNF-REN-02` (movimiento visible a los demás en máximo 1 s). `RNF-MAN-02` (`RN-12` con prueba automatizada).
- **Trazabilidad:** `RF-ARB-07`, `RF-ARB-08` · `RN-12`, `RN-13` · HU-31

### CU-20 · Ver el esquema del proyecto

- **Actor:** Miembro · **Prioridad:** Should
- **Precondiciones:** equipo activo.
- **Flujo principal:**
  1. Abre la vista de esquema.
  2. El sistema muestra las tareas raíz y, indentadas debajo, sus subtareas en todos los niveles.
  3. Cada tarea muestra su columna actual, su responsable y su color efectivo (CU-24).
  4. El miembro hace clic en una tarea y se abre su detalle.
- **Alternos:**
  - 2a. No hay tarjetas: muestra un esquema vacío.
- **Postcondiciones:** ninguna (consulta).
- **Requisitos especiales:** `RNF-REN-03` (carga completa en máximo 2 s con hasta 200 tarjetas).
- **Trazabilidad:** `RF-ARB-09`, `RF-ARB-15` · `RN-15` · HU-32

### CU-21 · Cambiar la tarea padre

- **Actor:** Miembro · **Prioridad:** Should
- **Precondiciones:** la tarjeta existe y hay al menos otra del mismo equipo.
- **Flujo principal:**
  1. En el detalle de la tarjeta elige "Cambiar padre".
  2. Selecciona una nueva tarjeta padre, o "ninguno" para convertirla en tarea raíz.
  3. El sistema verifica que no se genere un ciclo.
  4. Aplica el cambio y actualiza los indicadores de progreso de los padres afectados.
- **Alternos:**
  - 3a. El nuevo padre es la propia tarjeta o una de sus descendientes: rechaza e informa el motivo (`RN-11`).
  - 3b. El nuevo padre es de otro equipo: rechaza (`RN-06`).
- **Postcondiciones:** el conjunto de tarjetas sigue siendo un bosque, sin ciclos.
- **Requisitos especiales:** `RNF-REN-02`. `RNF-MAN-02` (`RN-11` con prueba automatizada).
- **Trazabilidad:** `RF-ARB-10`, `RF-ARB-11` · `RN-06`, `RN-11` · HU-33

### CU-22 · Eliminar una tarjeta con subtareas

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** la tarjeta existe.
- **Flujo principal:**
  1. Elige "Eliminar" sobre la tarjeta.
  2. El sistema pide confirmación e indica cuántas subtareas quedarán como raíces.
  3. El miembro confirma.
  4. El sistema elimina la tarjeta y convierte sus subtareas directas en tareas raíz, sin eliminarlas en cascada.
- **Alternos:**
  - 2a. La tarjeta no tiene subtareas: se elimina con la confirmación normal (ver `RF-KAN-07`).
  - 3a. Cancela: no ocurre ningún cambio.
- **Postcondiciones:** las subtareas se conservan en el tablero sin padre (`RN-14`).
- **Requisitos especiales:** `RNF-REN-02`. `RNF-MAN-02` (`RN-14` con prueba automatizada).
- **Trazabilidad:** `RF-ARB-12` (y `RF-KAN-07` para el caso sin subtareas) · `RN-14` · HU-34

### CU-23 · Asignar color a una tarjeta

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** la tarjeta existe.
- **Flujo principal:**
  1. Abre el selector de color de la tarjeta.
  2. Elige uno de los 8 colores de la paleta fija.
  3. El sistema guarda el color.
- **Alternos:**
  - 2a. Elige "Quitar color": la tarjeta queda sin color propio y pasa a mostrar el de su ancestro más cercano (CU-24).
  - 2b. No existe forma de ingresar un color fuera de la paleta; si el servidor recibe uno, lo rechaza.
- **Postcondiciones:** la tarjeta tiene el color elegido o ninguno.
- **Requisitos especiales:** `RNF-SEG-03` (rechazo de colores fuera de la paleta). `RNF-REN-02`.
- **Trazabilidad:** `RF-ARB-13` · HU-35

### CU-24 · Visualizar el color efectivo de una tarjeta

- **Actor:** Miembro (el cálculo lo hace el Sistema) · **Prioridad:** Must (`RF-ARB-14`), Should (`RF-ARB-15`)
- **Precondiciones:** existen tarjetas en el tablero o en el esquema.
- **Flujo principal:**
  1. El sistema determina el color de cada tarjeta: el propio; si no tiene, el del ancestro más cercano que tenga color; si ninguno, gris neutro.
  2. Dibuja las tarjetas con ese color, tanto en el tablero como en el esquema.
- **Alternos:**
  - 1a. Si se cambia o quita el color de una tarjeta, sus descendientes sin color propio lo reflejan de inmediato.
  - 1b. El color no se copia a las descendientes (`RN-15`).
- **Postcondiciones:** cada rama se distingue visualmente.
- **Requisitos especiales:** `RNF-USA-05` (los 8 colores se distinguen entre sí y el texto sobre cada uno cumple contraste AA de 4.5:1). `RNF-MAN-02` (`RN-15` con prueba automatizada).
- **Trazabilidad:** `RF-ARB-14`, `RF-ARB-15` · `RN-15` · `RNF-USA-05` · HU-32, HU-35

---

## Tablero kanban

Requerimientos en [rf-kanban.md](srs/rf-kanban.md).

### CU-25 · Consultar el tablero y crear una tarjeta

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** pertenece al equipo activo.
- **Flujo principal:**
  1. Abre el tablero del equipo.
  2. El sistema muestra las columnas *Por hacer*, *En progreso* y *Hecho*, en ese orden, con sus tarjetas.
  3. Elige "Crear tarjeta" e ingresa un título; opcionalmente agrega descripción, labels, responsable y fecha límite.
  4. El sistema verifica que los labels y el responsable pertenezcan al mismo equipo.
  5. Crea la tarjeta en *Por hacer* y la muestra en el tablero.
  6. El sistema refleja la nueva tarjeta en los tableros abiertos de los demás miembros del equipo, sin que tengan que recargar la página
- **Alternos:**
  - 2a. El tablero no tiene tarjetas: muestra las tres columnas vacías.
  - 3a. El título está vacío: rechaza la creación e indica que es obligatorio.
  - 4a. Un label o responsable pertenece a otro equipo: rechaza la operación sin crear la tarjeta (`RN-06`, `RN-07`).
- **Postcondiciones:** existe una tarjeta del equipo en *Por hacer*, con los datos opcionales indicados.
- **Requisitos especiales:** `RNF-SEG-02` (membresía comprobada en el servidor); `RNF-SEG-03` (validación de entradas); `RNF-USA-03` (parte del recorrido de primer uso); `RNF-CON-02` (persistencia tras confirmar) `RNF-REN-02` (cambio visible en máximo 2 s en al menos el 95 % de los casos, en red local).
- **Trazabilidad:** `RF-KAN-01`, `RF-KAN-02`, `RF-KAN-03` · `RN-06`, `RN-07` · HU-11, HU-12

### CU-26 · Mover una tarjeta entre columnas

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** el miembro tiene abierto el tablero y la tarjeta pertenece al equipo activo.
- **Flujo principal:**
  1. Arrastra la tarjeta a otra columna y la posición deseada.
  2. El sistema guarda inmediatamente la nueva columna y posición.
  3. El sistema refleja el cambio en los tableros abiertos de los demás miembros sin que recarguen.
- **Alternos:**
  - 2a. La tarjeta es una tarea padre y se intenta mover a *Hecho* mientras alguna subtarea directa sigue pendiente: el sistema rechaza el movimiento e informa cuántas faltan (CU-19, `RN-12`).
  - 2b. La columna o posición enviada no es válida: rechaza el cambio sin modificar la tarjeta (`RNF-SEG-03`).
  - 3a. Un cliente estaba desconectado: al reconectarse recibe el estado actualizado (`RNF-CON-01`).
- **Postcondiciones:** la tarjeta queda en la columna y posición elegidas; las subtareas no mueven automáticamente a su padre (`RN-13`).
- **Requisitos especiales:** `RNF-REN-02` (cambio visible en máximo 1 s en al menos el 95 % de los casos, en red local); `RNF-CON-02` (persistencia tras confirmar).
- **Trazabilidad:** `RF-KAN-04`, `RF-KAN-05` · `RN-12`, `RN-13` · `RNF-REN-02`, `RNF-CON-01` · HU-13

### CU-27 · Editar una tarjeta

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** la tarjeta pertenece al equipo activo.
- **Flujo principal:**
  1. Abre la tarjeta y selecciona "Editar".
  2. Modifica uno o más de estos campos: título, descripción, labels, responsable o fecha límite.
  3. El sistema valida los datos y que los labels y el responsable pertenezcan al mismo equipo.
  4. Guarda los cambios y los muestra en los tableros abiertos de los demás miembros.
- **Alternos:**
  - 3a. Un dato es inválido o un label/responsable pertenece a otro equipo: rechaza el cambio completo y conserva los valores anteriores (`RN-06`, `RN-07`).
  - 3b. Se quita al responsable: la tarjeta queda sin responsable.
- **Postcondiciones:** los campos editados quedan guardados; los datos no editados permanecen iguales.
- **Requisitos especiales:** `RNF-SEG-02`, `RNF-SEG-03`; `RNF-REN-02` (propagación en tiempo real); `RNF-CON-02`.
- **Trazabilidad:** `RF-KAN-05`, `RF-KAN-06` · `RN-06`, `RN-07` · `RNF-REN-02` · HU-34

### CU-28 · Eliminar una tarjeta

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** la tarjeta pertenece al equipo activo.
- **Flujo principal:**
  1. Selecciona "Eliminar" en la tarjeta.
  2. El sistema solicita confirmación explícita; si hay subtareas, informa cuántas quedarán como tareas raíz (CU-22).
  3. El miembro confirma.
  4. El sistema elimina la tarjeta; si tenía subtareas directas, las conserva como tareas raíz, sin borrarlas en cascada.
  5. El sistema refleja la eliminación en los tableros abiertos de los demás miembros.
- **Alternos:**
  - 3a. El miembro cancela: no se elimina ni modifica ninguna tarjeta.
  - 4a. El miembro no pertenece al equipo: el servidor rechaza la operación (`RNF-SEG-02`).
- **Postcondiciones:** la tarjeta ya no existe; sus subtareas directas, si había, permanecen sin padre (`RN-14`).
- **Requisitos especiales:** `RNF-SEG-02`; `RNF-REN-02` (propagación en tiempo real); `RNF-CON-02`; `RNF-MAN-02` (`RN-14` con prueba automatizada).
- **Trazabilidad:** `RF-KAN-05`, `RF-KAN-07`, `RF-ARB-12` · `RN-14` · `RNF-REN-02` · HU-34

### CU-29 · Filtrar las tarjetas del tablero

- **Actor:** Miembro · **Prioridad:** Could
- **Precondiciones:** tiene abierto el tablero del equipo.
- **Flujo principal:**
  1. Selecciona un responsable, uno o más labels, o ambos criterios.
  2. El sistema muestra solo las tarjetas que coinciden con los criterios seleccionados.
  3. Quita uno o todos los filtros.
  4. El sistema vuelve a mostrar las tarjetas que coinciden con los filtros restantes o todas las tarjetas si no queda ninguno.
- **Alternos:**
  - 2a. Ninguna tarjeta coincide: muestra el tablero sin tarjetas visibles e indica que no hay resultados.
  - 3a. El miembro cambia de equipo: los filtros del equipo anterior no se aplican al tablero nuevo.
- **Postcondiciones:** no cambia ningún dato de las tarjetas ni del tablero.
- **Requisitos especiales:** ninguno específico.
- **Trazabilidad:** `RF-KAN-08` · HU-14

---

## Labels, roles y habilidades

Requerimientos en [rf-labels-habilidades.md](srs/rf-labels-habilidades.md).

### CU-30 · Gestionar labels del equipo

- **Actor:** Administrador · **Prioridad:** Must
- **Precondiciones:** sesión activa; es administrador del equipo.
- **Flujo principal:**
  1. Crea un label con nombre único y elige si será un label de habilidad.
  2. El sistema agrega el label al vocabulario del equipo.
  3. Edita el nombre o cambia la marca de habilidad cuando sea necesario.
  4. Para eliminar un label, el sistema informa cuántas tarjetas lo usan y solicita confirmación.
  5. Tras confirmar, el sistema quita el label de esas tarjetas, elimina las respuestas de habilidad relacionadas y elimina el label.
- **Alternos:**
  - 1a. Ya existe un label con ese nombre en el equipo: rechaza la creación; el mismo nombre en otro equipo es independiente.
  - 3a. Se quita la marca de habilidad: el sistema elimina los niveles de habilidad asociados (`RN-08`).
  - 4a. El administrador cancela la eliminación: el label, sus usos y sus respuestas permanecen.
  - 1b. Un miembro que no es administrador intenta crear, editar o eliminar un label, incluso mediante una petición directa: el servidor rechaza la operación (`RN-05`).
- **Postcondiciones:** el vocabulario refleja los cambios confirmados y sigue perteneciendo al equipo.
- **Requisitos especiales:** `RNF-SEG-02` (permisos comprobados en el servidor); `RNF-SEG-03` (validación); `RNF-USA-04` (rechazo accionable); `RNF-CON-02`.
- **Trazabilidad:** `RF-LAB-01`, `RF-LAB-02`, `RF-LAB-03` · `RN-05`, `RN-08` · HU-16

### CU-31 · Gestionar roles informativos del equipo

- **Actor:** Administrador · **Prioridad:** Must
- **Precondiciones:** sesión activa; es administrador del equipo.
- **Flujo principal:**
  1. Crea un rol con nombre, por ejemplo, *backend* o *scrum master*.
  2. Asigna uno o varios roles a un miembro, o quita los que ya no correspondan.
  3. El sistema muestra los roles asignados junto al nombre del miembro.
- **Alternos:**
  - 1a. Un miembro que no es administrador intenta crear un rol, asignarlo a un miembro o quitarlo, incluso mediante una petición directa: el servidor rechaza la operación (`RN-05`).
  - 2a. El rol o el miembro pertenecen a otro equipo: el sistema rechaza la operación.
- **Postcondiciones:** los roles asignados son visibles como información del equipo y no cambian los permisos del miembro (`RN-04`).
- **Requisitos especiales:** `RNF-SEG-02` (autorización en el servidor); `RNF-SEG-03` (validación de entradas); `RNF-USA-04` (mensaje de rechazo accionable).
- **Trazabilidad:** `RF-LAB-04` · `RN-04`, `RN-05` · HU-15

### CU-32 · Responder la encuesta de habilidades

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** pertenece al equipo y hay labels de habilidad en su vocabulario.
- **Flujo principal:**
  1. Abre su encuesta de habilidades.
  2. El sistema muestra solo los labels marcados como habilidad, cada uno inicialmente con su nivel guardado o como *sin responder*.
  3. Declara para cada label uno de estos niveles: *bueno*, *regular* o *malo*.
  4. El sistema guarda cada respuesta y permite dejar otras sin responder.
  5. Más adelante, el miembro vuelve a la encuesta y cambia sus respuestas.
- **Alternos:**
  - 2a. El administrador crea un label de habilidad o marca como habilidad uno existente: aparece en la encuesta de todos los miembros como *sin responder*.
  - 2b. Un label sin marca de habilidad no aparece en la encuesta.
  - 3a. Un miembro intenta consultar los niveles de otra persona: el servidor rechaza la solicitud; el miembro solo puede consultar los propios (`RF-LAB-09`).
  - 3b. Al desmarcar o eliminar un label de habilidad, se elimina su respuesta asociada (`RN-08`).
- **Postcondiciones:** las respuestas parciales quedan guardadas para ese miembro y equipo; no son visibles para otros miembros.
- **Requisitos especiales:** `RNF-SEG-02` (acceso verificado en el servidor); `RNF-SEG-03` (solo niveles permitidos); `RNF-CON-02` (persistencia).
- **Trazabilidad:** `RF-LAB-05`, `RF-LAB-06`, `RF-LAB-09` · `RN-06`, `RN-08` · HU-17

### CU-33 · Asignar responsable con información de habilidades

- **Actor:** Miembro; el Administrador recibe el detalle de habilidades · **Prioridad:** Must (`RF-LAB-07`, `RF-LAB-09`), Should (`RF-LAB-08`)
- **Precondiciones:** la tarjeta pertenece al equipo activo; el responsable elegido es miembro de ese equipo.
- **Flujo principal:**
  1. Abre la tarjeta y elige un responsable.
  2. Si quien asigna es administrador, el sistema muestra para cada candidato los niveles declarados en los labels de habilidad asociados a la tarjeta; *sin responder* se muestra como tal.
  3. Si la tarjeta no tiene labels de habilidad, el sistema no muestra niveles.
  4. El miembro confirma la asignación y el sistema guarda al responsable.
- **Alternos:**
  - 2a. Un miembro que no es administrador realiza la asignación: no se le muestran los niveles de habilidad de otros miembros.
  - 4a. El responsable elegido declaró *malo* en uno o más labels de habilidad de la tarjeta: el sistema muestra una advertencia y permite confirmar o cancelar; al confirmar, guarda la asignación y al cancelar, la conserva sin cambios.
  - 4b. El candidato no pertenece al equipo: el sistema rechaza la asignación (`RN-07`).
- **Postcondiciones:** la tarjeta tiene el responsable elegido, o mantiene el anterior si se cancela.
- **Requisitos especiales:** `RNF-SEG-02` (tanto la asignación como la consulta de niveles se autorizan en el servidor); `RNF-USA-04` (advertencia comprensible).
- **Trazabilidad:** `RF-LAB-07`, `RF-LAB-08`, `RF-LAB-09`, `RF-KAN-02`, `RF-KAN-06` · `RN-07` · HU-18, HU-19

---

## Notificaciones

Requerimientos en [rf-notificaciones.md](srs/rf-notificaciones.md).

### CU-34 · Recibir y consultar notificaciones

- **Actor:** Miembro · **Prioridad:** Must
- **Precondiciones:** tiene sesión activa y pertenece al equipo donde ocurre el evento.
- **Flujo principal:**
  1. Ocurre uno de estos eventos: lo mencionan en un mensaje, le asignan una tarjeta, publican una encuesta en un canal de su equipo o envían un mensaje en uno de sus canales.
  2. Si el tipo de evento está activo en sus preferencias y el canal de origen no está silenciado, el sistema genera una notificación con tipo, texto corto y enlace al mensaje, tarjeta o encuesta.
  3. El indicador permanente de campana aumenta el número de notificaciones no leídas.
  4. El miembro abre la campana y ve la lista de la más reciente a la más antigua.
  5. Abre una notificación o la marca como leída; también puede marcar todas como leídas.
  6. Al abrirla, el sistema dirige al recurso, siempre que el miembro aún tenga acceso al equipo.
- **Alternos:**
  - 2a. El tipo de evento está desactivado: no se genera esa notificación (`RN-19`).
  - 2b. El evento se originó en un canal silenciado: no se genera notificación, incluidas las menciones (`RN-19`).
  - 5a. Marca una notificación como leída: disminuye el contador de no leídas en uno.
  - 6a. Ya no tiene acceso al equipo: el servidor rechaza el acceso al recurso (`RNF-SEG-02`).
- **Postcondiciones:** la notificación conserva su estado de lectura y enlace; el contador corresponde a las no leídas.
- **Requisitos especiales:** `RNF-SEG-02` (notificaciones y recursos autorizados por equipo en el servidor); `RNF-USA-02` (interfaz en español); `RNF-USA-04` (mensajes comprensibles); `RNF-CON-02`.
- **Trazabilidad:** `RF-NOT-01`, `RF-NOT-02` · `RN-19` · HU-20

### CU-35 · Configurar preferencias y silenciar un canal

- **Actor:** Usuario · **Prioridad:** Must (`RF-NOT-03`, `RF-NOT-04`), Should (`RF-NOT-05`)
- **Precondiciones:** sesión activa; para silenciar un canal, pertenece al equipo de ese canal.
- **Flujo principal:**
  1. Abre sus preferencias de notificación.
  2. Activa o desactiva por separado cada tipo de evento: mención, tarea asignada, encuesta publicada y mensaje en canal.
  3. El sistema guarda las preferencias para el usuario y las aplica en todos sus equipos.
  4. Para un canal concreto, el miembro selecciona "Silenciar canal"; el sistema deja de generar para él notificaciones originadas allí.
  5. El miembro puede quitar el silencio; los eventos futuros del canal vuelven a generar notificaciones según sus preferencias por tipo.
- **Alternos:**
  - 2a. Desactiva "mensaje en canal" pero mantiene "mención" activa: los mensajes ordinarios no notifican, pero una mención sí (`RF-NOT-04`).
  - 4a. El canal está silenciado: no notifica ningún evento originado allí, incluidas las menciones, aunque el tipo de evento esté activo.
  - 4b. Intenta silenciar un canal de otro equipo sin membresía: el servidor rechaza la operación (`RNF-SEG-02`).
- **Postcondiciones:** quedan guardadas las preferencias globales del usuario y el estado de silencio por canal.
- **Requisitos especiales:** `RNF-SEG-02` (autorización en el servidor); `RNF-SEG-03` (validación de preferencias); `RNF-CON-02`.
- **Trazabilidad:** `RF-NOT-03`, `RF-NOT-04`, `RF-NOT-05` · `RN-19` · HU-21, HU-22

### CU-36 · Configurar notificaciones por correo

- **Actor:** Usuario · **Prioridad:** Should
- **Precondiciones:** tiene una cuenta con correo electrónico.
- **Flujo principal:**
  1. Abre la configuración de notificaciones por correo.
  2. Activa o desactiva de forma independiente el correo para cada tipo de evento.
  3. Cuando ocurre un evento de un tipo activado, el sistema envía un correo con el texto de la notificación y un enlace al recurso.
  4. El correo llega en un máximo de 5 minutos desde el evento.
- **Alternos:**
  - 2a. El tipo está desactivado para correo: el sistema no envía correo por ese evento, aunque la notificación dentro de la aplicación se rija por su preferencia independiente.
  - 3a. El correo no puede entregarse: el sistema conserva la notificación dentro de la aplicación; el fallo del servicio de correo no cambia las preferencias guardadas.
- **Postcondiciones:** quedan guardadas las preferencias de correo por tipo y los correos se envían solo para los tipos activados.
- **Requisitos especiales:** `RNF-USA-02` (correo en español); uso del proveedor externo permitido únicamente para esta función (`RES-05`).
- **Trazabilidad:** `RF-NOT-06` · HU-23

---

## Votaciones

Requerimientos en [rf-votaciones.md](srs/rf-votaciones.md).

### CU-37 · Publicar una encuesta y votar

- **Actor:** Miembro · **Prioridad:** Must (`RF-VOT-01`, `RF-VOT-02`, `RF-VOT-03`), Should (`RF-VOT-04`)
- **Precondiciones:** pertenece al equipo del canal donde publicará la encuesta.
- **Flujo principal:**
  1. En el canal, elige "Crear encuesta" e ingresa una pregunta y al menos dos opciones.
  2. Elige si la encuesta será anónima y la publica.
  3. El sistema muestra la encuesta como mensaje especial, visible a los miembros del canal.
  4. Un miembro elige una opción y emite su voto.
  5. El sistema registra un voto para ese miembro, muestra los conteos por opción y el total, y los actualiza en tiempo real para quienes tienen abierto el canal.
  6. Si el miembro vota de nuevo, el sistema reemplaza su voto anterior y actualiza los conteos.
- **Alternos:**
  - 1a. La pregunta está vacía o hay menos de dos opciones: rechaza la publicación (`RN-16`).
  - 4a. El usuario no es miembro del equipo: el servidor rechaza la lectura o el voto (`RNF-SEG-02`).
  - 6a. Si la encuesta es anónima, el sistema muestra conteos agregados, pero no revela qué opción eligió cada miembro, incluido el creador o administrador.
  - 6b. La encuesta está cerrada: no permite votar ni cambiar el voto (CU-38, `RN-18`).
- **Postcondiciones:** cada miembro tiene como máximo un voto por encuesta; si vota nuevamente, su voto anterior deja de contar (`RN-17`).
- **Requisitos especiales:** `RNF-SEG-02` (membresía validada en el servidor); `RNF-SEG-03` (validación de pregunta y opciones); `RNF-CON-02` (el voto confirmado persiste).
- **Trazabilidad:** `RF-VOT-01`, `RF-VOT-02`, `RF-VOT-03`, `RF-VOT-04` · `RN-16`, `RN-17` · HU-24, HU-25

### CU-38 · Cerrar una encuesta

- **Actor:** Creador de la encuesta · **Prioridad:** Should
- **Precondiciones:** la encuesta está abierta.
- **Flujo principal:**
  1. El creador elige "Cerrar encuesta".
  2. El sistema cierra la encuesta y muestra el resultado final marcado como cerrado.
  3. El creador y los miembros consultan el resultado final.
- **Alternos:**
  - 2a. Después del cierre, un miembro intenta emitir o cambiar un voto: el sistema rechaza la operación y conserva el resultado final (`RN-18`).
  - 2b. La encuesta ya está cerrada: no altera el resultado.
- **Postcondiciones:** la encuesta permanece cerrada y sus votos ya no cambian.
- **Requisitos especiales:** `RNF-SEG-02` (acceso restringido a miembros del equipo); `RNF-MAN-02` (`RN-18` con prueba automatizada); `RNF-CON-02`.
- **Trazabilidad:** `RF-VOT-05` · `RN-18` · HU-26

### CU-39 · Crear una tarea desde la opción ganadora

- **Actor:** Miembro · **Prioridad:** Could
- **Precondiciones:** pertenece al equipo de la encuesta; la encuesta está cerrada y tiene una opción ganadora.
- **Flujo principal:**
  1. Abre el resultado de la encuesta cerrada.
  2. Elige "Crear tarea" sobre la opción ganadora.
  3. El sistema crea una tarjeta en *Por hacer* usando el texto de esa opción como título.
  4. La tarjeta conserva un enlace a la encuesta de origen.
- **Alternos:**
  - 1a. La encuesta sigue abierta: el sistema no ofrece crear la tarea desde un resultado final.
  - 2a. El usuario no tiene acceso al equipo de la encuesta: el servidor rechaza la operación (`RNF-SEG-02`).
- **Postcondiciones:** hay una tarjeta enlazada a la encuesta cerrada y ubicada en *Por hacer*.
- **Requisitos especiales:** `RNF-SEG-02`; `RNF-SEG-03` (validación del título); `RNF-CON-02`.
- **Trazabilidad:** `RF-VOT-06`, `RF-KAN-02` · HU-27

### CU-40 · Elegir responsable mediante una votación

- **Actor:** Miembro · **Prioridad:** Could
- **Precondiciones:** la tarjeta pertenece al equipo activo; sus miembros pueden acceder a ese equipo.
- **Flujo principal:**
  1. Desde la tarjeta, el miembro elige "Votar responsable".
  2. El sistema crea una encuesta cuyas opciones son los miembros del equipo y la publica.
  3. Los miembros emiten o reemplazan su voto mientras la encuesta está abierta (CU-37).
  4. El creador cierra la encuesta (CU-38).
  5. El sistema ofrece asignar a la tarjeta al miembro ganador.
  6. Al revisar la asignación, el administrador ve los niveles de habilidad pertinentes (CU-33); si el ganador declaró *malo* en un label de habilidad de la tarjeta, el sistema advierte y permite confirmar o cancelar.
  7. Si se confirma, el sistema asigna al ganador como responsable; si se cancela, la tarjeta no cambia.
- **Alternos:**
  - 2a. Un miembro ajeno al equipo intenta consultar opciones o votar: el servidor rechaza la operación (`RNF-SEG-02`).
  - 5a. La encuesta no tiene una opción ganadora única: el SRS no define cómo resolver el empate o la ausencia de votos; no se aplica una asignación automática y queda pendiente acordar el comportamiento.
  - 6a. La tarjeta no tiene labels de habilidad: no se muestran niveles ni advertencia por nivel bajo.
- **Postcondiciones:** si se confirma, el ganador queda como responsable de la tarjeta; de lo contrario, la asignación previa permanece.
- **Requisitos especiales:** `RNF-SEG-02` (membresía y confidencialidad de niveles verificadas en el servidor); `RNF-SEG-03`; `RNF-CON-02`; `RNF-MAN-02` (`RN-17`, `RN-18`).
- **Trazabilidad:** `RF-VOT-07`, `RF-VOT-02`, `RF-VOT-05`, `RF-LAB-07`, `RF-LAB-08`, `RF-LAB-09`, `RF-KAN-06` · `RN-07`, `RN-17`, `RN-18` · HU-28

---

## Cobertura

| Módulo | Requerimientos | Casos |
|---|---|---|
| Cuentas y equipos | `RF-CUE-01` a `RF-CUE-13` (13) | CU-01 a CU-09 |
| Chat | `RF-CHA-01` a `RF-CHA-09` (9) | CU-10 a CU-16 |
| Árbol de proyecto | `RF-ARB-01` a `RF-ARB-15` (15) | CU-17 a CU-24 |
| Tablero kanban | `RF-KAN-01` a `RF-KAN-08` (8) | CU-25 a CU-29 |
| Labels, roles y habilidades | `RF-LAB-01` a `RF-LAB-09` (9) | CU-30 a CU-33 |
| Notificaciones | `RF-NOT-01` a `RF-NOT-06` (6) | CU-34 a CU-36 |
| Votaciones | `RF-VOT-01` a `RF-VOT-07` (7) | CU-37 a CU-40 |

## Pendientes
- Crear las historias HU-36, HU-37 y HU-38, propuestas en el SRS para `RF-CUE-12`, `RF-CUE-13` y `RF-CHA-06`.
- Acordar qué hacer con los resultados sin ganador único (empate o cero votos) para `RF-VOT-06` y `RF-VOT-07`; el SRS no define ese comportamiento.
- 
