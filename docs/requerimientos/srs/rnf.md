# RNF · Requerimientos no funcionales y restricciones

Cualidades que el sistema debe tener, agrupadas según IEEE 830 §3 (rendimiento, seguridad, usabilidad, confiabilidad, mantenibilidad, portabilidad) más las restricciones del proyecto. Convenciones en el [índice](README.md#15-convenciones).

---

## Rendimiento (REN)

### RNF-REN-01 · Latencia de mensajes
El sistema debe entregar un mensaje de chat a los demás miembros conectados al canal en un tiempo máximo de 1 segundo desde su envío, medido en red local, en al menos el 95 % de los envíos.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** HU-07
- **Verificación:** Análisis — enviar 100 mensajes entre dos clientes con reloj sincronizado y medir; al menos 95 deben llegar en ≤ 1 s.

### RNF-REN-02 · Latencia de cambios del tablero
El sistema debe reflejar un cambio del tablero (crear, mover, editar, eliminar tarjeta) en los demás clientes conectados en un tiempo máximo de 1 segundo, en red local, en al menos el 95 % de los casos.

- **Prioridad:** Must · **Fuente:** derivado de RF-KAN-05 · **Historias:** HU-13
- **Verificación:** Análisis — igual que RNF-REN-01, con movimientos de tarjeta.

### RNF-REN-03 · Carga del tablero
El sistema debe mostrar completamente un tablero de hasta 200 tarjetas en un tiempo máximo de 2 segundos desde que se solicita, en red local.

- **Prioridad:** Should · **Fuente:** derivado · **Historias:** —
- **Verificación:** Análisis — poblar un equipo con 200 tarjetas (con árbol) y medir el tiempo de carga en el navegador.

### RNF-REN-04 · Concurrencia
El sistema debe soportar al menos 10 usuarios conectados simultáneamente en un mismo equipo y 5 equipos activos a la vez, sin incumplir RNF-REN-01 ni RNF-REN-02.

- **Prioridad:** Should · **Fuente:** derivado (tamaño del usuario objetivo) · **Historias:** —
- **Verificación:** Análisis — prueba de carga con clientes simulados y medición de latencias.

## Seguridad (SEG)

### RNF-SEG-01 · Almacenamiento de contraseñas
El sistema debe almacenar las contraseñas únicamente como hash producido por un algoritmo diseñado para contraseñas (bcrypt o equivalente con factor de costo configurable); la contraseña en claro no debe escribirse en base de datos, registros ni respuestas.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** —
- **Verificación:** Inspección — revisar la tabla de usuarios y los registros del servidor tras un registro; buscar la contraseña en claro: no debe aparecer.

### RNF-SEG-02 · Autorización en el servidor
El sistema debe verificar en el servidor, en cada operación sobre un recurso de equipo (canal, mensaje, tarjeta, label, encuesta, nivel de habilidad, notificación), que el usuario autenticado tiene membresía en ese equipo y los permisos necesarios; la interfaz no debe ser la única barrera.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** —
- **Justificación:** cualquiera puede enviar peticiones al servidor sin pasar por la interfaz; ocultar un botón no protege nada.
- **Verificación:** Prueba — con la sesión de un usuario ajeno al equipo, enviar directamente al servidor peticiones de lectura y escritura sobre recursos del equipo: todas deben rechazarse.

### RNF-SEG-03 · Validación de entradas
El sistema debe validar en el servidor toda entrada del cliente (tipos, longitudes máximas, valores permitidos) y rechazar con un error claro las peticiones malformadas, sin ejecutar ninguna operación parcial.

- **Prioridad:** Must · **Fuente:** derivado · **Historias:** —
- **Verificación:** Prueba — enviar un título de 10 000 caracteres, una columna inexistente y un color fuera de la paleta: rechazo en los tres casos.

### RNF-SEG-04 · Gestión de sesión
El sistema debe invalidar la sesión al cerrar sesión, expirar toda sesión tras 7 días sin renovación y no transportar el identificador de sesión en la URL.

- **Prioridad:** Must · **Fuente:** derivado · **Historias:** HU-02
- **Verificación:** Inspección y Prueba — revisar que el token viaja en cabecera o cookie; reutilizar un token tras cerrar sesión: rechazo.

## Usabilidad (USA)

### RNF-USA-01 · Diseño adaptable
El sistema debe ser completamente utilizable, sin desplazamiento horizontal ni elementos ocultos, en pantallas desde 360 px de ancho hasta escritorio.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** —
- **Verificación:** Inspección — recorrer todas las pantallas con emulación de 360 px y de 1366 px.

### RNF-USA-02 · Idioma
El sistema debe presentar toda su interfaz, mensajes de error y correos en español.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** —
- **Verificación:** Inspección — revisión de todas las pantallas y plantillas de correo.

### RNF-USA-03 · Primer uso sin instrucciones
Una persona que no haya usado Slackless debe poder registrarse, crear un equipo, crear una tarjeta y enviar un mensaje en un tiempo máximo de 5 minutos, sin ayuda ni documentación.

- **Prioridad:** Should · **Fuente:** RFC 0001 §2 (minimalismo) · **Historias:** —
- **Verificación:** Prueba de usabilidad — 3 personas ajenas al equipo; al menos 2 de 3 deben lograrlo.

### RNF-USA-04 · Mensajes de error accionables
Todo mensaje de error visible al usuario debe decir qué ocurrió y qué puede hacer, en lenguaje no técnico; no debe mostrar trazas ni códigos internos.

- **Prioridad:** Must · **Fuente:** derivado · **Historias:** —
- **Verificación:** Inspección — provocar los errores previstos en los RF y revisar cada mensaje.

### RNF-USA-05 · Legibilidad de la paleta
Los 8 colores de la paleta de ramas deben distinguirse entre sí a simple vista y el texto sobre cada uno debe cumplir el contraste mínimo AA de WCAG 2.1 (4.5:1).

- **Prioridad:** Should · **Fuente:** derivado de RF-ARB-13 · **Historias:** HU-35
- **Verificación:** Análisis — medir el contraste de cada combinación con una herramienta de contraste.

## Confiabilidad (CON)

### RNF-CON-01 · Reconexión automática
Tras una pérdida de conexión, el cliente debe reconectarse al servidor sin intervención del usuario y mostrar los mensajes y cambios del tablero ocurridos durante la desconexión.

- **Prioridad:** Should · **Fuente:** derivado (ADR 0001 menciona reconexión) · **Historias:** —
- **Verificación:** Prueba — desconectar la red 30 s mientras otro cliente envía mensajes; al reconectar, los mensajes aparecen.

### RNF-CON-02 · Durabilidad de las operaciones
Toda operación que el sistema confirme al usuario (mensaje enviado, tarjeta creada o movida, voto emitido) debe conservarse aunque el servidor se reinicie inmediatamente después.

- **Prioridad:** Must · **Fuente:** derivado · **Historias:** —
- **Verificación:** Prueba — realizar operaciones, reiniciar el servidor, comprobar que persisten.

## Mantenibilidad (MAN)

### RNF-MAN-01 · Arranque con un comando
El sistema completo (aplicación web, servidor, base de datos y almacén efímero) debe poder levantarse en un equipo de desarrollo con un único comando documentado en el README, partiendo de una máquina con Docker instalado.

- **Prioridad:** Must · **Fuente:** elicitación 2026-09-25 · **Historias:** —
- **Verificación:** Demostración — clonar el repositorio en una máquina limpia y ejecutar el comando.

### RNF-MAN-02 · Pruebas automatizadas de las reglas de negocio
Las reglas de negocio RN-03, RN-11, RN-12, RN-14, RN-15, RN-17 y RN-18 deben estar cubiertas por pruebas automatizadas que se ejecuten con un comando.

- **Prioridad:** Should · **Fuente:** derivado · **Historias:** —
- **Justificación:** son las reglas cuya violación corrompe datos o miente al usuario; deben protegerse contra cambios futuros.
- **Verificación:** Inspección — existe una prueba por regla y todas pasan.

### RNF-MAN-03 · Tipos compartidos
Los contratos de datos entre la aplicación web y el servidor deben definirse una sola vez y compartirse entre ambos, de modo que un cambio de contrato se detecte en tiempo de compilación en los dos lados.

- **Prioridad:** Should · **Fuente:** ADR 0001 (consecuencia positiva "Full-Stack TypeScript") · **Historias:** —
- **Verificación:** Inspección — cambiar el nombre de un campo en el contrato y comprobar que ambos lados dejan de compilar.

### RNF-MAN-04 · Modularidad por área funcional
El servidor debe estar organizado en módulos que correspondan a los módulos de este SRS (cuentas y equipos, chat, kanban, árbol, labels y habilidades, notificaciones, votaciones), de modo que cada requerimiento funcional se localice en un solo módulo.

- **Prioridad:** Should · **Fuente:** ADR 0001 (monolito modular) · **Historias:** —
- **Verificación:** Inspección — la estructura de carpetas del servidor refleja los módulos.

## Portabilidad (POR)

### RNF-POR-01 · Navegadores soportados
El sistema debe funcionar en las dos últimas versiones estables de Chrome, Firefox y Edge en escritorio, y en Chrome para Android y Safari para iOS.

- **Prioridad:** Must · **Fuente:** derivado · **Historias:** —
- **Verificación:** Demostración — recorrido de las funciones *Must* en cada navegador.

### RNF-POR-02 · Entorno de desarrollo multiplataforma
El entorno de desarrollo debe poder ejecutarse en Windows, macOS y Linux mediante Docker, sin pasos específicos por sistema operativo.

- **Prioridad:** Should · **Fuente:** derivado (el equipo usa sistemas distintos) · **Historias:** —
- **Verificación:** Demostración — RNF-MAN-01 ejecutado en al menos dos sistemas operativos.

---

## Restricciones (RES)

Condiciones impuestas desde fuera del producto. No tienen prioridad: se cumplen o el proyecto no es válido.

### RES-01 · Stack tecnológico
El sistema debe construirse con el stack fijado en el [ADR 0001](../../adr/0001_Eleccion_Stack.md): React + Vite + TypeScript en la aplicación web; NestJS + TypeScript con Socket.IO en el servidor; PostgreSQL como base de datos persistente y Redis para estado efímero.

- **Fuente:** ADR 0001 · **Verificación:** Inspección del repositorio.

### RES-02 · Proceso de desarrollo
Todo cambio debe entrar a la rama `main` mediante pull request con al menos una revisión aprobada y *squash merge*, siguiendo trunk-based development según la [guía de git](../../guia-git.md).

- **Fuente:** curso · **Verificación:** Inspección de la configuración de protección de rama y del historial.

### RES-03 · Repositorio y documentación
El código y la documentación deben residir en el repositorio GitHub del equipo; la documentación debe escribirse en Markdown dentro de `docs/`.

- **Fuente:** curso · **Verificación:** Inspección.

### RES-04 · Plazo
Todos los requerimientos con prioridad *Must* deben estar implementados y verificados al cierre del semestre 2026-2.

- **Fuente:** curso · **Verificación:** Análisis — revisión de la matriz de verificación al cierre.

### RES-05 · Dependencias externas
El MVP no debe depender de servicios externos para ninguna función *Must*; el único servicio externo admitido es el proveedor de correo para `RF-NOT-06` (*Should*).

- **Fuente:** RFC 0001 §7 · **Verificación:** Inspección de la configuración y las dependencias.
