# ADR 0004: Convención de nomenclatura para la implementación

* **Estado:** Propuesto
* **Fecha:** 2026-11-11
* **Autores:** David Esteban Raigosa Socha  
&emsp; &emsp; &ensp; &nbsp; Deisy Viviana Lara Sisa  
&emsp; &emsp; &ensp; &nbsp; Hare Zeiyiukuin Atehortua Rincon  
&emsp; &emsp; &ensp; &nbsp; Fredy Humberto Garzon Salgado  
&emsp; &emsp; &ensp; &nbsp; Silvana Ramìrez Ardila

## Contexto

El ADR 0001 eligió TypeScript para el frontend con React y para el backend con NestJS. Antes de implementar el diseño del requerimiento `RF-ARB-07`, el equipo necesita acordar una convención para nombrar carpetas, archivos y elementos del código.

La convención debe ser fácil de aplicar en los componentes del módulo Dashboard, como `CardMoveService`, `CompletionRule` y `CardRepository`, y mantener consistencia entre el backend y el frontend.

## Decisión

Se usarán las siguientes convenciones:

| Elemento | Convención | Ejemplo |
|---|---|---|
| Carpetas | `snake_case` | `card_management/`, `completion_rule/` |
| Archivos de código | `snake_case` | `card_move_service.ts`, `completion_rule.ts` |
| Clases y componentes de React | `PascalCase` | `CardMoveService`, `CompletionRule`, `TaskCard` |
| Métodos y funciones | `camelCase` | `moveCard()`, `countPending()` |
| Variables, propiedades y parámetros | `camelCase` | `targetColumn`, `pendingCount`, `cardId` |
| Variables globales y constantes | `camelCase` | `defaultColumn`, `maxPendingSubtasks` |

Los nombres deben conservar las mismas mayúsculas y minúsculas en su declaración, exportación, importación y uso. Por ejemplo, una clase exportada como `CardMoveService` debe importarse y utilizarse con ese mismo nombre.

## Justificación

La convención diferencia las clases de las operaciones y los datos: `CardMoveService` representa una clase, `moveCard()` una operación y `pendingCount` un valor. Esto facilita leer el código y reduce errores al escribir o importar identificadores.

El uso de `snake_case` para carpetas y archivos mantiene una forma uniforme de organizar el código. Aunque NestJS suele generar archivos con nombres separados por guiones, como `cats.controller.ts`, los nombres con guion bajo son compatibles siempre que las rutas de importación coincidan exactamente con los nombres reales de los archivos.

## Alternativas consideradas

* **Usar `PascalCase` para clases, métodos, variables y constantes:** se descartó porque JavaScript y TypeScript distinguen mayúsculas de minúsculas. Usar PascalCase para todos los identificadores podría aumentar los errores al escribir nombres y dificultar distinguir clases de métodos y valores.
* **Usar `camelCase` en carpetas y archivos:** se descartó para mantener la convención de organización elegida por el equipo.
* **Usar `UPPER_SNAKE_CASE` para constantes:** se descartó para mantener las variables globales y las constantes bajo una sola convención `camelCase`.

## Consecuencias

* **Positivas:**
  * Las carpetas y los archivos siguen una convención uniforme.
  * Las clases se distinguen visualmente de los métodos y las variables.
  * La convención se puede aplicar tanto al diseño de `RF-ARB-07` como a los nuevos módulos.
  * No se requiere cambiar el stack definido en el ADR 0001.

* **Negativas / Riesgos:**
  * El equipo debe escribir las rutas de importación con las mismas mayúsculas, minúsculas y guiones bajos que los archivos reales.
  * Los nombres de archivos difieren del formato que suele generar NestJS; el equipo tendrá que conservar la convención al crear nuevos archivos.
  * Algunas librerías usan nombres propios con otras convenciones. Los nombres importados desde librerías externas deben respetarse tal como se exportan.

## Referencias

* ADR 0001: Elección de Stack tecnológico (`docs/adr/0001_Eleccion_Stack.md`)
* Diseño detallado de RF-ARB-07 (`docs/design/01_Architectural_and_Detailed_Design.md`)
