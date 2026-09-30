# Especificación de requerimientos de software (SRS) — Slackless

Versión 0.1 · 2026-09-29 · Formato: lenguaje natural estructurado según IEEE 830 / ISO/IEC/IEEE 29148

## Cómo está organizada

Un archivo por módulo funcional, más los no funcionales, las reglas de negocio y este índice. Cada compañero puede ser dueño de un archivo sin generar conflictos con los demás.

| Archivo | Contenido | IDs |
|---|---|---|
| [rf-cuentas-equipos.md](rf-cuentas-equipos.md) | Registro, sesión, equipos, membresías | `RF-CUE-*` |
| [rf-chat.md](rf-chat.md) | Canales, mensajes, directos, menciones | `RF-CHA-*` |
| [rf-kanban.md](rf-kanban.md) | Tablero, tarjetas, movimiento, edición | `RF-KAN-*` |
| [rf-arbol-proyecto.md](rf-arbol-proyecto.md) | Subtareas, progreso, esquema, colores | `RF-ARB-*` |
| [rf-labels-habilidades.md](rf-labels-habilidades.md) | Labels, roles, encuesta, asignación informada | `RF-LAB-*` |
| [rf-notificaciones.md](rf-notificaciones.md) | Eventos, campana, preferencias, correo | `RF-NOT-*` |
| [rf-votaciones.md](rf-votaciones.md) | Encuestas, votos, cierre | `RF-VOT-*` |
| [rnf.md](rnf.md) | Rendimiento, seguridad, usabilidad, confiabilidad, mantenibilidad, portabilidad y restricciones | `RNF-*`, `RES-*` |
| [reglas-negocio.md](reglas-negocio.md) | Invariantes del dominio que el sistema debe garantizar siempre | `RN-*` |

---

## 1. Introducción

### 1.1 Propósito

Este documento especifica **qué debe hacer** Slackless y **qué cualidades debe tener**, de forma verificable. Es el contrato entre el equipo y el producto. No dice *cómo* se construye (eso va en los ADR y el código) ni *en qué orden* (eso va en las historias de usuario y los sprints).

Requerimientos e historias de usuario son documentos distintos con propósitos distintos:

| | Requerimiento | Historia de usuario |
|---|---|---|
| Qué es | Afirmación verificable de lo que el sistema debe hacer | Unidad de trabajo planificable, escrita desde la persona |
| Perspectiva | El sistema | El usuario |
| Vida útil | Estable durante el proyecto | Se consume en un sprint |
| Ejemplo | *El sistema debe rechazar el registro cuando el correo ya existe.* | *Como visitante quiero registrarme para usar Slackless.* |
| Dónde | Este SRS | [historias-de-usuario.md](../historias-de-usuario.md) |

Los conecta la **trazabilidad** (sección 5): todo requerimiento funcional debería tener al menos una historia que lo entregue, y toda historia debería responder a algún requerimiento.

### 1.2 Alcance

