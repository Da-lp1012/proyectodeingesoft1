# Slackless — Contratos JSON de RF-ARB-07 (T3.1)

## 0. Metadatos

|                         |                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------|
| **Ticket**              | T3.1 — Definir y publicar contratos JSON para endpoints de RF-ARB-07. *Identificador de Jira: pendiente de confirmar* |
| **Autor**               | Hare Zeiyiukuin Atehortua Rincon, Deisy Viviana Lara Sisa |
| **Consulta y revisión** | Deisy Viviana Lara Sisa                                                            |
| **Aprobación**          | *Pendiente (P10).* El ticket pide la aprobación de Deisy, David y Fredy; la tabla de revisores menciona solo a Deisy |
| **Estado**              | Borrador                                                                           |
| **Fecha**               | 28/11/26                                                            |
| **Ubicación** | `docs/design/03_Contratos_JSON_RF-ARB-07.md` *(P11)*                              |
| **Código de referencia**| Rama `main` en `ef2053b`. Modelo de dominio de T2.1 en `feat/SLAC-5-t2.1-completion-rule` (`b67efe0`) y `feat/SLAC-3-t2.1-card-move-service` (`f7c92dc`), sin fusionar. Las rutas de archivo usan la raíz `src/` actual; el renombrado a `app/` está pendiente de confirmación |



---

## 1. Alcance

**Incluye:**

- Consulta del árbol de tarjetas de un equipo (Sección 6) **[Ticket]**.
- Movimiento de una tarjeta a otra columna (Sección 7). Cerrar una tarjeta es moverla a `DONE`; no existe una operación de cierre separada (RF-ARB-07 §4.3, D1 §3.4, D2 §3.1).
- Códigos HTTP, formato de errores y ejemplos de las dos operaciones **[Ticket]**.

**No incluye:**

| Tema | Motivo |
|---|---|
| Evento en tiempo real "tarjeta movida" | Es un aviso que envía el servidor, no una petición ni una respuesta **[Propuesta P9]**. Si se aprueba la exclusión, quedan sin cubrir en este contrato el paso 5 del flujo principal de RF-ARB-07 §4.3 ("muestra el cambio a los demás miembros") y la postcondición de D2 §3.1 sobre el evento |
| Mecanismo de sesión y autenticación | Es una capacidad del Módulo Users (D2 A-2) y está pendiente de OQ-1. Este documento solo propone cómo responde la API cuando no hay sesión **[Propuesta P8]** |
| Crear, editar o eliminar tarjetas, y cambiar su padre | No forman parte de RF-ARB-07 ni del ticket T3.1 |
| Política para un padre en `DONE` con subtareas pendientes | Es OQ-3 de D2. Este documento describe cuándo ocurre (Sección 5.5) pero no lo resuelve |
| Indicador de progreso (RF-ARB-05), colores (RF-ARB-13), responsable y fecha límite | No los pide RF-ARB-07 ni el ticket T3.1 |

---

## 2. Fuentes y trazabilidad

### 2.1 Fuentes

| Fuente | Tipo |
|---|---|
| `docs/design/01_Architectural_and_Detailed_Design.md` (D1) | Diseño |
| `docs/design/02_Interaction_and_Data_Design.md` (D2) | Diseño |
| `docs/diagramas/02-modelo-entidad-relacion.mmd` (modelo entidad-relación) | Diseño |
| `docs/requerimientos/RF-ARB-07.md` | Requisito |
| `docs/adr/0003_Validacion_Cierre_En_Servidor.md` (Aprobado) | Decisión de arquitectura |
| Ticket T3.1 y tickets relacionados (T1.1, T2.1, T3.2, T4.1, T5.1) | Planificación, no versionada en el repositorio |
| `src/backend/src/common/app_exception_filter.ts`, `src/backend/src/common/validation_error.ts` | Código |
| `src/backend/src/modules/items/item_controller.ts`, `src/backend/src/modules/health/health_controller.ts` | Código |
| `src/frontend/vite.config.ts`, `src/frontend/src/api.ts` | Código |
| `src/backend/src/modules/dashboard/card_model.ts` (ramas de T2.1, sin fusionar) | Código |

