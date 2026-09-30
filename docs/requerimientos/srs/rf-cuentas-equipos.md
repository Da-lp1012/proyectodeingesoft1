# RF-CUE · Cuentas y equipos

Módulo: registro, sesión, creación de equipos, invitaciones, membresías y administración. Convenciones en el [índice](README.md#15-convenciones).

---

### RF-CUE-01 · Registro de cuenta
El sistema debe permitir a un visitante crear una cuenta proporcionando un correo electrónico, un nombre y una contraseña de al menos 8 caracteres.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-01
- **Verificación:** Prueba — registrar con datos válidos y comprobar que se crea la cuenta y se inicia sesión; intentar con contraseña de 7 caracteres y comprobar el rechazo.

### RF-CUE-02 · Rechazo de correo duplicado
El sistema debe rechazar el registro cuando el correo ya está asociado a una cuenta, informando el error y sin crear una cuenta adicional.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-01
- **Justificación:** el correo es el identificador de inicio de sesión; dos cuentas con el mismo correo harían ambigua la autenticación.
- **Verificación:** Prueba — registrar dos veces el mismo correo; la segunda debe fallar y la base de datos debe contener una sola cuenta.

### RF-CUE-03 · Inicio de sesión
El sistema debe autenticar a un usuario mediante su correo y contraseña y, si son correctos, establecer una sesión y mostrarle la lista de sus equipos.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-02
- **Verificación:** Prueba — iniciar sesión con credenciales correctas y comprobar acceso a los equipos.

### RF-CUE-04 · Mensaje genérico ante credenciales inválidas
Cuando las credenciales sean inválidas, el sistema debe responder con un único mensaje genérico que no revele si el correo existe o si fue la contraseña la que falló.

- **Prioridad:** Must · **Fuente:** derivado (seguridad) · **Historias:** HU-02
- **Justificación:** evita que un atacante enumere qué correos tienen cuenta.
- **Verificación:** Prueba — intentar con correo inexistente y con correo existente + contraseña errónea; ambos mensajes deben ser idénticos.

### RF-CUE-05 · Cierre de sesión
El sistema debe permitir al usuario cerrar su sesión; tras hacerlo, ningún recurso de equipo debe ser accesible hasta autenticarse de nuevo.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-02
- **Verificación:** Prueba — cerrar sesión e intentar acceder a un canal por su URL; debe redirigir al inicio de sesión.

### RF-CUE-06 · Creación de equipo
El sistema debe permitir a un usuario crear un equipo con un nombre, quedando el creador como administrador del equipo.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-03
- **Verificación:** Prueba — crear un equipo y comprobar que el creador tiene permisos de administrador (por ejemplo, puede crear labels).

### RF-CUE-07 · Recursos iniciales del equipo
Al crear un equipo, el sistema debe crear automáticamente el canal `#general` y un tablero con las columnas *Por hacer*, *En progreso* y *Hecho*, vacío.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-03, HU-11
- **Justificación:** un equipo recién creado debe ser usable de inmediato, sin pasos de configuración.
- **Verificación:** Demostración — crear un equipo y abrirlo: el canal y el tablero existen.

### RF-CUE-08 · Código de invitación
El sistema debe permitir al administrador generar un código de invitación del equipo y revocarlo, invalidando el anterior.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-04
- **Verificación:** Prueba — generar código, revocarlo, intentar usarlo: debe fallar.

### RF-CUE-09 · Unirse con código
El sistema debe permitir a un usuario unirse a un equipo ingresando un código de invitación vigente, creándole una membresía sin permisos de administrador; con un código inexistente o revocado debe rechazar la operación e informar el error.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-04
- **Verificación:** Prueba — unirse con código válido (éxito, sin admin) y con código inválido (rechazo).

### RF-CUE-10 · Pertenencia a varios equipos
El sistema debe permitir que un usuario pertenezca simultáneamente a varios equipos y seleccione cuál es el equipo activo.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-05
- **Verificación:** Demostración — un usuario en dos equipos cambia entre ellos.

### RF-CUE-11 · Contexto del equipo activo
El sistema debe mostrar únicamente los canales, el tablero, las votaciones y las notificaciones del equipo activo; los de otros equipos del usuario no deben mezclarse en la misma vista.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-05
- **Verificación:** Prueba — con dos equipos que tienen canales de igual nombre, comprobar que al cambiar de equipo cambian los mensajes mostrados.

### RF-CUE-12 · Transferencia de administración
El sistema debe permitir a un administrador otorgar el rol de administrador a otro miembro del equipo y, opcionalmente, renunciar al suyo, siempre que el equipo conserve al menos un administrador.

- **Prioridad:** Should · **Fuente:** modelo de dominio (RN-03) · **Historias:** sin historia (propuesta HU-36)
- **Justificación:** sin esto, si el creador abandona el proyecto el equipo queda sin nadie que pueda gestionar labels y roles.
- **Verificación:** Prueba — transferir y comprobar permisos; intentar que el único admin renuncie: debe rechazarse.

### RF-CUE-13 · Salir de un equipo
El sistema debe permitir a un miembro abandonar un equipo, eliminando su membresía, salvo que sea el único administrador, en cuyo caso debe exigir transferir la administración primero.

- **Prioridad:** Should · **Fuente:** modelo de dominio (RN-03) · **Historias:** sin historia (propuesta HU-37)
- **Verificación:** Prueba — salir como miembro común (éxito); salir como único admin (rechazo con mensaje).
