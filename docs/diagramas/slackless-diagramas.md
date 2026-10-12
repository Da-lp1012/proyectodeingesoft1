# Slackless — Diagramas Mermaid

Pega cada bloque en https://mermaid.live para verlo renderizado.

## 1. Arquitectura de tres capas y módulos

```mermaid
flowchart LR
    ADM(["Admin"])
    USR(["User"])

    subgraph T1["Tier 1 · Presentación (navegador)"]
        WEB["App Web<br/>React + Vite + TypeScript"]
    end

    subgraph T2["Tier 2 · Lógica de negocio"]
        subgraph API["Servidor API · NestJS (monolito modular)"]
            DASH["Módulo Dashboard"]
            USERS["Módulo Users"]
            COM["Módulo Com.<br/>(Comunicaciones)"]
        end
        LLAM["Servicio de Llamadas<br/>(microservicio)"]
    end

    subgraph T3["Tier 3 · Datos"]
        PG[("PostgreSQL")]
        RD[("Redis<br/>(diferido)")]
    end

    MAIL["API Gmail<br/>(servicio externo)"]
    LLAMEXT["API de Llamadas<br/>(servicio externo)"]

    ADM -->|usa| WEB
    USR -->|usa| WEB

    WEB -->|"IApiRest (HTTP/JSON)"| API
    WEB <-->|"IEventos (WebSocket)"| API
    WEB -.->|"ILlamadasCliente (WebRTC)"| LLAM

    DASH -->|"IEquipos"| USERS
    DASH -->|"INotificar"| COM
    COM -->|"IEquipos"| USERS
    COM -->|"ISalaLlamada (HTTP)"| LLAM

    API -->|"IPersistencia (SQL)"| PG
    API -.->|"IEfimero (presencia, cache)"| RD

    COM -->|"IEmail (SMTP)"| MAIL
    LLAM -.->|"pendiente ADR 0002"| LLAMEXT

    classDef externo fill:#eeeeee,stroke:#666666,stroke-dasharray: 5 5;
    class MAIL,LLAMEXT externo;
```

## 2. Modelo entidad-relación