### 2.2 Trazabilidad de las reglas

| Regla del contrato | Fuente | Tipo |
|---|---|---|
| Parámetros de la operación de movimiento | D2 §3.1 (Input); D1 §3.2 | Diseño |
| `userId` se toma de la sesión y se descarta si viene del cliente | D2 A-2; D2 §3.1 (Input) | Diseño |
| La sesión ya está verificada cuando una operación llega al servidor | D2 A-2 | Diseño |
| `teamId` se envía en cada solicitud y toda consulta filtra por equipo | D2 §1, decisión de interacción; D2 §3.4 | Diseño |
| `teamId` va **en la ruta** | — | **[Propuesta P2]** |
| Valores de columna y su correspondencia con la base | D2 §3, convenciones; D1 §3.2 (`Column`); modelo entidad-relación (`Tarjeta.columna`) | Diseño |
| Identificadores como cadenas, `uuid` en la base | D2 A-6 | Diseño |
| Respuesta con `outcome` y `pendingCount`; `pendingCount` es 0 si `MOVED` y 1 o más si `BLOCKED` | D2 §3.1 (Output); D2 §3.2 (Output) | Diseño |
| `pendingCount` cuenta las subtareas directas fuera de *Hecho* cuando el resultado es `BLOCKED` | D2 §3.1 (postcondiciones); D2 §3.2 (postcondiciones) | Diseño |
| Si el destino no es `DONE`, no se leen las subtareas | D2 §3.2 (invariantes) | Diseño |
| `BoardController` arma la respuesta a partir de `MoveResult` | D1 §3.2, nota bajo el diagrama; D1 §3.3, fila `BoardController`; D2 §3.1 (Output) | Diseño |
| Fallos `INVALID_INPUT`, `ACCESS_DENIED`, `CARD_NOT_FOUND`; no son un `MoveResult` | D2 §3, convenciones; D2 §3.1 (fallos); D1 §3.2 | Diseño |
| Orden de evaluación: entrada, membresía, tarjeta | D1 §3.4; D2 §3.1 (ejemplos) | Diseño |
| Tarjeta de otro equipo = `CARD_NOT_FOUND` | D2 §3.1; D2 §3.4 | Diseño |
| Equipo inexistente = `ACCESS_DENIED` | D2 §3.3 | Diseño |
| Un movimiento solo cambia la columna y la posición de la tarjeta movida | D2 §3.1, invariante I-2 | Diseño |
| Definición de subtarea pendiente: directa y en *Por hacer* o *En progreso* | RF-ARB-07 §2 | Requisito |
| RN-12 solo se aplica al mover a `DONE` | D2 §3.2; D2 §3.1 (ejemplo "Destino distinto de *Hecho*") | Diseño |
| Si RN-12 rechaza, no se modifica ningún dato | ADR 0003; AC-ARB-07.4; D2 §3.1 (postcondiciones) | ADR, requisito y diseño |
| El conteo de pendientes se calcula y no se guarda | D2 §2.1; D2 §2.4 | Diseño |
| El texto que ve el usuario lo arma la interfaz | D1 §3.3 (`MoveResult`); RNF-USA-04; ticket T5.1 | Diseño y ticket |
| Campos de la tarjeta disponibles | Modelo entidad-relación (`Tarjeta`); D2 §2.2 | Diseño |
| `CARD_NOT_FOUND` responde HTTP 404 | Ticket T3.1, criterio de aceptación | **[Ticket]** |
| Documento en `docs/` con ejemplos de 200, 400/422 y 404 | Ticket T3.1, criterio de aceptación | **[Ticket]** |
| Prefijo `/api` | `vite.config.ts` (el proxy solo reenvía `/api`); `item_controller.ts` (`@Controller('api/items')`) | **[Código]** |
| Cuerpos de error que produce hoy el servidor | `app_exception_filter.ts` | **[Código]** |

