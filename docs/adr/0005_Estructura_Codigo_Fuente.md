# ADR 0005: Ubicación y estructura del código fuente

* **Estado:** Propuesto
* **Fecha:** 2026-11-25
* **Autores:** David Esteban Raigosa Socha  
&emsp; &emsp; &ensp; &nbsp; Deisy Viviana Lara Sisa  
&emsp; &emsp; &ensp; &nbsp; Hare Zeiyiukuin Atehortua Rincon  
&emsp; &emsp; &ensp; &nbsp; Fredy Humberto Garzon Salgado  
&emsp; &emsp; &ensp; &nbsp; Silvana Ramìrez Ardila

## Contexto

El walking skeleton validado (backend NestJS, frontend React + Vite, Docker Compose, con los `package-lock.json` generados) está versionado en `docs/walking-skeleton/`. Esa carpeta cumplió su propósito como artefacto de la entrega de diseño: mostrar el esqueleto que atraviesa las tres capas.

Al iniciar la implementación de `RF-ARB-07` y los demás módulos, el equipo necesita un lugar para el **código vivo** de la aplicación. Dejar ese código dentro de `docs/` mezcla documentación con código ejecutable: `docs/` se revisa como entregable escrito, y tener ahí `Dockerfile`, `package.json` y módulos de NestJS confunde esa separación. Antes de que los cinco integrantes empiecen a crear archivos, hace falta acordar dónde vive el código para que nadie trabaje en una ruta distinta ni haya que reorganizar a mitad del sprint.

## Decisión

El código fuente de la aplicación vive bajo una carpeta `src/` en la raíz del repositorio, con esta estructura:

```
proyectodeingesoft1/
├── src/
│   ├── backend/                 # API NestJS (Node 22 + TypeScript)
│   ├── frontend/                # Aplicación web React + Vite + TypeScript
│   ├── docker-compose.yml       # api + web contra la base del equipo
│   ├── docker-compose.local-db.yml
│   ├── .env.example / .env.local.example
│   └── README.md
├── docs/                        # Solo documentación (diseño, ADR, diagramas, requerimientos)
│   └── walking-skeleton/        # Artefacto de referencia de la entrega de diseño (se conserva)
└── README_LICENSE.md
```

El contenido de `src/` se inicializó **copiando** el walking skeleton desde `docs/walking-skeleton/`. Los `Dockerfile` de cada subproyecto permanecen en `src/backend/` y `src/frontend/`; el `docker-compose.yml` los referencia con rutas relativas (`build: ./backend`), que no cambian al vivir todo bajo `src/`.

`docs/walking-skeleton/` **no se elimina**: queda como registro del artefacto entregado. La fuente de verdad para desarrollar es `src/`; si ambas difieren, prevalece `src/`.

Cada módulo funcional del backend sigue el patrón del esqueleto (`model` → `repository` → `service` → `controller`) y la convención de nombres del ADR 0004.

## Alternativas consideradas

* **Dejar el código en `docs/walking-skeleton/` y trabajar ahí (extenderlo in situ):** se descartó porque mezcla código ejecutable con la carpeta de documentación y hace que `docs/` deje de ser solo material escrito revisable.
* **Colocar `backend/` y `frontend/` directamente en la raíz, sin carpeta contenedora:** es válido y funciona con el mismo `docker-compose`, pero se prefirió `src/` para separar con un único contenedor el código de la aplicación de la configuración del repositorio (README, licencia, `docs/`).
* **Mover el código a un repositorio nuevo:** se descartó porque parte el proyecto en dos repos, complica el despliegue en la VM compartida y rompe la trazabilidad entre el diseño (`docs/`) y el código.
* **Mover (no copiar) el walking skeleton con `git mv`:** se descartó porque se decidió conservar `docs/walking-skeleton/` como artefacto de la entrega; copiar mantiene ambos.

## Consecuencias

* **Positivas:**
  * `docs/` vuelve a contener solo documentación; el código vivo queda en `src/`.
  * Los cinco integrantes crean sus módulos bajo una misma ruta conocida (`src/backend/src/modules/`), evitando archivos duplicados y conflictos de merge.
  * No se tocan los `Dockerfile` ni las rutas del `docker-compose`; el despliegue en la VM funciona igual.
  * Se conserva el walking skeleton original como evidencia de la entrega de diseño.

* **Negativas / Riesgos:**
  * El código queda temporalmente duplicado (en `docs/walking-skeleton/` y en `src/`). Mientras ambos existan, los cambios de desarrollo se hacen **solo** en `src/`; `docs/walking-skeleton/` no se modifica.
  * La ruta del backend queda algo anidada (`src/backend/src/...`): `src/` del repositorio contiene el subproyecto `backend`, que a su vez tiene su propio `src/` de NestJS.

## Referencias

* ADR 0001: Elección de Stack tecnológico (`docs/adr/0001_Eleccion_Stack.md`)
* ADR 0004: Convención de nomenclatura para la implementación (`docs/adr/0004_Convencion_Nomenclatura_Implementacion.md`)
* Walking skeleton de referencia (`docs/walking-skeleton/`)