```mermaid
erDiagram
    Usuario ||--o{ Membresia : "tiene"
    Equipo ||--o{ Membresia : "agrupa"
    Equipo ||--o{ Canal : "posee"
    Equipo ||--o{ ConversacionDirecta : "posee"
    Equipo ||--o{ Rol : "define"
    Equipo ||--o{ Label : "define"
    Equipo ||--o{ Tarjeta : "contiene"
    Equipo ||--o{ Notificacion : "contexto de"

    Membresia ||--o{ MembresiaRol : "recibe"
    Rol ||--o{ MembresiaRol : "se asigna en"

    Membresia ||--o{ ConversacionDirecta : "participante A"
    Membresia ||--o{ ConversacionDirecta : "participante B"
    Canal |o--o{ Mensaje : "contiene"
    ConversacionDirecta |o--o{ Mensaje : "contiene"
    Membresia ||--o{ Mensaje : "escribe"

    Tarjeta |o--o{ Tarjeta : "es padre de"
    Membresia |o--o{ Tarjeta : "es responsable de"
    Mensaje |o--o{ Tarjeta : "origina"
    Encuesta |o--o{ Tarjeta : "origina"
    Tarjeta ||--o{ TarjetaLabel : "se clasifica con"
    Label ||--o{ TarjetaLabel : "clasifica"

    Membresia ||--o{ NivelHabilidad : "declara"
    Label ||--o{ NivelHabilidad : "se evalua en"

    Canal ||--o{ Encuesta : "publica"
    Tarjeta |o--o{ Encuesta : "origina votacion de responsable"
    Membresia ||--o{ Encuesta : "crea"
    Encuesta ||--|{ OpcionEncuesta : "ofrece"
    Encuesta ||--o{ Voto : "recibe"
    OpcionEncuesta ||--o{ Voto : "obtiene"
    Membresia ||--o{ Voto : "emite"

    Usuario ||--o{ Notificacion : "recibe"
    Usuario ||--o{ PreferenciaNotificacion : "configura"
    Usuario ||--o{ CanalSilenciado : "silencia"
    Canal ||--o{ CanalSilenciado : "es silenciado en"

    Usuario {
        uuid id PK
        string correo UK
        string nombre
        string contrasena_hash
        timestamp creado_en
    }
    Equipo {
        uuid id PK
        string nombre
        string codigo_invitacion UK "nulo si fue revocado"
        timestamp creado_en
    }
    Membresia {
        uuid id PK
        uuid usuario_id FK "unico con equipo_id (RN-02)"
        uuid equipo_id FK
        boolean es_admin
        timestamp unido_en
    }
    Rol {
        uuid id PK
        uuid equipo_id FK
        string nombre
    }
    MembresiaRol {
        uuid membresia_id PK, FK
        uuid rol_id PK, FK
    }
    Canal {
        uuid id PK
        uuid equipo_id FK
        string nombre "unico por equipo"
        timestamp creado_en
    }
    ConversacionDirecta {
        uuid id PK
        uuid equipo_id FK
        uuid membresia_a_id FK
        uuid membresia_b_id FK "una conversacion por par (RN-10)"
    }
    Mensaje {
        uuid id PK
        uuid membresia_autor_id FK
        uuid canal_id FK "nulo si es directo (RN-09)"
        uuid conversacion_id FK "nulo si es de canal (RN-09)"
        text texto
        timestamp enviado_en
    }
    Tarjeta {
        uuid id PK
        uuid equipo_id FK
        uuid padre_id FK "nulo si es tarea raiz"
        uuid responsable_id FK "membresia, opcional"
        uuid mensaje_origen_id FK "opcional (RF-CHA-09)"
        uuid encuesta_origen_id FK "opcional (RF-VOT-06)"
        string titulo
        text descripcion
        string columna "por_hacer, en_progreso, hecho"
        int posicion
        date fecha_limite
        string color "paleta de 8, opcional"
    }
    Label {
        uuid id PK
        uuid equipo_id FK
        string nombre "unico por equipo"
        boolean es_habilidad
    }
    TarjetaLabel {
        uuid tarjeta_id PK, FK
        uuid label_id PK, FK
    }
    NivelHabilidad {
        uuid membresia_id PK, FK
        uuid label_id PK, FK "solo labels de habilidad (RN-08)"
        string nivel "bueno, regular, malo"
    }
    Encuesta {
        uuid id PK
        uuid canal_id FK
        uuid tarjeta_id FK "opcional, votacion de responsable (RF-VOT-07)"
        uuid membresia_creador_id FK
        string pregunta
        boolean es_anonima
        boolean cerrada
        timestamp creada_en
    }
    OpcionEncuesta {
        uuid id PK
        uuid encuesta_id FK "minimo 2 opciones por encuesta (RN-16)"
        string texto
    }
    Voto {
        uuid id PK
        uuid encuesta_id FK "unico con membresia_id (RN-17)"
        uuid opcion_id FK
        uuid membresia_id FK "no se expone si es anonima"
    }
    Notificacion {
        uuid id PK
        uuid usuario_id FK
        uuid equipo_id FK
        string tipo "mencion, tarea_asignada, encuesta, mensaje_canal"
        string texto
        string recurso_tipo
        uuid recurso_id
        boolean leida
        timestamp creada_en
    }
    PreferenciaNotificacion {
        uuid usuario_id PK, FK
        string tipo PK
        boolean activa_en_app
        boolean activa_por_correo
    }
    CanalSilenciado {
        uuid usuario_id PK, FK
        uuid canal_id PK, FK
    }
```

## 3. Secuencia: mensaje en tiempo real y notificación

```mermaid
sequenceDiagram
    autonumber
    actor A as Miembro autor
    participant CA as Cliente React del autor
    participant GW as Gateway Socket.IO
    participant API as API NestJS - modulo Com.
    participant PG as PostgreSQL
    participant RD as Redis
    participant CB as Clientes React de los demas miembros

    A->>CA: Escribe el mensaje y pulsa Enviar
    CA->>GW: emit mensaje:enviar (canalId, texto)
    GW->>API: crearMensaje(usuario, canalId, texto)
    API->>API: Valida sesion, membresia en el equipo y texto (RN-01, RNF-SEG-03)
    API->>PG: INSERT mensaje (autor, canal, texto, fecha)
    PG-->>API: Mensaje guardado (id, fecha)
    API-->>GW: Mensaje guardado

    par Entrega en tiempo real
        GW-->>CA: emit mensaje:nuevo (sala del canal)
    and
        GW-->>CB: emit mensaje:nuevo (sala del canal)
    end

    Note over API,PG: Generacion de notificaciones (RF-NOT-01, RN-19)
    API->>PG: Consultar miembros del equipo, sus preferencias y canales silenciados
    PG-->>API: Destinatarios con preferencias

    loop Por cada miembro destinatario distinto del autor
        API->>API: Define el tipo: mencion si lo nombra con @, si no mensaje_canal
        alt Tipo activo en sus preferencias y canal no silenciado
            API->>PG: INSERT notificacion (usuario, equipo, tipo, texto, recurso)
            opt Redis activo (diferido segun ADR 0001)
                API->>RD: Consultar si el destinatario esta en linea
                RD-->>API: Presencia
            end
            API->>GW: Enviar notificacion al destinatario conectado
            GW-->>CB: emit notificacion:nueva (actualiza la campana)
        else Tipo desactivado o canal silenciado
            Note right of API: No se genera notificacion
        end
    end
```