---

## 3. Convenciones generales

| Aspecto | Regla | Respaldo |
|---|---|---|
| Prefijo de rutas | Las rutas de este contrato empiezan por `/api`. No es una regla de diseño: es la convención del código actual y una restricción técnica, porque el proxy de Vite solo reenvía al backend las rutas `/api`. El skeleton no la aplica a todas sus rutas: `health/db` no la lleva | **[Código]** |
| Formato | Peticiones y respuestas en JSON (`Content-Type: application/json`) | **[Código]** (`api.ts`) |
| Nombres de propiedades | `camelCase` | **[Código]** (`item_model.ts`: `createdAt`) |
| Identificadores | Cadenas. Se entiende por "mal formado" un valor que no es un UUID: es la lectura de D2 A-6, que los define como `uuid` en la base. Un identificador ausente o mal formado produce `INVALID_INPUT` (D2 §3.1, fallos) | Diseño, con la interpretación indicada |
| Fechas | ISO 8601, si alguna respuesta las incluye. Ninguna respuesta de este contrato las incluye | **[Código]** (`item_model.ts`) |
| Identidad del solicitante | La obtiene el servidor a partir de la sesión. Ninguna petición incluye `userId`; si un cliente lo envía, el servidor lo ignora | D2 A-2; D2 §3.1 |
| Equipo | Cada operación recibe `teamId`, y toda lectura y escritura filtra por él | D2 §1 |
| Ubicación de `teamId` y `cardId` | En la ruta | **[Propuesta P2]** |
| Columnas | Solo los valores de la Sección 5. La traducción a los valores de la base (`por_hacer`, `en_progreso`, `hecho`) es interna del servidor y no aparece en el contrato | D2 §3, convenciones |

---

## 4. Tipos

Los tipos describen el JSON que viaja entre el cliente y el servidor. No son clases del código: el modelo interno (`Card`, `MoveResult`) es el de D1 §3.2. Su correspondencia con este JSON se documenta en la Sección 10.

### 4.1 `Column`

Cadena con uno de estos tres valores: `"TO_DO"`, `"IN_PROGRESS"`, `"DONE"` (D1 §3.2; D2 §3). Coinciden con los valores del enum `Column` en `card_model.ts` **[Código]**.

### 4.2 `CardNode` — una tarjeta en la respuesta del árbol

| Propiedad | Tipo | Obligatoria | Significado | Origen |
|---|---|---|---|---|
| `id` | string | Sí | Identificador de la tarjeta | `Tarjeta.id` |
| `parentId` | string o `null` | Sí | Tarjeta padre; `null` si es raíz | `Tarjeta.padre_id`, "nulo si es tarea raiz" |
| `title` | string | Sí **[Por confirmar]** | Título de la tarjeta | `Tarjeta.titulo` |
| `column` | `Column` | Sí | Columna actual | `Tarjeta.columna` |
| `position` | integer | Sí | Posición dentro de su columna. El cliente la necesita para armar una petición de movimiento válida (Sección 4.3) | `Tarjeta.posicion`; D2 §3.1 |
| `pendingCount` | integer ≥ 0 | Sí | Subtareas directas de esta tarjeta que no están en `DONE` en el momento de la lectura. Se calcula en el servidor y se informa con su valor real **también cuando la tarjeta está en `DONE`** (Sección 5.5) **[Propuesta P4]** | Calculado (D2 §2.1) |

*`teamId` no se incluye en cada nodo porque identifica al equipo de toda la consulta.*

*`title` obligatorio **[Por confirmar]**: el modelo entidad-relación no declara si `titulo` puede ser nulo. D2 §2.2 marca explícitamente los campos opcionales de `Tarjeta` (`padre_id`, `color`, responsable) y no marca `titulo`, y OQ-7 menciona un límite de longitud para el título. Debe confirmarlo quien defina la tabla (T1.1).*

