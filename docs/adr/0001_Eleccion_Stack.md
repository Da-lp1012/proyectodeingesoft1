# ADR 0001: Elección de Stack tecnológico

* **Estatus:** Aceptado
* **Fecha:** 2026-09-16
* **Autores:** 
David Esteban Raigosa Socha
Deisy Viviana Lara Sisa
Hare Zeiyiukuin Atehortua Rincon
Fredy Humberto Garzon Salgado
Silvana Ramirez Ardila

## Contexto
La aplicacion necesita una interfaz interactiva y minimalista (lo cual en teoria logra que sea intuitiva) pues va a contar con un tablero kanban dinamico(drag and drop) y actualizacion constante de componentes sin parpadeos de pantalla, debe soportar comunicacion fluida entre multiples usuarios en simultaneo mediante un chat integrado, la idea es separar la información estructurada (usuarios, tableros, tareas y mensajes) de los datos no tan importantes (usuarios conectados, estado 'escribiendo', caché de sesión).

## Decisión

### Frontend: React + Vite + TypeScript 
Escogimos React como libreria de JavaScript (y en consecuencia libreria de TypeScript) principalmente por que cuenta con el ecosistema mas amplio de librerias para interfaces complejas, y vite como herramienta de construccion de react, decidimos usar TypeScript para evitar errores de manejo de estado global, la alternativa era svelte+sveltekit que permiten una actualizacion directa de el DOM de la pagina web, lo cual disminuye la latencia, aun asi consideramos que para nuestro proyecto resulta mas beneficioso el ecosistema de react.

### Backend: Nest.js + TypeScript (Socket.IO para tiempo real)
Elegimos Nest.js para mantener la arquitectura organizada en un monolito modular mediante modulos, controladores y servicios, lo cual nos facilita gestionar permisos complejos (guards) y validaciones de datos entrantes (DTOs) para la logica tipo Slack. Para el tiempo real usamos Socket.IO por su madurez, reconexion automatica y manejo sencillo de salas/canales.
* **Alternativas descartadas:** 
  * *Express.js:* Se descartó porque no impone una estructura de arquitectura estricta, lo que a mediano plazo podria causar desorden en la logica de permisos, hilos y canales.
  * *Go (Gin/Fiber):* Se descartó para no perder la ventaja de compartir tipos con el frontend mediante TypeScript.
  * *WebTransport / QUIC:* Se descartó por la complejidad de implementar la logica de mensajeria desde cero y el riesgo de que el trafico UDP sea bloqueado en redes corporativas.

### Base de Datos: PostgreSQL (almacenamiento persistente) + Redis (presencia de usuarios y eventos efímeros)
Usaremos PostgreSQL como base de datos principal para asegurar la integridad relacional (relaciones entre usuarios, canales, tareas del kanban y mensajes), usando campos JSONB para datos variables. Redis se usara exclusivamente para absorber el trafico efímero (usuarios en linea, sockets activos, estado 'escribiendo' y cache).
* **Alternativa descartada:** 
  * *MongoDB:* Se descartó porque los mensajes y tareas necesitan un control de permisos y relaciones estricto con los usuarios y canales, algo que en NoSQL requeriria duplicar muchos datos y escribir logica muy compleja de consultar.

## Consecuencias

* **Positivas:**
  * **Full-Stack TypeScript:** Podemos compartir interfaces, tipos de datos y esquemas de validacion entre el frontend en React y el backend en Nest.js, reduciendo errores en tiempo de desarrollo.
  * **Estructura limpia y mantenible:** La arquitectura de Nest.js nos obliga a mantener el codigo ordenado desde el dia uno, facilitando agregar roles y permisos sin romper otros modulos.
  * **Ecosistema y velocidad:** Contamos con el ecosistema de React para resolver facilmente la virtualizacion de listas de mensajes pesadas y la dinamica drag and drop del tablero kanban.
  * **Separacion eficiente de base de datos:** PostgreSQL garantiza que la informacion importante no se corrompa, mientras Redis evita saturar el disco con eventos efimeros de tiempo real.

* **Negativas / Riesgos:**
  * **Mayor codigo inicial (Boilerplate):** Nest.js requiere escribir mas archivos, decoradores e interfaces para endpoints sencillos a diferencia de un servidor basico en Express.
  * **Curva de aprendizaje:** El equipo debe adaptarse a los patrones de Programacion Orientada a Objetos, Inyeccion de Dependencias y Decoradores que impone Nest.js.
  * **Gestion de dos bases de datos:** Requerimos mantener y desplegar tanto PostgreSQL como Redis desde el inicio del proyecto.
  * **Consumo de memoria:** El runtime de Node.js junto a la reflexiom de metadatos de Nest.js consume mas memoria RAM que una alternativa compilada en Go.