## 4. Secuencia: restricción de cierre del padre (RN-12 / RN-13)

```mermaid
sequenceDiagram
    autonumber
    actor M as Miembro
    participant UI as Cliente React
    participant KAN as API NestJS - modulo Kanban
    participant ARB as API NestJS - modulo Arbol
    participant PG as PostgreSQL
    participant GW as Gateway Socket.IO
    participant OT as Otros clientes

    alt Operacion A - Mover la tarjeta a Hecho (RF-ARB-07)
        M->>UI: Arrastra la tarjeta a la columna Hecho y la suelta
        UI->>KAN: PATCH /tarjetas/id/mover (columna=hecho, posicion)
        KAN->>KAN: Verifica sesion y membresia del equipo (precondicion, RN-01)
        KAN->>PG: BEGIN (operacion atomica)
        KAN->>ARB: validarCierre(tarjetaId)
        ARB->>PG: Consultar las subtareas directas de la tarjeta
        PG-->>ARB: Subtareas directas con su columna
        Note over ARB: Pendiente = subtarea directa en por_hacer o en_progreso. Si no tiene subtareas no hay nada que comprobar
        ARB-->>KAN: Numero de subtareas pendientes (n)
        alt Sin pendientes (n = 0)
            KAN->>PG: UPDATE columna = hecho, posicion
            KAN->>PG: COMMIT
            KAN-->>UI: 200 OK
            UI-->>M: La tarjeta queda en Hecho
            KAN->>GW: Publicar tarjeta:movida
            GW-->>OT: tarjeta:movida (los demas miembros ven el cambio)
        else Hay pendientes (n mayor que 0)
            KAN->>PG: ROLLBACK (no se modifica ningun dato)
            KAN-->>UI: 409 Conflicto (pendientes = n)
            UI-->>M: Devuelve la tarjeta a su columna original y muestra Tiene n subtarea(s) pendiente(s)
            KAN->>GW: Publicar tarjeta:revertida (columna original)
            GW-->>OT: tarjeta:revertida (la tarjeta sigue en su columna original)
        end
    else Operacion B - Cambiar la tarjeta de padre (RF-ARB-10, RF-ARB-11)
        M->>UI: Elige un nuevo padre para la tarjeta
        UI->>ARB: PATCH /tarjetas/id/padre (padreId)
        ARB->>ARB: Verifica sesion y membresia del equipo (RN-01)
        ARB->>PG: Cargar la tarjeta, el nuevo padre y los ancestros del nuevo padre
        PG-->>ARB: Datos del arbol
        alt El nuevo padre es de otro equipo (RN-06)
            ARB-->>UI: 422 Rechazado
            UI-->>M: El padre debe ser una tarjeta de tu equipo
        else El nuevo padre es la misma tarjeta o una descendiente (RN-11)
            ARB-->>UI: 422 Rechazado
            UI-->>M: No se permiten ciclos en el arbol
        else El nuevo padre esta en Hecho y la tarjeta no (RN-12)
            Note over ARB: Regla propuesta, pendiente de confirmar con el equipo (pregunta abierta 1 de RF-ARB-07)
            ARB-->>UI: 409 Conflicto
            UI-->>M: El padre ya esta en Hecho y esta tarea sigue pendiente
        else Cambio valido
            ARB->>PG: UPDATE padre_id
            PG-->>ARB: ok
            ARB-->>UI: 200 OK
            UI-->>M: Muestra el nuevo padre y actualiza el progreso
            ARB->>GW: Publicar tarjeta:actualizada (incluye los padres afectados)
            GW-->>OT: tarjeta:actualizada
        end
    end

    Note over UI,OT: RN-13 - Ningun cambio en las subtareas mueve al padre automaticamente (RF-ARB-08)
```

## 5. Secuencia: asignación con niveles de habilidad