*`pendingCount` del árbol es **informativo**: describe el estado en el momento de la lectura. La decisión de RN-12 la toma el servidor cuando recibe el movimiento (ADR 0003), y el valor puede haber cambiado entre la lectura y el intento de cierre.*

*Este `pendingCount` **no tiene el mismo significado** que el `pendingCount` de la respuesta de movimiento (Sección 4.4). Si el nombre de este campo debe coincidir o distinguirse se decide junto con **[Propuesta P4]**.*

*La forma de la respuesta del árbol (lista de nodos, orden y garantías sobre `parentId`) se define en la Sección 6 **[Propuesta P3]**.*

### 4.3 `MoveCardRequest` — cuerpo de la petición de movimiento

| Propiedad | Tipo | Obligatoria | Regla |
|---|---|---|---|
| `targetColumn` | `Column` | Sí | Uno de los valores de la Sección 4.1. Cerrar una tarjeta es enviar `"DONE"` |
| `position` | integer | Sí | Obligatoria porque la operación la exige (D2 §3.1, Input; D1 §3.2). Qué valores son válidos y cómo se reacomodan las demás tarjetas **[Pendiente OQ-5]**. Mínimo de 1 **[Propuesta P6]**: es una inferencia, porque los ejemplos de D2 §3.1 usan `position = 1`, y no está respaldada por ninguna regla |

*La petición no incluye `userId` (sale de la sesión, D2 A-2) ni `teamId` (va en la ruta **[Propuesta P2]**). Este contrato no define otras propiedades.*

*Mientras OQ-5 siga abierta, la validación de `position` dentro de `INVALID_INPUT` no puede especificarse por completo, y el cliente no tiene una regla para elegir la posición al cerrar una tarjeta.*

### 4.4 `MoveCardResponse` — resultado de un movimiento procesado

| Propiedad | Tipo | Valores | Regla |
|---|---|---|---|
| `outcome` | string | `"MOVED"` o `"BLOCKED"` | `MOVED`: la tarjeta quedó en `targetColumn` y `position`. `BLOCKED`: RN-12 impidió moverla a `DONE` y no se modificó ningún dato |
| `pendingCount` | integer | `0` si `MOVED`; `1` o más si `BLOCKED` (D2 §3.1, Output; D2 §3.2, Output) | Solo con `BLOCKED` es un conteo: el número de subtareas directas fuera de `DONE` cuando se evaluó RN-12 (D2 §3.1, postcondiciones). Con `MOVED` es un valor fijo que **no describe las subtareas de la tarjeta** |

**Qué significa `pendingCount` en cada caso:**

| Caso | `outcome` | `pendingCount` | Qué se sabe | Respaldo |
|---|---|---|---|---|
| Destino `DONE`, sin subtareas pendientes | `MOVED` | 0 | En el momento de evaluar, la tarjeta no tenía subtareas directas fuera de `DONE` | D2 §3.1, postcondiciones de `MOVED` |
| Destino `DONE`, con subtareas pendientes | `BLOCKED` | n ≥ 1 | n subtareas directas fuera de `DONE` en el momento de evaluar | D2 §3.1, postcondiciones de `BLOCKED` |
| Destino `TO_DO` o `IN_PROGRESS` | `MOVED` | 0 | **Nada sobre las subtareas.** El servidor no las lee (D2 §3.2) y la tarjeta puede seguir teniendo subtareas pendientes | D2 §3.2, invariantes |

*En consecuencia, el cliente **no debe usar** el `pendingCount` de esta respuesta para actualizar el `pendingCount` del árbol (Sección 4.2). D2 no define ningún otro significado para el valor 0 cuando el destino no es `DONE`, y este contrato no le añade uno.*

*Que `BLOCKED` se responda con HTTP 200 y este cuerpo es **[Propuesta P1]**. Si se aprueba la alternativa (409 o 422), `BLOCKED` pasaría al catálogo de errores y `outcome` solo podría valer `MOVED`.*

