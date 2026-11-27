# ADR 0006: Convención de nombres de ramas de Git

* **Estado:** Propuesto
* **Fecha:** 2026-11-25
* **Autores:** David Esteban Raigosa Socha  
&emsp; &emsp; &ensp; &nbsp; Deisy Viviana Lara Sisa  
&emsp; &emsp; &ensp; &nbsp; Hare Zeiyiukuin Atehortua Rincon  
&emsp; &emsp; &ensp; &nbsp; Fredy Humberto Garzon Salgado  
&emsp; &emsp; &ensp; &nbsp; Silvana Ramìrez Ardila

## Contexto

El equipo trabaja con un flujo de ramas cortas sobre `main` (trunk-based development): ramas de pocos días de vida que se integran pronto mediante Pull Request. Las tareas se gestionan en Jira con identificadores del tipo `SLAC-<n>`, y cada tarea de desarrollo se subdivide en subtareas `T<frente>.<orden>` (por ejemplo `T2.1`).

Hasta ahora las ramas no seguían una forma única: coexisten nombres como `SLAC-1-Delivery-2` (sin prefijo, con mayúsculas) y `feat/SLAC-3-T1.1-tablas-sql-y-git` (con prefijo). La revisión del proyecto exige que las ramas estén coordinadas en el nombre, por lo que el equipo necesita una convención escrita y uniforme antes de crear las ramas de implementación.

## Decisión

Las ramas de trabajo se nombran con el patrón:

```
<tipo>/SLAC-<n>-<descripcion-en-kebab-case>
```

| Parte | Regla | Ejemplo |
|---|---|---|
| `<tipo>` | Prefijo en minúscula según el propósito | `feat`, `fix`, `docs`, `chore`, `refactor`, `test` |
| `SLAC-<n>` | Identificador de la tarea en Jira, en mayúscula | `SLAC-3` |
| `<descripcion>` | Resumen corto en `kebab-case` (minúsculas y guiones), en lo posible incluyendo la subtarea `T<frente>.<orden>` | `t2.1-card-move-service` |

Reglas complementarias:

* Un separador `/` entre el tipo y el resto; el resto usa solo guiones.
* Todo en minúscula salvo el identificador de Jira (`SLAC-<n>`).
* Una rama por tarea o subtarea; vida corta (pocos días) y se borra tras el merge.
* La rama base de integración es `main`; no se usa `develop`.
* Ejemplos válidos: `feat/SLAC-3-estructura-codigo-src`, `feat/SLAC-6-t2.1-card-move-service`, `docs/SLAC-4-adr-estructura`, `fix/SLAC-9-t5.2-integracion-e2e`.

Las ramas creadas antes de este ADR (`SLAC-1-Delivery-2`, `feat/SLAC-3-T1.1-tablas-sql-y-git`) **no se renombran**, para no romper el historial ni los PR existentes; la convención aplica a las ramas nuevas.

## Alternativas consideradas

* **No definir convención (seguir como hasta ahora):** se descartó porque la revisión del proyecto exige nombres coordinados y las ramas actuales son inconsistentes.
* **Usar solo `SLAC-<n>` sin prefijo de tipo:** se descartó porque el prefijo (`feat`, `fix`, `docs`…) comunica de un vistazo el propósito de la rama y agrupa las ramas en las herramientas de Git.
* **GitFlow con ramas `develop`, `release` y `hotfix`:** se descartó por ser demasiado pesado para un proyecto de curso con ramas de pocos días; contradice el enfoque trunk-based.

## Consecuencias

* **Positivas:**
  * Las ramas quedan coordinadas y legibles, como exige la revisión.
  * El nombre enlaza cada rama con su tarea de Jira (`SLAC-<n>`) y su subtarea (`T<frente>.<orden>`).
  * El prefijo de tipo facilita filtrar y agrupar ramas.

* **Negativas / Riesgos:**
  * Conviven dos estilos hasta que las ramas antiguas se cierren por merge; se asume de forma transitoria.
  * El equipo debe recordar escribir `SLAC` en mayúscula y el resto en minúscula; un nombre mal escrito obliga a recrear la rama.

## Referencias

* ADR 0004: Convención de nomenclatura para la implementación (`docs/adr/0004_Convencion_Nomenclatura_Implementacion.md`)
* Restricción de proceso trunk-based del SRS (`docs/requerimientos/srs/`)
