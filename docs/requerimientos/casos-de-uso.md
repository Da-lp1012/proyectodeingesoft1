# Casos de uso — Slackless

Versión 0.1 · 2026-10-11 · Borrador para discusión con el equipo

> **Alcance de la 0.1:** casos de uso de los módulos Cuentas y equipos (`RF-CUE`), Chat (`RF-CHA`), Árbol de proyecto (`RF-ARB`), Tablero kanban (`RF-KAN`), Labels, roles y habilidades (`RF-LAB`), Notificaciones (`RF-NOT`) y Votaciones (`RF-VOT`): 67 requerimientos funcionales agrupados en * casos de uso. Los requerimientos no funcionales ya están incorporados a cada caso (campo *Requisitos especiales*).

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
| [Tablero kanban](#Tablero-Kanban) | [rf-kanban.md](srs/rf-kanban.md) | CU-* a CU-* |
| [Labels, roles y habilidades](#Labels-Habilidades) | [rf-labels-habilidades.md](srs/rf-labels-habilidades.md) | CU-* a CU-* |
| [Notificaciones](#Notificaciones) | [rf-notificaciones.md](srs/rf-notificaciones.md) | CU-* a CU-* |
| [Votaciones](#Votaciones) | [rf-votaciones.md](srs/rf-votaciones.md) | CU-* a CU-* |

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

---

## Labels, roles y habilidades

Requerimientos en [rf-labels-habilidades.md](srs/rf-labels-habilidades.md).

---

## Notificaciones

Requerimientos en [rf-notificaciones.md](srs/rf-notificaciones.md).

---

## Votaciones

Requerimientos en [rf-votaciones.md](srs/rf-votaciones.md).

---

## Cobertura

| Módulo | Requerimientos | Casos |
|---|---|---|
| Cuentas y equipos | `RF-CUE-01` a `RF-CUE-13` (13) | CU-01 a CU-09 |
| Chat | `RF-CHA-01` a `RF-CHA-09` (9) | CU-10 a CU-16 |
| Árbol de proyecto | `RF-ARB-01` a `RF-ARB-15` (15) | CU-17 a CU-24 |

## Pendientes

- Casos de uso de Kanban, Labels y habilidades, Notificaciones y Votaciones.
- Crear las historias HU-36, HU-37 y HU-38, propuestas en el SRS para `RF-CUE-12`, `RF-CUE-13` y `RF-CHA-06`.