*Correspondencia con el diseño: este JSON **no** es la clase `MoveResult` serializada. Según D1 §3.2 (nota bajo el diagrama) y D1 §3.3 (fila `BoardController`), `BoardController` recibe el `MoveResult` y con él arma esta respuesta: `outcome` es `MOVED` si `isMoved()` y `BLOCKED` si no; `pendingCount` es `getPendingCount()`. `MoveResult.success()` fija `pendingCount` en 0 (D2 §3.2; `card_model.ts` **[Código]**). Devolver el objeto `MoveResult` sin convertirlo produciría `{ "moved": ..., "pendingCount": ... }`, porque las propiedades de constructor de TypeScript se convierten en propiedades del objeto **[Esperado]**. El detalle está en la Sección 10.*

### 4.5 `ErrorResponse` — cuerpo de los errores de negocio

| Propiedad | Tipo | Significado |
|---|---|---|
| `code` | `ErrorCode` | Identifica el fallo para que el cliente decida cómo actuar |
| `error` | string | Descripción técnica, para registro y depuración |

*Formato **[Propuesta P5]**.*

> **Diferencia con el walking skeleton.** En `src/frontend/src/api.ts`, la propiedad `error` se muestra directamente al usuario (comentario: "La API manda `{ error }` en los 400; se muestra tal cual al usuario") **[Código]**. En este contrato, `error` es una descripción **técnica** y **no** debe mostrarse al usuario. El texto visible lo redacta la interfaz a partir de `code` (RNF-USA-04; ticket T5.1). Se conserva el nombre `error` porque coincide con los cuerpos que ya produce el filtro global.

**Qué produce hoy el servidor.** El filtro global, `app_exception_filter.ts` **[Código]**, **no garantiza** el formato `{ code, error }`:

| Lo que llega al filtro | Respuesta actual |
|---|---|
| `ValidationError` | 400 con `{ "error": "<mensaje>" }`, **sin `code`** |
| `HttpException` | Su propio código HTTP y su cuerpo **sin cambios**. Si el cuerpo es una cadena, lo envuelve como `{ "error": "<cadena>" }` |
| Cualquier otro error | 500 con `{ "error": "Error interno del servidor" }`. El detalle solo va al registro del servidor |

*Por tanto, un cuerpo `{ code, error }` llega intacto al cliente solo si se produce como una `HttpException` con ese cuerpo. Un error que no sea `HttpException` ni `ValidationError` llega como 500. Este documento no asigna quién implementa esas traducciones.*

**Respuestas de error que no traen `code`.** Además de lo anterior, el cliente puede recibir errores que no siguen el formato `ErrorResponse`:

| Caso | Respuesta | Tipo |
|---|---|---|
| Error interno | 500 con `{ "error": "Error interno del servidor" }` | **[Código]** |
| Ruta inexistente | 404 con el cuerpo por defecto de NestJS, que el filtro deja pasar: `{ "message": "Cannot <MÉTODO> <ruta>", "error": "Not Found", "statusCode": 404 }` | **[Esperado]** |
| La API no responde y el proxy de Vite devuelve el error | Respuesta sin cuerpo JSON. `api.ts` ya lo contempla ("el proxy devuelve un error sin ese formato") | La existencia del caso: **[Código]**. El código HTTP exacto: **[Esperado]** |
| JSON mal formado en el cuerpo de la petición | 400 producido antes de llegar al controlador; no se ha verificado su cuerpo | **[Esperado]** |

*Cómo debe interpretar el cliente cada caso, con o sin `code`, se define en la Sección 8.*

### 4.6 `ErrorCode`

