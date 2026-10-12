# Carpeta de Diagramas del Proyecto Slackless
Aquí se encuentran los diagramas técnicos en formato Mermaid.


# Diagramas Técnicos y Casos de Uso — Slackless

Esta carpeta contiene la documentación visual y el modelado técnico del sistema **Slackless**, estructurados en diagramas Mermaid y respaldados por la matriz de trazabilidad del proyecto.

## Índice de Archivos

### Diagramas Individuales (.mmd)
- **`01-arquitectura-tres-capas.mmd`**: Arquitectura general del sistema en tres capas (Presentación, Lógica de Negocio y Datos) con sus respectivos módulos y servicios externos.
- **`02-modelo-entidad-relacion.mmd`**: Modelo Entidad-Relación (ERD) completo que incluye las 18 entidades del dominio y sus restricciones de integridad (RN).
- **`03-secuencia-mensaje-notificacion.mmd`**: Diagrama de secuencia que detalla el flujo de envío de mensajes en tiempo real y la generación condicional de notificaciones.
- **`04-secuencia-cierre-padre.mmd`**: Diagrama de secuencia correspondiente a la regla de negocio `RF-ARB-07` / `RN-12` (bloqueo de cierre de tareas padre con subtareas pendientes).
- **`05-secuencia-asignacion-habilidades.mmd`**: Secuencia para la asignación de responsables basada en niveles de habilidad y permisos de administrador (`RF-LAB-09`).
- **`06-caso-de-uso-mover-a-hecho.mmd`**: Diagrama de flujo detallado del caso de uso de `RF-ARB-07`.
- **`07-casos-de-uso-cuentas-equipos.mmd`**: Casos de uso de `CU-01` a `CU-09` (Módulo Cuentas y Equipos) con jerarquía de actores y relaciones.
- **`08-casos-de-uso-chat.mmd`**: Casos de uso de `CU-10` a `CU-16` (Módulo Chat) incluyendo interacciones y extensiones.
- **`09-casos-de-uso-arbol-proyecto.mmd`**: Casos de uso de `CU-17` a `CU-24` (Módulo Árbol de Proyecto).

### Archivos Consolidados
- **`slackless-diagramas.md`**: Archivo que unifica los 9 diagramas anteriores en un solo documento de lectura continua.

---

## Instrucciones de Visualización y Edición

1. **GitHub:** GitHub renderiza automáticamente el código de bloques `mermaid` dentro de los archivos Markdown (`.md`).
2. **Editor Local (VS Code):** Se recomienda instalar la extensión *Markdown Preview Mermaid Support* para visualizar los diagramas directamente en el editor.
3. **Mermaid Live Editor:** Puedes copiar cualquier bloque de código `.mmd` y pegarlo en [mermaid.live](https://mermaid.live) para exportarlo como imagen PNG o SVG si lo necesitas para un informe impreso.

---

## Observaciones e Inconsistencias Identificadas en el Proyecto

Durante el análisis y modelado técnico, el equipo identificó las siguientes consideraciones prácticas:

1. **Servicio de Llamadas frente al Alcance del Proyecto (Diagrama 1):**
   * La pizarra inicial del equipo contemplaba un servicio de llamadas externo. Sin embargo, los requerimientos formales del proyecto limitan los servicios externos al correo electrónico. Se mantuvo en el diagrama como una propuesta futura o pendiente de definición (`ADR 0002`).

2. **Estructura de Módulos del Servidor (Diagramas 1, 3, 4 y 5):**
   * El esquema general presenta tres macromódulos físicos (`Dashboard`, `Users`, `Com.`), mientras que el desglose detallado funciona por áreas funcionales del SRS (`Kanban`, `Árbol`, `Chat`, etc.). Se interpretan las áreas grandes como contenedores físicos del monolito modular y las internas como la lógica de negocio específica.

3. **Visibilidad del Rechazo al Cerrar Tareas con Subtareas Pendientes (Diagrama 4 - RF-ARB-07):**
   * Inicialmente se consideró que un rechazo de cierre solo afectaría al usuario que arrastró la tarjeta. Para evitar desincronizaciones en tiempo real, se ajustó para que el servidor notifique a todos los clientes conectados la reversión de la tarjeta a su columna original.

4. **Preguntas Abiertas en el Cierre y Reorganización (Diagrama 4):**
   * Está pendiente confirmar el comportamiento exacto del sistema si una tarjeta que ya se encuentra en la columna "Hecho" recibe una nueva subtarea o se le reabre una tarea pendiente.

5. **Alineación de Notificaciones y Base de Datos (Diagramas 2 y 3):**
   * Se ajustó el diagrama de secuencia de notificaciones para utilizar los campos reales de la tabla de base de datos (`tipo`, `texto`, `recurso_tipo`, `recurso_id`) en lugar de referencias genéricas como "enlace".

6. **Permisos al Consultar Niveles de Habilidad (Diagrama 5 - RF-LAB-09):**
   * Todos los miembros pueden ver y asignar responsables, pero el servidor restringe la devolución de los niveles de habilidad (*bueno*, *regular*, *malo*) exclusivamente a los usuarios con rol de administrador.

7. **Representación de Casos de Uso en Mermaid (Diagramas 7, 8 y 9):**
   * Como Mermaid carece de un motor nativo formal de casos de uso UML con figuras de monigotes, se implementó mediante diagramas de flujo utilizando cajas estructuradas e íconos, conservando la lógica estricta de herencia de actores y dependencias (`include` / `extend`).

8. **Detalles a Corregir en el Documento de Casos de Uso (`casos-de-uso.md`):**
   * **Conteo pendiente:** La introducción menciona *"67 requerimientos agrupados en * casos de uso"*, omitiendo la cantidad cerrada (24 casos redactados en la versión actual).
   * **Tabla de cobertura incompleta:** Actualmente solo detalla métricas para 3 de los 7 módulos del sistema.
   * **Enlaces del índice:** Algunos enlaces del menú principal no funcionan correctamente debido a diferencias entre mayúsculas y guiones en los anclas de Markdown.
