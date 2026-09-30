# RN · Reglas de negocio

Invariantes del dominio: condiciones que deben cumplirse **siempre**, independientemente de qué pantalla o qué operación las toque. El servidor las hace cumplir; la interfaz solo las refleja. Corresponden a la sección "Reglas del dominio" del [modelo de dominio](../modelo-dominio.md) y son la base de las pruebas automatizadas de `RNF-MAN-02`.

Cada regla indica los requerimientos funcionales que la aplican.

---

## Equipos y membresías

### RN-01 · Acceso por membresía
Un usuario solo puede ver o modificar un recurso (canal, mensaje, tarjeta, label, rol, encuesta, nivel de habilidad) si tiene membresía en el equipo dueño de ese recurso.
- **Aplican:** RF-CUE-11, RNF-SEG-02 · **Fuente:** modelo de dominio

### RN-02 · Unicidad de membresía
Un usuario tiene como máximo una membresía por equipo.
- **Aplican:** RF-CUE-09 · **Fuente:** modelo de dominio

### RN-03 · Siempre hay un administrador
Todo equipo tiene al menos un administrador en todo momento. El último administrador no puede renunciar al rol ni salir del equipo sin transferir la administración antes.
- **Aplican:** RF-CUE-06, RF-CUE-12, RF-CUE-13 · **Fuente:** modelo de dominio

### RN-04 · Los roles son informativos
Los roles del equipo (*backend*, *scrum master*, …) no otorgan ni quitan permisos. El único permiso especial es ser administrador.
- **Aplican:** RF-LAB-04 · **Fuente:** elicitación 2026-09-25

### RN-05 · Gestión del vocabulario reservada al administrador
Solo un administrador crea, edita o elimina labels y roles del equipo.
- **Aplican:** RF-LAB-01, RF-LAB-02, RF-LAB-03, RF-LAB-04 · **Fuente:** equipo 2026-09-29

## Coherencia de equipo

### RN-06 · Todo se queda en el equipo
Los labels de una tarjeta, su tarea padre y el label de un nivel de habilidad pertenecen al mismo equipo que la tarjeta o la membresía. Una tarjeta no puede tener como padre una tarjeta de otro equipo ni un label de otro equipo.
- **Aplican:** RF-KAN-03, RF-ARB-01, RF-ARB-10, RF-LAB-05 · **Fuente:** modelo de dominio

### RN-07 · El responsable es miembro
El responsable de una tarjeta, si lo tiene, es una membresía del mismo equipo. Si el responsable sale del equipo, la tarjeta queda sin responsable.
- **Aplican:** RF-KAN-02, RF-KAN-06, RF-CUE-13 · **Fuente:** modelo de dominio

### RN-08 · Niveles solo para labels de habilidad
Un nivel de habilidad solo puede referirse a un label marcado como habilidad. Si el administrador le quita la marca a un label o lo elimina, sus niveles asociados se eliminan.
- **Aplican:** RF-LAB-02, RF-LAB-05, RF-LAB-06 · **Fuente:** equipo 2026-09-29

## Chat

### RN-09 · Un mensaje, un lugar
Un mensaje pertenece a exactamente un canal o a exactamente una conversación directa; nunca a ambos ni a ninguno.
- **Aplican:** RF-CHA-03, RF-CHA-07 · **Fuente:** modelo de dominio

### RN-10 · Conversación directa de dos
Una conversación directa tiene exactamente dos participantes, ambos miembros del mismo equipo, y existe como máximo una por cada par de miembros.
- **Aplican:** RF-CHA-07 · **Fuente:** modelo de dominio

## Árbol de proyecto

### RN-11 · Sin ciclos
Una tarjeta no puede ser ancestra de sí misma: el conjunto de tarjetas con la relación "es padre de" forma un bosque (un conjunto de árboles), nunca un ciclo.
- **Aplican:** RF-ARB-10, RF-ARB-11 · **Fuente:** modelo de dominio

### RN-12 · Un padre no está terminado antes que sus hijas
Una tarjeta no puede estar en *Hecho* mientras alguna de sus subtareas directas no lo esté.
- **Aplican:** RF-ARB-07 · **Fuente:** equipo 2026-09-29

### RN-13 · El padre nunca se mueve solo
La columna de una tarjeta cambia únicamente por acción explícita de un miembro; ningún cambio en las subtareas mueve al padre.
- **Aplican:** RF-ARB-08 · **Fuente:** equipo 2026-09-29

### RN-14 · Eliminar un padre libera a sus hijas
Al eliminar una tarjeta con subtareas, las subtareas directas pasan a ser tareas raíz. No hay eliminación en cascada.
- **Aplican:** RF-ARB-12, RF-KAN-07 · **Fuente:** equipo 2026-09-29

### RN-15 · Color efectivo
El color con que se muestra una tarjeta es, en este orden: su propio color si lo tiene; si no, el del ancestro más cercano que tenga color; si ninguno, gris neutro. El color no se copia a las descendientes.
- **Aplican:** RF-ARB-13, RF-ARB-14, RF-ARB-15 · **Fuente:** equipo 2026-09-29

## Votaciones

### RN-16 · Mínimo dos opciones
Una encuesta tiene al menos dos opciones.
- **Aplican:** RF-VOT-01 · **Fuente:** derivado

### RN-17 · Un voto por miembro
Un miembro tiene como máximo un voto por encuesta; votar de nuevo reemplaza el voto anterior. Esta regla se mantiene también en encuestas anónimas.
- **Aplican:** RF-VOT-02, RF-VOT-04 · **Fuente:** elicitación 2026-09-25

### RN-18 · Encuesta cerrada, resultado fijo
Una encuesta cerrada no acepta votos nuevos ni cambios de voto.
- **Aplican:** RF-VOT-05 · **Fuente:** elicitación 2026-09-25

## Notificaciones

### RN-19 · Notificar solo si la persona quiere
Se genera una notificación para un usuario únicamente si el tipo de evento está activo en sus preferencias y, cuando el evento se origina en un canal, ese canal no está silenciado por el usuario.
- **Aplican:** RF-NOT-01, RF-NOT-04, RF-NOT-05 · **Fuente:** elicitación 2026-09-25