| Valor | HTTP | Respaldo |
|---|---|---|
| `INVALID_INPUT` | 400 | El fallo: D2 §3.1. El código HTTP: convención del código actual (`ValidationError` → 400) **[Código]**; ninguna fuente de diseño lo fija **[Propuesta P13]** |
| `UNAUTHENTICATED` | 401 | **[Propuesta P8]**. Ver la nota siguiente |
| `ACCESS_DENIED` | 403 | El fallo: D2 §3.1. El código HTTP no lo fija ninguna fuente **[Propuesta P13]** |
| `CARD_NOT_FOUND` | 404 | El fallo: D2 §3.1. El código HTTP: ticket T3.1 **[Ticket]** |

*Sobre `UNAUTHENTICATED`: no es un fallo de las operaciones de D2. D2 A-2 supone que, cuando una operación llega al servidor, la sesión ya fue verificada y se conoce el `userId`, y deja esa verificación como capacidad del Módulo Users. La ausencia de sesión ocurre **antes** de la operación y **no equivale** al ejemplo "`userId` ausente → `INVALID_INPUT`" de D2 §3.1, que describe un parámetro interno de `requestMoveCard`, no una petición del cliente. Este contrato propone responderla con 401 y `UNAUTHENTICATED`, pero su comportamiento real depende de cómo se defina el mecanismo de sesión **[Pendiente OQ-1]**.*

*El detalle de cada fallo (cuándo ocurre, orden de evaluación y estado en que deja los datos) se documenta en la Sección 8.*

---

## 5. Estados y representación de las tarjetas

### 5.1 Columnas

| Valor | Significado | Valor en la base (interno) |
|---|---|---|
| `TO_DO` | Por hacer | `por_hacer` |
| `IN_PROGRESS` | En progreso | `en_progreso` |
| `DONE` | Hecho; la única columna que significa "terminado" (RF-KAN-01) | `hecho` |

No existe ninguna otra columna ni estado guardado (D1 §3.2; D2 §2.2). `BLOCKED` no es una columna: es uno de los dos resultados posibles de un movimiento (Sección 4.4). El conteo de subtareas pendientes no se guarda (D2 §2.1) y RN-12 se aplica en la lógica del módulo, no como una restricción de columna (D2 §2.4).

### 5.2 Subtareas pendientes

Una subtarea pendiente es una subtarea **directa** cuya columna es `TO_DO` o `IN_PROGRESS` (RF-ARB-07 §2). Las subtareas de niveles inferiores no cuentan (D2 §3.5: "sin nietas").

### 5.3 Cuándo se aplica RN-12

RN-12 solo se evalúa cuando `targetColumn` es `DONE` (D2 §3.2). En consecuencia:

- Una tarjeta con subtareas pendientes **puede moverse** a `TO_DO` o a `IN_PROGRESS`. El resultado es `MOVED`, el servidor no lee sus subtareas y la respuesta trae `pendingCount = 0`, aunque las subtareas pendientes siguen existiendo (D2 §3.2; D2 §3.1, ejemplo "Destino distinto de *Hecho*"; Sección 4.4).
- Qué ocurre al mover una tarjeta a la columna en la que ya está **[Pendiente OQ-2]**.
- Cuando el destino es `DONE`, el servidor cuenta las subtareas pendientes en ese momento. Si hay al menos una, responde `BLOCKED` y no modifica nada (ADR 0003; AC-ARB-07.4).
- Que la última subtarea pase a `DONE` no mueve al padre (RN-13; D2 §3.1).

### 5.4 Categorías ABIERTO, BLOQUEADO y CERRADO **[Interpretación]**

Los tickets T1.1 y T4.1 hablan de los estados "abierto", "bloqueado (por hijos)" y "cerrado". Ninguna fuente de diseño los define. Este contrato propone interpretarlos así:

| Categoría | Condición |
|---|---|
| CERRADO | `column = "DONE"` |
| BLOQUEADO | `column ≠ "DONE"` y `pendingCount > 0` |
| ABIERTO | `column ≠ "DONE"` y `pendingCount = 0` |

