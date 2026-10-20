# ADR 0003: Validación de la regla de cierre de tareas en el servidor

* **Estatus:** Propuesto
* **Fecha:** 2026-10-19
* **Autores:** David Esteban Raigosa Socha  
&emsp; &emsp; &ensp; &nbsp; Deisy Viviana Lara Sisa  
&emsp; &emsp; &ensp; &nbsp; Hare Zeiyiukuin Atehortua Rincon  
&emsp; &emsp; &ensp; &nbsp; Fredy Humberto Garzon Salgado  
&emsp; &emsp; &ensp; &nbsp; Silvana Ramírez Ardila  

## Contexto
El requerimiento RF-ARB-07 y la regla de negocio RN-12 exigen que una tarjeta con al menos una subtarea directa fuera de *Hecho* no pueda moverse a *Hecho*: el tablero no debe poder declarar terminado algo con partes sin terminar. Esa regla debe cumplirse sin importar por dónde llegue el movimiento. El riesgo identificado en el documento del requerimiento es que, si solo se valida en la interfaz, una petición enviada directamente al servidor la salta y el tablero vuelve a mostrar información falsa. Además, RNF-SEG-02 exige verificar permisos en el servidor en cada operación sobre un recurso de equipo, y el ADR 0001 ya eligió NestJS, entre otras razones, para gestionar permisos (guards) y validar los datos entrantes (DTOs) en el servidor.

## Decisión
La regla de cierre se aplica en el servidor, dentro del módulo Dashboard de la capa de lógica de negocio. Al recibir la solicitud de mover una tarjeta a *Hecho*, el servidor consulta las subtareas directas de la tarjeta y cuenta las que no están en *Hecho*. Solo si ninguna está pendiente guarda el movimiento; en caso contrario rechaza la solicitud, no modifica nada e informa cuántas subtareas están pendientes. La aplicación web solo solicita el movimiento y muestra el resultado, revirtiendo el arrastre si fue rechazado.

* **Alternativa descartada:**
  * *Validar solo en la interfaz:* se descartó porque cualquier petición enviada sin pasar por la interfaz dejaría el tablero en un estado contradictorio (escenario AC-ARB-07.4 del requerimiento) y porque incumple RNF-SEG-02.

## Consecuencias

* **Positivas:**
  * **Una sola validación para todos los caminos de entrada:** la interfaz y cualquier petición directa pasan por la misma regla.
  * **Coherencia con el stack:** aprovecha lo que el ADR 0001 ya buscaba con NestJS (permisos y validación de datos en el servidor), sin añadir tecnología nueva.
  * **Verificable de forma automática:** la regla vive en un módulo del monolito y se puede cubrir con pruebas automatizadas, como exige RNF-MAN-02 para RN-12.

* **Negativas / Riesgos:**
  * **Revertir el arrastre en la interfaz:** la aplicación web no sabe si el movimiento es válido hasta recibir la respuesta del servidor, y debe devolver la tarjeta a su columna. Esto choca con el objetivo del ADR 0001 de actualizar el tablero sin parpadeos de pantalla y es una de las razones de la confianza de estimación *Media* del requerimiento.
  * **Cobertura parcial de RN-12:** la decisión solo cubre el movimiento a *Hecho*. Crear una subtarea bajo un padre ya cerrado, cambiar de padre o reabrir una subtarea pueden seguir dejando la regla incumplida; esas situaciones siguen como preguntas abiertas del requerimiento.
  * **Atomicidad:** para evitar estados inconsistentes cuando dos miembros actúan a la vez, la comprobación y el guardado deben ejecutarse como una sola operación atómica, lo que añade complejidad a la capa de persistencia.
