-- =============================================================================
-- 001_rf_arb_07.sql
-- Esquema inicial para RF-ARB-07 (bloqueo de cierre de tarjeta padre con
-- subtareas directas pendientes) y la regla de negocio RN-12.
--
-- Alcance: Solo las 4 tablas que RF-ARB-07 y las tareas de esta semana
-- (T1.2 CardRepository, T2.1 CardMoveService) necesitan.
--
-- Convenciones:
--   * PK tipo uuid con gen_random_uuid(). Se respeta el modelo entidad-relacion, que define uuid para
--     todas las entidades (el walking-skeleton de items usaba SERIAL).
--   * snake_case en tablas y columnas (ADR 0004).
--   * Script idempotente: CREATE TABLE IF NOT EXISTS, se puede correr varias veces.
--
-- Nota de alcance: este script SOPORTA la regla RN-12 (relacion padre-hijo +
-- estado indexados para poder consultar subtareas directas), pero NO la
-- implementa."No cerrar un padre con hijos abiertos" es logica de servidor
-- (ADR 0003, tarea T2.1 de David), no una restriccion de la base de datos.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- usuarios: cuentas de la aplicacion.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id               uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    correo           varchar(255) NOT NULL UNIQUE,
    nombre           varchar(120) NOT NULL,
    contrasena_hash  varchar(255) NOT NULL,
    creado_en        timestamptz  NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- equipos: equipos de trabajo.
-- codigo_invitacion es NULL si fue revocado (ver modelo E-R).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipos (
    id                 uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre             varchar(120) NOT NULL,
    codigo_invitacion  varchar(64)  UNIQUE,
    creado_en          timestamptz  NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- membresias: relacion usuario <-> equipo. Un usuario puede responsabilizarse
-- de tarjetas a traves de su membresia.
-- RN-02: un usuario no puede estar dos veces en el mismo equipo
--        -> UNIQUE (usuario_id, equipo_id).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS membresias (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  uuid        NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
    equipo_id   uuid        NOT NULL REFERENCES equipos (id)  ON DELETE CASCADE,
    es_admin    boolean     NOT NULL DEFAULT false,
    unido_en    timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_membresia_usuario_equipo UNIQUE (usuario_id, equipo_id)
);

-- -----------------------------------------------------------------------------
-- tarjetas: nodos del arbol de proyecto (RF-ARB-07).
--   * padre_id: autorreferencia. NULL = tarea raiz.
--       ON DELETE CASCADE -> borrar un nodo borra su subarbol completo.
--   * responsable_id: membresia responsable, opcional.
--   * columna: estado kanban. CHECK con los 3 valores EXACTOS del modelo E-R;
--       este es el contrato que usa la regla RN-12 de T2.1 (WHERE columna <> 'hecho').
-- Se omiten las FK opcionales del E-R que apuntan a modulos aun inexistentes
-- (mensaje_origen_id, encuesta_origen_id); se agregaran cuando esos modulos existan.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tarjetas (
    id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    equipo_id       uuid         NOT NULL REFERENCES equipos (id)    ON DELETE CASCADE,
    padre_id        uuid         REFERENCES tarjetas (id)            ON DELETE CASCADE,
    responsable_id  uuid         REFERENCES membresias (id)          ON DELETE SET NULL,
    titulo          varchar(200) NOT NULL,
    descripcion     text,
    columna         varchar(20)  NOT NULL DEFAULT 'por_hacer'
                    CHECK (columna IN ('por_hacer', 'en_progreso', 'hecho')),
    posicion        integer      NOT NULL DEFAULT 0,
    fecha_limite    date,
    color           varchar(20)
);

-- -----------------------------------------------------------------------------
-- Indices para la consulta recursiva del arbol y el chequeo de subtareas (RN-12).
-- -----------------------------------------------------------------------------
-- padre_id: recorrer el arbol y contar subtareas directas de un nodo.
CREATE INDEX IF NOT EXISTS ix_tarjetas_padre_id  ON tarjetas (padre_id);
-- equipo_id: traer todas las tarjetas de un equipo (tablero).
CREATE INDEX IF NOT EXISTS ix_tarjetas_equipo_id ON tarjetas (equipo_id);
