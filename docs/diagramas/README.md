# Carpeta de Diagramas del Proyecto Slackless
Aquí se encuentran los diagramas técnicos en formato Mermaid.


# Documentación Técnica de Diagramas — Slackless

Este directorio consolida los modelos de arquitectura, datos y secuencias del sistema Slackless. Todos los esquemas están definidos en formato Mermaid.js conforme a la especificación estándar de modelado del proyecto.

## 1. Inventario de Archivos

| Archivo | Tipo de Diagrama | Ámbito / Objeto del Modelo |
| :--- | :--- | :--- |
| `slackless-diagramas.md` | Documento Consolidado | Especificación completa e integrada en formato Markdown para lectura secuencial. |
| `01-arquitectura-tres-capas.mmd` | Diagrama de Bloques (`flowchart LR`) | Arquitectura del sistema en tres capas, desacoplamiento de módulos NestJS y microservicios. |
| `02-modelo-entidad-relacion.mmd` | Entidad-Relación (`erDiagram`) | Modelo relacional de la base de datos PostgreSQL (18 tablas principales y cardinalidades). |
| `03-secuencia-mensaje-notificacion.mmd` | Diagrama de Secuencia (`sequenceDiagram`) | Protocolo de mensajería síncrona/asíncrona via WebSockets y pipeline de notificaciones (`RN-19`). |
| `04-secuencia-cierre-padre.mmd` | Diagrama de Secuencia (`sequenceDiagram`) | Lógica de validación transaccional y respuesta HTTP frente al cierre de nodos padre (`RN-12`, `RN-13`). |
| `05-secuencia-asignacion-habilidades.mmd` | Diagrama de Secuencia (`sequenceDiagram`) | Flujo de control de acceso por rol y evaluación de matriz de habilidades (`RF-LAB-07` a `09`). |
| `06-caso-de-uso-mover-a-hecho.mmd` | Flujo de Procesos (`flowchart TD`) | Caso de uso detallado del requerimiento `RF-ARB-07` (Mover tarjeta a estado Hecho). |

## 2. Visualización y Mantenimiento

### Renderizado en GitHub
El motor de GitHub renderiza automáticamente la sintaxis de Mermaid.js:
- Para revisión integral del sistema, consultar `slackless-diagramas.md`.
- Para inspección modular o diffs de control de versiones, consultar los archivos `.mmd` individuales.

### Entorno de Desarrollo Local (VS Code)
Para trabajar de forma local con la documentación:
1. Asegurar la presencia de la extensión `Markdown Preview Mermaid Support` en Visual Studio Code.
2. Ejecutar el comando `Markdown: Open Preview` (`Ctrl+Shift+V` en Linux/Windows, `Cmd+Shift+V` en macOS) sobre cualquier archivo `.md` del directorio.

### Edición y Exportación (Mermaid Live Editor)
Para modificar sintaxis o exportar artefactos gráficos a formatos vectoriales o de mapa de bits (`SVG` / `PNG`):
1. Copiar el bloque de código del archivo `.mmd` requerido.
2. Cargar el texto en [Mermaid Live Editor](https://mermaid.live).
3. Exportar mediante la opción *Actions* > *Download SVG* / *PNG*.

## 3. Trazabilidad de Reglas de Negocio y Requerimientos

- **`RN-01` / `RN-02`:** Validación de sesión activa JWT y aislamiento multitenant por equipo.
- **`RN-06` / `RN-11`:** Restricciones sobre la estructura acíclica dirigida (DAG) del árbol de tareas.
- **`RN-12` / `RN-13`:** Integridad referencial de estado: restrinja la transición a `HECHO` de un nodo padre si existen subtareas directas en estados `POR_HACER` o `EN_PROGRESO`.
- **`RN-19`:** Filtrado y distribución de notificaciones considerando el nivel de presencia y silenciado de canales.
- **`RF-LAB-07` a `09`:** Reglas de visibilidad del vector de habilidades de usuarios, acotado exclusivamente al rol de Administrador.