```mermaid
sequenceDiagram
    autonumber
    actor AD as Administrador
    participant UI as Cliente React
    participant API as API NestJS
    participant PG as PostgreSQL
    participant GW as Gateway Socket.IO
    participant OT as Otros clientes

    AD->>UI: Abre el selector de responsable de la tarjeta
    UI->>API: GET /tarjetas/id/candidatos
    API->>API: Valida sesion y membresia (RN-01) y determina si quien consulta es administrador
    Note over API: Si quien consulta no es administrador no se devuelven niveles (RF-LAB-09)
    API->>PG: Buscar los labels de la tarjeta marcados como habilidad
    PG-->>API: Labels de habilidad de la tarjeta

    alt La tarjeta no tiene labels de habilidad
        API->>PG: Buscar los miembros del equipo
        PG-->>API: Miembros
        API-->>UI: Miembros sin niveles (RF-LAB-07)
    else La tarjeta tiene labels de habilidad
        API->>PG: Buscar el nivel de cada miembro en esos labels
        PG-->>API: Niveles declarados
        API-->>UI: Miembros con su nivel por label (bueno, regular, malo o sin responder)
    end

    UI-->>AD: Muestra el selector con los niveles
    AD->>UI: Elige un miembro como responsable

    opt Algun nivel del miembro elegido es malo (RF-LAB-08)
        UI-->>AD: Advertencia - el miembro se declaro malo en un label de la tarjeta
        AD->>UI: Confirma o cancela
        break El administrador cancela
            UI-->>AD: Cierra el selector sin cambios
        end
    end

    UI->>API: PATCH /tarjetas/id/responsable (miembroId)
    API->>API: Valida que el responsable sea miembro del mismo equipo (RN-07)
    API->>PG: UPDATE responsable de la tarjeta
    PG-->>API: ok
    API-->>UI: 200 OK
    UI-->>AD: Muestra el responsable en la tarjeta
    API->>GW: Publicar tarjeta:actualizada
    GW-->>OT: tarjeta:actualizada

    opt El responsable tiene activa la notificacion de tarea asignada (RN-19)
        API->>PG: INSERT notificacion (tipo tarea_asignada)
        API->>GW: Enviar notificacion al responsable
    end

    Note over UI,API: El servidor no bloquea la asignacion, la advertencia solo informa (RF-LAB-08)
```

## 6. Caso de uso RF-ARB-07: Mover una tarea a Hecho (flujo)

```mermaid
flowchart TD
    PRE["Precondición: el miembro tiene sesión y pertenece al equipo.<br/>La tarjeta existe y no está en Hecho"]
    INI(["Disparador: el miembro arrastra una tarjeta a Hecho"])
    P1["1. El miembro suelta la tarjeta en Hecho"]
    P2["2. El sistema consulta las subtareas directas de la tarjeta"]
    D1{"¿La tarjeta tiene subtareas directas?"}
    P3["3. El sistema comprueba que todas las subtareas directas están en Hecho"]
    D2{"¿Todas están en Hecho?"}
    SIN["Sin subtareas: no hay nada que comprobar"]
    P4["4. El sistema mueve la tarjeta a Hecho y guarda el cambio"]
    P5["5. El sistema muestra el cambio a los demás miembros que tengan el tablero abierto"]
    FIN1(["Postcondición: la tarjeta está en Hecho"])
    ALT1["Flujo alternativo: el sistema no mueve la tarjeta y la devuelve a su columna original"]
    ALT2["El sistema informa cuántas subtareas faltan por pasar a Hecho.<br/>No se modifica ningún otro dato"]
    FIN2(["Postcondición: la tarjeta sigue en su columna original y el miembro sabe cuántas subtareas faltan"])

    PRE -.-> INI
    INI --> P1
    P1 --> P2
    P2 --> D1
    D1 -- "No" --> SIN
    SIN --> P4
    D1 -- "Sí" --> P3
    P3 --> D2
    D2 -- "Sí, todas" --> P4
    D2 -- "No, hay pendientes" --> ALT1
    ALT1 --> ALT2
    ALT2 --> FIN2
    P4 --> P5
    P5 --> FIN1

    classDef nota fill:#f5f5f5,color:#333333,stroke:#999999,stroke-dasharray: 4 4;
    classDef principal fill:#1E2761,color:#ffffff,stroke:#1E2761;
    classDef alterno fill:#F2A541,color:#1E2761,stroke:#F2A541;
    class PRE nota;
    class P1,P2,P3,P4,P5,SIN principal;
    class ALT1,ALT2 alterno;
```

## 7. Casos de uso: Cuentas y equipos (CU-01 a CU-09)