- **Son excluyentes:** cada tarjeta pertenece a exactamente una categoría.
- **No son estados guardados ni valores de `column`.** Se calculan a partir de `column` y del `pendingCount` del árbol (Sección 4.2).
- **BLOQUEADO significa "no se puede cerrar ahora", no "no se puede mover":** la tarjeta puede ir a `TO_DO` o `IN_PROGRESS` (Sección 5.3).
- **Son informativas:** quien decide si un cierre se permite es el servidor al recibir el movimiento (ADR 0003).
- **Contradicción con el ticket T1.1:** pide una "columna de estado (abierto, bloqueado, cerrado)" en la base. Eso contradice D2 §2.1 y §2.4. Este contrato no guarda "bloqueado".

**Límites de esta clasificación:**

- **Solo se puede calcular si el árbol trae `pendingCount` [Propuesta P4].** Sin ese campo, el contrato solo permite distinguir CERRADO de no cerrado.
- **Solo es válida para la última lectura del árbol.** Un movimiento puede cambiar el `pendingCount` de otra tarjeta (el padre de la tarjeta movida, si esta entra o sale de `DONE`), y la respuesta de movimiento no informa ese cambio (Sección 4.4). Lo que sí se mantiene: un movimiento no cambia las subtareas de la tarjeta movida, porque solo modifica su columna y su posición (D2 §3.1, invariante I-2).
- Cómo y cuándo obtiene el cliente un árbol actualizado no lo define esta sección.

**Ejemplo.** La tarjeta P tiene dos subtareas directas, S1 y S2. La columna "`pendingCount` de P" es el valor que devolvería una lectura del árbol después de cada paso.

| Paso | Situación o acción | `pendingCount` de P (árbol) | Categoría de P | Respuesta del movimiento |
|---|---|---|---|---|
| 1 | P en `IN_PROGRESS`; S1 en `DONE`; S2 en `TO_DO` | 1 | BLOQUEADO | — |
| 2 | Mover P a `DONE` | 1 | BLOQUEADO | `BLOCKED`, `pendingCount: 1`; nada cambia (AC-ARB-07.1) |
| 3 | Mover P a `TO_DO` | 1 | BLOQUEADO | `MOVED`, `pendingCount: 0`; RN-12 no se aplica y el 0 no describe las subtareas de P |
| 4 | Mover S2 a `DONE` | 0 | ABIERTO | `MOVED`, `pendingCount: 0` (respuesta sobre S2). P sigue en `TO_DO` (RN-13); su nuevo valor solo se conoce con otra lectura del árbol |
| 5 | Mover P a `DONE` | 0 | CERRADO | `MOVED`, `pendingCount: 0` (AC-ARB-07.2) |
| 6 | Mover S1 a `IN_PROGRESS` | 1 | CERRADO | `MOVED`, `pendingCount: 0` (respuesta sobre S1); ver Sección 5.5 |

*Subtareas de niveles inferiores: si P tiene a S1 en `DONE` y S1 tiene una hija en `TO_DO`, el `pendingCount` de P es 0 y P está ABIERTO, porque solo cuentan las subtareas directas.*

### 5.5 Padre en `DONE` con una subtarea pendiente **[Pendiente OQ-3]**

El paso 6 del ejemplo muestra que el endpoint de movimiento de este contrato permite llegar a esta situación. Mover una subtarea fuera de `DONE` es válido, porque RN-12 no se aplica cuando el destino no es `DONE` (D2 §3.2), y el padre sigue en `DONE`. D2 OQ-3 y las Open Questions 1 y 2 de RF-ARB-07 registran el caso ("ve reabrir una") sin una decisión.

Este contrato **solo** establece cómo se representa:

- La tarjeta padre sigue en la categoría CERRADO, porque la decide `column`.
- En la siguiente lectura del árbol, su `pendingCount` se informa con el valor real, por ejemplo `1` **[Propuesta P4]**.

Este contrato **no** define ninguna política para resolver la inconsistencia: ni impedir la reapertura, ni mover al padre, ni marcarlo de otra forma. Esa decisión corresponde a OQ-3.