Slackless es una aplicación web para equipos de 3 a 8 personas que integra chat por canales, tablero kanban con árbol de tareas, roles según habilidades declaradas, notificaciones configurables por persona y votaciones dentro del chat. El alcance de este SRS es el MVP del semestre 2026-2: todos los requerimientos con prioridad *Must*, y los *Should*/*Could* según avance.

Fuera de alcance: aplicaciones móviles nativas, hilos de conversación, archivos adjuntos, integraciones con servicios de terceros distintos del correo, facturación.

### 1.3 Definiciones

| Término | Significado |
|---|---|
| **Usuario** | Persona con cuenta en Slackless |
| **Visitante** | Persona sin sesión iniciada |
| **Equipo** | Espacio de trabajo; dueño de canales, tablero, labels, roles y votaciones |
| **Membresía** | Relación de un usuario con un equipo; guarda si es admin, sus roles y sus niveles de habilidad |
| **Miembro** | Usuario con membresía en el equipo del que se habla |
| **Administrador (admin)** | Miembro con permisos de gestión del equipo |
| **Canal** | Conversación pública de un equipo |
| **Conversación directa** | Conversación privada entre exactamente dos miembros |
| **Tarjeta / tarea** | Unidad de trabajo del tablero kanban (se usan como sinónimos) |
| **Columna** | Estado de una tarjeta: *Por hacer*, *En progreso*, *Hecho* |
| **Subtarea** | Tarjeta que tiene una tarjeta padre |
| **Tarea raíz** | Tarjeta sin padre |
| **Rama** | Una tarea raíz y todas sus descendientes |
| **Label** | Etiqueta del vocabulario del equipo, definida por el admin, con o sin marca de habilidad |
| **Label de habilidad** | Label que además aparece en la encuesta de habilidades |
| **Nivel de habilidad** | Respuesta de un miembro para un label de habilidad: *bueno*, *regular* o *malo* |
| **Rol** | Etiqueta informativa asignada a un miembro (p. ej. *backend*, *scrum master*); no otorga permisos |
| **Encuesta** | Votación publicada en un canal, con dos o más opciones |
| **Tiempo real** | Sin que el usuario recargue la página ni pulse "actualizar" |

### 1.4 Referencias

- [RFC 0001 — Slackless](../../rfc/0001-slackless.md): propuesta y motivación.
- [ADR 0001 — Elección de stack](../../adr/0001_Eleccion_Stack.md): restricciones tecnológicas.
- [Historias de usuario](../historias-de-usuario.md): planeación.
- [Modelo de dominio](../modelo-dominio.md): entidades y relaciones.
- ISO/IEC/IEEE 29148:2018, *Systems and software engineering — Life cycle processes — Requirements engineering*.
- IEEE Std 830-1998, *Recommended Practice for Software Requirements Specifications*.

### 1.5 Convenciones

**Identificadores.** `RF-<MÓDULO>-<NN>` para funcionales, `RNF-<CATEGORÍA>-<NN>` para no funcionales, `RES-<NN>` para restricciones, `RN-<NN>` para reglas de negocio. Los IDs son estables: nunca se renumeran ni se reutilizan; un requerimiento retirado se marca *Retirado* y se conserva.

**Verbo.** Todo requerimiento usa **"debe"** (el *shall* de la norma). La prioridad no se expresa con el verbo sino con el atributo *Prioridad*, para que no haya ambigüedad entre "debería" como recomendación y como prioridad media.

**Atributos de cada requerimiento** (ISO 29148 §6.4):

- **Prioridad:** *Must* (imprescindible para el MVP), *Should* (importante), *Could* (deseable).
- **Fuente:** de dónde salió — *elicitación 2026-09-25*, *equipo 2026-09-29*, *modelo de dominio*, *ADR 0001*, *derivado* (surgió al analizar otro requerimiento).
- **Historias:** historias de usuario que lo entregan, o *sin historia* si todavía no tiene.
- **Justificación:** por qué existe, cuando no es evidente.
- **Verificación:** cómo se comprueba que se cumple. Métodos: **Prueba** (ejecutar el sistema con entradas y comparar salidas), **Demostración** (operar el sistema y observar), **Inspección** (revisar código, configuración o base de datos), **Análisis** (medir o razonar sobre datos).

**Criterios de calidad** que cada requerimiento intenta cumplir (ISO 29148 §5.2.5): necesario, independiente de la implementación, no ambiguo, consistente con los demás, completo, **singular** (una sola cosa por requerimiento), factible, trazable y verificable. Cuando una historia decía dos cosas, aquí son dos requerimientos.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

Sistema nuevo, independiente, accesible desde el navegador. Un solo backend (monolito modular) y una aplicación web; base de datos relacional para datos persistentes y un almacén en memoria para estado efímero de tiempo real (ADR 0001). Depende únicamente de un servicio de correo externo para los requerimientos de notificación por correo (*Should*).

### 2.2 Funciones principales

1. Cuentas y equipos: registro, sesión, crear/unirse a equipos, administrar.
2. Chat: canales, mensajes en tiempo real, directos, menciones, tarea desde mensaje.
3. Tablero kanban: tres columnas, tarjetas con labels/responsable/fecha, arrastrar y soltar.
4. Árbol de proyecto: subtareas sin límite de profundidad, progreso, bloqueo de cierre, esquema, color por rama.
5. Labels, roles y habilidades: vocabulario del equipo, encuesta, asignación informada.
6. Notificaciones: eventos, campana, preferencias por tipo, silenciar canales, correo.
7. Votaciones: encuestas en canales, anónimas, cierre, conexión con tareas.

### 2.3 Usuarios

| Perfil | Características | Qué necesita |
|---|---|---|
| Estudiante en proyecto de curso | 3–6 personas, un semestre, sin jerarquía formal, poca experiencia con herramientas de gestión | Arrancar en minutos, no saturarse de funciones |
| Líder o administrador del equipo | Quien crea el equipo; organiza roles, labels y asignaciones | Ver quién puede hacer qué; que el tablero no mienta |
| Integrante de equipo de trabajo pequeño | Semilleros, startups | Lo mismo, con más equipos en paralelo |

Todos usan navegador de escritorio y de celular. No se asume conocimiento técnico.

### 2.4 Restricciones

Ver `RES-*` en [rnf.md](rnf.md): stack fijado por el ADR 0001, proceso trunk-based, plazo del semestre.

### 2.5 Suposiciones y dependencias

- Los usuarios tienen correo electrónico propio y navegador moderno.
- El equipo de desarrollo son 5 personas novatas en el stack; los requerimientos *Should* y *Could* se recortan antes que los *Must*.
- El servicio de correo (para `RF-NOT-06`) será un proveedor externo gratuito para el volumen del proyecto.
- El despliegue del MVP es local o en un servidor único; no se requiere alta disponibilidad.

---

## 3. Requerimientos específicos

Están en los archivos listados al inicio. Cada uno agrupa los requerimientos de un módulo, en el orden en que un usuario los encontraría.

---

## 4. Resumen

| Tipo | Cantidad | Must | Should | Could |
|---|---|---|---|---|
| Funcionales (RF) | 67 | 49 | 15 | 3 |
| No funcionales (RNF) | 21 | 12 | 9 | 0 |
| Restricciones (RES) | 5 | — | — | — |
| Reglas de negocio (RN) | 19 | — | — | — |

Por módulo: CUE 13 · CHA 9 · KAN 8 · ARB 15 · LAB 9 · NOT 6 · VOT 7.

---

## 5. Trazabilidad

### 5.1 Historia de usuario → requerimientos

| Historia | Requerimientos que la especifican |
|---|---|
| HU-01 Registro | RF-CUE-01, RF-CUE-02 |
| HU-02 Iniciar/cerrar sesión | RF-CUE-03, RF-CUE-04, RF-CUE-05 |
| HU-03 Crear equipo | RF-CUE-06, RF-CUE-07 |
| HU-04 Unirse con código | RF-CUE-08, RF-CUE-09 |
| HU-05 Varios equipos | RF-CUE-10, RF-CUE-11 |
| HU-06 Canales | RF-CHA-01, RF-CHA-02 |
| HU-07 Mensajes en tiempo real | RF-CHA-03, RF-CHA-04, RF-CHA-05, RNF-REN-01 |
| HU-08 Mensajes directos | RF-CHA-07 |
| HU-09 Menciones | RF-CHA-08 |
| HU-10 Crear tarea desde chat | RF-CHA-09 |
| HU-11 Tablero | RF-KAN-01, RF-CUE-07 |
| HU-12 Crear tarjeta | RF-KAN-02, RF-KAN-03 |
| HU-13 Mover tarjeta | RF-KAN-04, RF-KAN-05, RNF-REN-02 |
| HU-14 Filtrar | RF-KAN-08 |
| HU-15 Roles del equipo | RF-LAB-04 |
| HU-16 Labels del equipo | RF-LAB-01, RF-LAB-02, RF-LAB-03 |
| HU-17 Encuesta de habilidades | RF-LAB-05, RF-LAB-06, RF-LAB-09 |
| HU-18 Asignar con información | RF-LAB-07, RF-LAB-09 |
| HU-19 Advertencia | RF-LAB-08 |
| HU-20 Campana | RF-NOT-01, RF-NOT-02 |
| HU-21 Preferencias por evento | RF-NOT-03, RF-NOT-04 |
| HU-22 Silenciar canal | RF-NOT-05 |
| HU-23 Correo | RF-NOT-06 |
| HU-24 Encuesta en canal | RF-VOT-01, RF-VOT-02, RF-VOT-03 |
| HU-25 Anónima | RF-VOT-04 |
| HU-26 Cerrar | RF-VOT-05 |
| HU-27 Resultado → tarea | RF-VOT-06 |
| HU-28 Votar responsable | RF-VOT-07 |
| HU-29 Dividir tarea | RF-ARB-01, RF-ARB-02, RF-ARB-03 |
| HU-30 Conexión visible | RF-ARB-04, RF-ARB-05, RF-ARB-06 |
| HU-31 Padre no se cierra | RF-ARB-07, RF-ARB-08 |
| HU-32 Vista de esquema | RF-ARB-09, RF-ARB-15 |
| HU-33 Reorganizar el árbol | RF-ARB-10, RF-ARB-11 |
| HU-34 Editar y eliminar tarjeta | RF-KAN-06, RF-KAN-07, RF-ARB-12 |
| HU-35 Color de rama | RF-ARB-13, RF-ARB-14, RF-ARB-15 |

### 5.2 Requerimientos funcionales sin historia

Aparecieron al analizar el modelo de dominio y las historias existentes. Hay que crear sus historias en la versión 0.3 del documento de historias.

| Requerimiento | Por qué existe | Historia propuesta |
|---|---|---|
| RF-CUE-12 Transferencia de administración | RN-03 exige que siempre haya un admin | HU-36 |
| RF-CUE-13 Salir de un equipo | Nadie puede quedar atrapado en un equipo | HU-37 |
| RF-CHA-06 Cargar mensajes anteriores | RF-CHA-05 muestra 50; sin esto los anteriores serían inaccesibles | HU-38 |

Los RNF, las restricciones y las reglas de negocio no se trazan a historias: se cumplen de forma transversal y se verifican por su propio método.

---

## 6. Preguntas abiertas

- Confirmar con el profesor si, además de este SRS y las historias, exige casos de uso UML.
- Definir el valor exacto del límite de sesión (`RNF-SEG-04`, propuesto 7 días).
- Decidir si "importancia" será un label o un campo numérico de prioridad (afecta `RF-KAN-03` y `RF-KAN-08`).