```mermaid
flowchart LR
    VIS["👤 Visitante"]
    USR["👤 Usuario"]
    MIE["👤 Miembro"]
    ADM["👤 Administrador"]

    ADM -.->|"es un"| MIE
    MIE -.->|"es un"| USR

    subgraph SIS["Slackless · Cuentas y equipos"]
        CU01(["CU-01 Registrar cuenta"])
        CU02(["CU-02 Iniciar sesión"])
        CU03(["CU-03 Cerrar sesión"])
        CU04(["CU-04 Crear equipo"])
        CU05(["CU-05 Gestionar código de invitación"])
        CU06(["CU-06 Unirse a un equipo con código"])
        CU07(["CU-07 Cambiar de equipo activo"])
        CU08(["CU-08 Transferir la administración"])
        CU09(["CU-09 Salir de un equipo"])
    end

    VIS --- CU01
    VIS --- CU02
    USR --- CU03
    USR --- CU04
    USR --- CU06
    USR --- CU07
    MIE --- CU09
    ADM --- CU05
    ADM --- CU08

    CU08 -.->|"«extend» si es el único admin"| CU09

    LEG["Borde continuo: Must · Borde punteado: Should"]

    classDef actor fill:#ffffff,stroke:#333333,stroke-width:2px;
    classDef must fill:#e8eefc,stroke:#1E2761;
    classDef should fill:#fff6e5,stroke:#F2A541,stroke-dasharray: 5 5;
    classDef nota fill:#f5f5f5,stroke:#999999,color:#333333;
    class VIS,USR,MIE,ADM actor;
    class CU01,CU02,CU03,CU04,CU05,CU06,CU07 must;
    class CU08,CU09 should;
    class LEG nota;
```

## 8. Casos de uso: Chat (CU-10 a CU-16)

```mermaid
flowchart LR
    MIE["👤 Miembro"]

    subgraph SIS["Slackless · Chat"]
        CU10(["CU-10 Crear canal"])
        CU11(["CU-11 Consultar y entrar a canales"])
        CU12(["CU-12 Enviar mensaje en un canal"])
        CU13(["CU-13 Consultar historial de mensajes"])
        CU14(["CU-14 Conversar en privado"])
        CU15(["CU-15 Mencionar a un miembro"])
        CU16(["CU-16 Crear tarea desde un mensaje"])
    end

    MIE --- CU10
    MIE --- CU11
    MIE --- CU12
    MIE --- CU13
    MIE --- CU14
    MIE --- CU15
    MIE --- CU16

    CU15 -.->|"«extend» el mensaje contiene @nombre"| CU12
    CU14 -.->|"«include» intercambio de mensajes"| CU12

    LEG["Borde continuo: Must · Borde punteado: Should"]

    classDef actor fill:#ffffff,stroke:#333333,stroke-width:2px;
    classDef must fill:#e8eefc,stroke:#1E2761;
    classDef should fill:#fff6e5,stroke:#F2A541,stroke-dasharray: 5 5;
    classDef nota fill:#f5f5f5,stroke:#999999,color:#333333;
    class MIE actor;
    class CU10,CU11,CU12,CU13 must;
    class CU14,CU15,CU16 should;
    class LEG nota;
```

## 9. Casos de uso: Árbol de proyecto (CU-17 a CU-24)

```mermaid
flowchart LR
    MIE["👤 Miembro"]
    SYS["⚙ Sistema"]

    subgraph SIS["Slackless · Árbol de proyecto"]
        CU17(["CU-17 Crear subtarea"])
        CU18(["CU-18 Consultar subtareas y progreso"])
        CU19(["CU-19 Mover una tarjeta con subtareas a Hecho"])
        CU20(["CU-20 Ver el esquema del proyecto"])
        CU21(["CU-21 Cambiar la tarea padre"])
        CU22(["CU-22 Eliminar una tarjeta con subtareas"])
        CU23(["CU-23 Asignar color a una tarjeta"])
        CU24(["CU-24 Visualizar el color efectivo"])
    end

    MIE --- CU17
    MIE --- CU18
    MIE --- CU19
    MIE --- CU20
    MIE --- CU21
    MIE --- CU22
    MIE --- CU23
    MIE --- CU24
    CU24 --- SYS

    CU20 -.->|"«include»"| CU24

    LEG["Borde continuo: Must · Borde punteado: Should"]

    classDef actor fill:#ffffff,stroke:#333333,stroke-width:2px;
    classDef must fill:#e8eefc,stroke:#1E2761;
    classDef should fill:#fff6e5,stroke:#F2A541,stroke-dasharray: 5 5;
    classDef nota fill:#f5f5f5,stroke:#999999,color:#333333;
    class MIE,SYS actor;
    class CU17,CU18,CU19,CU22,CU23,CU24 must;
    class CU20,CU21 should;
    class LEG nota;
```
