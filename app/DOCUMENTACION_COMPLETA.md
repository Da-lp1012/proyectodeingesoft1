# Documentación Completa del Walking Skeleton - Slackless

**Equipo 4 - G2 | Ingeniería de Software I - 2026-II**

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Arquitectura General](#2-arquitectura-general)
3. [Frontend (React + Vite)](#3-frontend-react--vite)
4. [Backend (NestJS)](#4-backend-nestjs)
5. [Base de Datos (PostgreSQL)](#5-base-de-datos-postgresql)
6. [Docker y Despliegue](#6-docker-y-despliegue)
7. [Flujo de Datos Completo](#7-flujo-de-datos-completo)
8. [Testing](#8-testing)
9. [Configuración y Variables de Entorno](#9-configuración-y-variables-de-entorno)

---

## 1. Introducción

### ¿Qué es un Walking Skeleton?

Un "esqueleto caminante" es la **implementación mínima** de un sistema que atraviesa **todas las capas de la arquitectura**:
- **Frontend**: interfaz de usuario donde el usuario interactúa
- **Backend (API)**: lógica de negocio y validaciones
- **Base de datos**: persistencia de datos

El objetivo es validar que toda la infraestructura funciona de extremo a extremo antes de agregar más funcionalidades.

### ¿Qué hace este Walking Skeleton?

Permite:
1. Ver el **estado del sistema** (Frontend → API → Base de datos) en tiempo real
2. **Guardar** un mensaje de texto
3. **Listar** todos los mensajes guardados

### Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| Frontend | React | 19.1 | Interfaz de usuario reactiva |
| Build Tool | Vite | 7.0 | Compilación y servidor de desarrollo |
| Backend | NestJS | 11.1 | Framework Node.js para APIs REST |
| Runtime | Node.js | 22 | Entorno de ejecución JavaScript |
| Base de datos | PostgreSQL | 16 | Base de datos relacional |
| Driver DB | pg | 8.16 | Cliente PostgreSQL para Node.js |
| Testing Backend | Vitest | 3.2 | Framework de testing |
| Testing HTTP | Supertest | 7.1 | Testing de endpoints HTTP |
| Lenguaje | TypeScript | 5.9 | Tipado estático para JavaScript |
| Contenedores | Docker | - | Aislamiento y despliegue |
| Orquestación | Docker Compose | v2 | Gestión de múltiples contenedores |

---

## 2. Arquitectura General

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                             │
│                    http://IP:5174                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                    │
│  - Interfaz de usuario (HTML/CSS/TypeScript)                │
│  - Llama a /api/* (proxy de Vite redirige al backend)      │
│  - Puerto: 5173 (dev) / 5174 (producción VM)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP GET/POST /api/*
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (NestJS + Node.js)                 │
│  - API REST con endpoints /api/health y /api/items          │
│  - Validación de datos y reglas de negocio                  │
│  - Puerto: 3000 (dev) / 3004 (producción VM)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ SQL queries (pg driver)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DATOS (PostgreSQL)                      │
│  - Tabla: items (id, title, created_at)                     │
│  - Puerto: 5432                                              │
│  - Usuario: g2_team_4_user                                   │
│  - Base: g2-team-4-db                                        │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Comunicación

1. **Usuario** abre el navegador → `http://IP_VM:5174`
2. **Vite** sirve el HTML/CSS/JS del frontend
3. **Frontend** hace peticiones a `/api/health` y `/api/items`
4. **Proxy de Vite** redirige `/api/*` → `http://api:3000/api/*`
5. **Backend** procesa la petición:
   - Valida datos de entrada
   - Ejecuta lógica de negocio
   - Llama al repositorio
6. **Repositorio** ejecuta SQL con parámetros contra PostgreSQL
7. **PostgreSQL** devuelve los resultados
8. **Backend** formatea la respuesta JSON
9. **Frontend** recibe JSON y actualiza la interfaz

---

## 3. Frontend (React + Vite)

### 3.1. Estructura de Archivos

```
frontend/
├── Dockerfile               # Imagen Docker para el frontend
├── package.json             # Dependencias y scripts
├── package-lock.json        # Versiones exactas (obligatorio para npm ci)
├── vite.config.ts           # Configuración de Vite (proxy a la API)
├── tsconfig.json            # Configuración de TypeScript
├── index.html               # HTML base (punto de entrada)
└── src/
    ├── main.tsx             # Punto de entrada React (ReactDOM.render)
    ├── app.tsx              # Componente principal de la aplicación
    ├── api.ts               # Funciones para llamar al backend
    └── styles.css           # Estilos CSS
```

### 3.2. Archivo: `vite.config.ts`

**Propósito**: Configurar el proxy para que `/api/*` se redirija al backend.

```typescript
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todas las peticiones que empiezan con /api/ se redirigen al backend
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

**¿Por qué es importante?**
- El frontend corre en `http://localhost:5173`
- El backend corre en `http://localhost:3000`
- Sin el proxy, habría problemas de CORS (Cross-Origin Resource Sharing)
- Con el proxy, el frontend hace `fetch('/api/health')` y Vite lo redirige automáticamente al backend

**Variables de entorno**:
- `API_PROXY_TARGET`: URL del backend (en Docker Compose se configura como `http://api:3000`)

### 3.3. Archivo: `src/main.tsx`

**Propósito**: Punto de entrada de la aplicación React.

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './styles.css';

// Renderiza el componente App dentro del div con id="root"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**Explicación**:
- `StrictMode`: Modo estricto de React que ayuda a detectar problemas
- `createRoot`: API moderna de React 19 para renderizar componentes
- Busca el elemento HTML con `id="root"` (definido en `index.html`)

### 3.4. Archivo: `src/api.ts`

**Propósito**: Funciones para comunicarse con el backend. **Única capa que hace `fetch()`**.

```typescript
// Tipos de datos que devuelve la API
export interface Item {
  id: number;
  title: string;
  createdAt: string;  // ISO 8601 timestamp
}

export interface Health {
  status: string;
  api: 'up';
  database: 'up' | 'down';
  timestamp: string;
}

// GET /api/health
export async function getHealth(): Promise<Health> {
  const response = await fetch('/api/health');
  const body = await response.json() as Health;
  if (body.api !== 'up') throw new Error('Respuesta de salud inválida');
  return body;
}

// GET /api/items
export async function listItems(): Promise<Item[]> {
  const response = await fetch('/api/items');
  if (!response.ok) throw new Error('No se pudo cargar la lista');
  return await response.json() as Item[];
}

// POST /api/items
export async function createItem(title: string): Promise<Item> {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  
  if (!response.ok) {
    // La API devuelve { error: "mensaje" } en caso de error 400
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? 'No se pudo guardar el mensaje');
  }
  
  return await response.json() as Item;
}
```

**Detalles importantes**:
- Todas las URLs son **relativas** (`/api/health` en vez de `http://...`)
- El proxy de Vite se encarga de redirigirlas al backend
- Manejo de errores: si la respuesta no es OK, lanza un error con mensaje descriptivo
- **Tipado fuerte**: TypeScript garantiza que los datos tienen la estructura esperada

### 3.5. Archivo: `src/app.tsx`

**Propósito**: Componente principal que renderiza la interfaz completa.

#### Estructura de Estados

```typescript
const [apiState, setApiState] = useState<LayerState>('checking');
const [dbState, setDbState] = useState<LayerState>('checking');
const [items, setItems] = useState<Item[]>([]);
const [listError, setListError] = useState<string | null>(null);
const [title, setTitle] = useState('');
const [formError, setFormError] = useState<string | null>(null);
const [saving, setSaving] = useState(false);
```

**Estados**:
- `apiState`: estado de la API (`'checking'`, `'up'`, `'down'`)
- `dbState`: estado de la base de datos
- `items`: lista de mensajes guardados
- `listError`: error al cargar la lista
- `title`: texto del input del formulario
- `formError`: error al guardar un mensaje
- `saving`: indica si se está guardando un mensaje (desactiva el botón)

#### Refresco Automático de Estado

```typescript
useEffect(() => {
  let active = true;
  
  async function checkHealth() {
    try {
      const health = await getHealth();
      if (!active) return;  // Evita actualizar estado si el componente se desmontó
      
      setApiState('up');
      setDbState(health.database);
      
      if (health.database === 'up') {
        void loadItems();  // Recarga la lista si la base está activa
      }
    } catch {
      if (!active) return;
      setApiState('down');
      setDbState('down');
    }
  }
  
  void checkHealth();  // Primera llamada inmediata
  const timer = setInterval(checkHealth, 5000);  // Cada 5 segundos
  
  return () => {
    active = false;
    clearInterval(timer);
  };
}, [loadItems]);
```

**¿Qué hace?**
1. Llama a `getHealth()` inmediatamente
2. Repite cada 5 segundos con `setInterval`
3. Si la API responde, actualiza los estados de API y base de datos
4. Si la base está `'up'`, recarga la lista de items
5. Al desmontar el componente, limpia el intervalo

**Bandera `active`**: Evita el warning de React "Can't perform a React state update on an unmounted component" cuando el componente se desmonta antes de que termine la petición asíncrona.

#### Envío del Formulario

```typescript
async function handleSubmit(event: FormEvent) {
  event.preventDefault();  // Evita que el navegador recargue la página
  setSaving(true);
  setFormError(null);
  
  try {
    await createItem(title);  // Guarda el mensaje
    setTitle('');  // Limpia el input
    await loadItems();  // Recarga la lista
  } catch (error) {
    setFormError((error as Error).message);  // Muestra el error
  } finally {
    setSaving(false);  // Reactiva el botón
  }
}
```

**Flujo**:
1. Usuario escribe un mensaje y presiona "Guardar"
2. Se desactiva el botón (`saving = true`)
3. Llama a `createItem()` del `api.ts`
4. Si tiene éxito:
   - Limpia el input
   - Recarga la lista completa
5. Si falla, muestra el error
6. Siempre reactiva el botón al final

#### Renderizado de la Interfaz

```typescript
return (
  <div className="layout">
    {/* Cabecera */}
    <header className="topbar">
      <h1>Slackless</h1>
      <p className="subtitle">Walking skeleton: interfaz → API → base de datos</p>
    </header>

    {/* Barra lateral con estado del sistema */}
    <aside className="sidebar">
      <section aria-labelledby="estado-titulo">
        <h2 id="estado-titulo">Estado del sistema</h2>
        <div className="status-grid">
          <StatusCard name="Frontend" state="up" />
          <StatusCard name="API" state={apiState} />
          <StatusCard name="Base de datos" state={dbState} />
        </div>
      </section>
    </aside>

    {/* Área principal: formulario y lista */}
    <main className="content">
      <section aria-labelledby="items-titulo">
        <h2 id="items-titulo">Mensajes</h2>

        {/* Formulario */}
        <form className="item-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe un mensaje"
            maxLength={120}
          />
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </form>

        {/* Errores */}
        {formError && <p className="error" role="alert">{formError}</p>}
        {listError && <p className="error" role="alert">{listError}</p>}

        {/* Lista de mensajes */}
        {items.length === 0 && !listError ? (
          <p className="empty">Todavía no hay mensajes guardados.</p>
        ) : (
          <ul className="item-list">
            {items.map((item) => (
              <li key={item.id}>
                <span className="item-title">{item.title}</span>
                <time dateTime={item.createdAt}>
                  {new Date(item.createdAt).toLocaleString('es-CO')}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  </div>
);
```

**Características de accesibilidad**:
- `aria-labelledby`: Asocia secciones con sus títulos
- `role="alert"`: Anuncia errores a lectores de pantalla
- `<time dateTime>`: Formato semántico para fechas

---

## 4. Backend (NestJS)

### 4.1. Estructura de Archivos

```
backend/
├── Dockerfile
├── package.json
├── package-lock.json
├── tsconfig.json              # Configuración de TypeScript
├── tsconfig.build.json        # Configuración para compilación
├── vitest.config.mts          # Configuración de Vitest (testing)
├── test/
│   └── items.test.ts          # Tests end-to-end
└── src/
    ├── main.ts                # Punto de entrada (bootstrap)
    ├── app_module.ts          # Módulo raíz de NestJS
    ├── config/
    │   └── env.ts             # Validación de variables de entorno
    ├── common/
    │   ├── validation_error.ts         # Error de validación personalizado
    │   └── app_exception_filter.ts     # Manejo global de errores
    ├── db/
    │   ├── db_module.ts       # Módulo de base de datos
    │   └── db_service.ts      # Pool de conexiones PostgreSQL
    └── modules/
        ├── health/
        │   ├── health_module.ts
        │   └── health_controller.ts    # GET /api/health
        └── items/
            ├── item_module.ts
            ├── item_model.ts           # Tipos TypeScript
            ├── item_repository.ts      # Acceso a datos (SQL)
            ├── item_service.ts         # Lógica de negocio
            └── item_controller.ts      # Endpoints HTTP
```

### 4.2. Archivo: `src/main.ts`

**Propósito**: Inicializa la aplicación NestJS y la pone a escuchar en el puerto configurado.

```typescript
import 'dotenv/config';  // Carga variables de .env ANTES de cualquier otra cosa
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app_module';
import { loadEnv } from './config/env';

async function bootstrap() {
  const env = loadEnv();  // Valida que todas las variables existan
  const app = await NestFactory.create(AppModule);

  // Cierre ordenado: llama onModuleDestroy al recibir SIGTERM/SIGINT
  app.enableShutdownHooks();

  // 0.0.0.0: necesario dentro de Docker para ser accesible desde fuera
  await app.listen(env.port, '0.0.0.0');
}

bootstrap().catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});
```

**Detalles**:
- `'dotenv/config'`: Carga el archivo `.env` automáticamente
- `enableShutdownHooks()`: Garantiza que las conexiones se cierren correctamente
- `0.0.0.0`: Escucha en todas las interfaces de red (dentro de Docker es obligatorio)

### 4.3. Archivo: `src/config/env.ts`

**Propósito**: Validar que todas las variables de entorno obligatorias existan al iniciar la aplicación.

```typescript
export interface Env {
  port: number;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
}

const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  // Verifica que TODAS las variables existan
  const missing = requiredVars.filter((name) => !source[name]);
  
  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missing.join(', ')}. ` +
        'Revisa tu archivo .env (ver .env.example).',
    );
  }

  return {
    port: Number(source.PORT ?? 3000),
    db: {
      host: source.DB_HOST as string,
      port: Number(source.DB_PORT),
      name: source.DB_NAME as string,
      user: source.DB_USER as string,
      password: source.DB_PASSWORD as string,
    },
  };
}
```

**¿Por qué es importante?**
- **Falla rápido**: Si falta una variable, la aplicación no arranca
- **Mensaje claro**: Indica exactamente qué variables faltan
- **Tipado**: El resto del código usa el objeto `Env` con tipos garantizados

### 4.4. Archivo: `src/app_module.ts`

**Propósito**: Módulo raíz que une todos los submódulos de la aplicación.

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from './common/app_exception_filter';
import { DbModule } from './db/db_module';
import { HealthModule } from './modules/health/health_module';
import { ItemModule } from './modules/items/item_module';

@Module({
  imports: [
    DbModule,      // Conexión a PostgreSQL
    HealthModule,  // Endpoints de salud
    ItemModule,    // Endpoints de items
  ],
  providers: [
    // Registra el filtro de excepciones global
    { provide: APP_FILTER, useClass: AppExceptionFilter },
  ],
})
export class AppModule {}
```

**Patrón de módulos de NestJS**:
- Cada módulo encapsula una funcionalidad
- Se importan en el módulo raíz
- Nest se encarga de la inyección de dependencias automáticamente

### 4.5. Archivo: `src/common/validation_error.ts`

**Propósito**: Error personalizado para errores de validación de negocio.

```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

**¿Por qué un error personalizado?**
- Separar errores de **validación** (título vacío, muy largo) de errores técnicos (base caída)
- El filtro de excepciones lo convierte automáticamente en HTTP 400
- El servicio puede lanzar `ValidationError` sin saber nada de HTTP

### 4.6. Archivo: `src/common/app_exception_filter.ts`

**Propósito**: Convertir errores de la aplicación en respuestas HTTP consistentes.

```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { ValidationError } from './validation_error';

interface JsonResponse {
  status(code: number): { json(body: unknown): void };
}

@Catch()  // Captura TODOS los errores
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<JsonResponse>();

    // Error de validación → 400 Bad Request
    if (exception instanceof ValidationError) {
      response.status(400).json({ error: exception.message });
      return;
    }

    // HttpException de Nest (NotFoundException, etc.) → su código HTTP
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      response.status(exception.getStatus()).json(
        typeof body === 'string' ? { error: body } : body
      );
      return;
    }

    // Error desconocido → 500 Internal Server Error
    // Solo se loguea, no se envía al cliente (seguridad)
    this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    response.status(500).json({ error: 'Error interno del servidor' });
  }
}
```

**Estrategia de manejo de errores**:
1. `ValidationError` → HTTP 400 con mensaje descriptivo
2. `HttpException` (de Nest) → su código HTTP correspondiente
3. Cualquier otro error → HTTP 500 genérico (sin filtrar detalles internos)

**Seguridad**: Los errores internos NO se envían al cliente, solo se loguean.

### 4.7. Archivo: `src/db/db_service.ts`

**Propósito**: Gestionar el pool de conexiones a PostgreSQL.

```typescript
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { loadEnv } from '../config/env';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DbService.name);
  private readonly pool: Pool;

  constructor() {
    const { db } = loadEnv();
    this.pool = new Pool({
      host: db.host,
      port: db.port,
      user: db.user,
      password: db.password,
      database: db.name,
      connectionTimeoutMillis: 5000,  // Timeout de 5 segundos
    });

    // Maneja errores en conexiones inactivas (evita que Node crashee)
    this.pool.on('error', (error) => {
      this.logger.error(`Error en una conexión inactiva: ${error.message}`);
    });
  }

  // Método principal: ejecuta queries con parámetros
  query<T extends QueryResultRow>(
    text: string,
    params: unknown[] = []
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  // Verifica conectividad
  async check() {
    const result = await this.pool.query(
      'SELECT current_database() AS "database", current_user AS "user", now() AS "serverTime"',
    );
    return result.rows[0] as { database: string; user: string; serverTime: string };
  }

  // Crea la tabla si no existe (idempotente)
  private async ensureSchema() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id         SERIAL PRIMARY KEY,
        title      VARCHAR(120) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`);
  }

  // Lifecycle hook: se ejecuta al iniciar el módulo
  async onModuleInit() {
    try {
      const info = await this.check();
      this.logger.log(`Conexión OK -> base "${info.database}" como usuario "${info.user}"`);
      await this.ensureSchema();
      this.logger.log('Esquema verificado (tabla items lista)');
    } catch (error) {
      // No tumba la app: el pool reintenta automáticamente
      this.logger.error(`No se pudo preparar la base de datos: ${(error as Error).message}`);
    }
  }

  // Lifecycle hook: se ejecuta al cerrar la aplicación
  async onModuleDestroy() {
    await this.pool.end();
  }
}
```

**Decisiones de diseño**:

1. **Pool de conexiones**: Mantiene varias conexiones abiertas para reutilizarlas (más eficiente que abrir/cerrar cada vez)
2. **Parámetros obligatorios**: Nunca se concatena SQL directamente (evita SQL injection)
3. **Manejo de errores en conexiones inactivas**: Sin el listener `.on('error')`, Node crashearía si una conexión se cierra inesperadamente
4. **CREATE TABLE IF NOT EXISTS**: Idempotente, se puede ejecutar múltiples veces sin problema
5. **No tumba la app si falla**: Si la base no está disponible al iniciar, loguea el error pero la app sigue corriendo (útil para healthchecks)

### 4.8. Módulo Health

#### `src/modules/health/health_controller.ts`

**Propósito**: Endpoints para verificar el estado del sistema.

```typescript
import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { DbService } from '../../db/db_service';

@Controller()
export class HealthController {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  // GET /api/health
  @Get('api/health')
  async health() {
    const timestamp = new Date().toISOString();
    
    try {
      await this.db.check();  // Intenta conectar a la base
      return { status: 'ok', api: 'up', database: 'up', timestamp };
    } catch {
      // HTTP 503: servicio no disponible (la API vive pero no puede trabajar)
      throw new ServiceUnavailableException({
        status: 'degraded',
        api: 'up',
        database: 'down',
        timestamp,
      });
    }
  }

  // GET /health/db (endpoint de diagnóstico adicional)
  @Get('health/db')
  async healthDb() {
    try {
      const info = await this.db.check();
      return { status: 'ok', ...info };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'error',
        message: (error as Error).message,
      });
    }
  }
}
```

**Estrategia de healthcheck**:
- Si la base responde → HTTP 200 con `database: 'up'`
- Si la base falla → HTTP 503 con `database: 'down'` (pero con cuerpo JSON útil)
- El frontend puede distinguir entre "API caída" (no responde) y "base caída" (responde 503 con JSON)

### 4.9. Módulo Items

#### `src/modules/items/item_model.ts`

**Propósito**: Definir los tipos de datos del dominio.

```typescript
// Lo que ve el resto del sistema
export interface Item {
  id: number;
  title: string;
  createdAt: string;  // ISO 8601 timestamp (JSON no tiene tipo Date)
}

// Lo que hace falta para crear un item
export interface NewItem {
  title: string;
}
```

**Separación de tipos**:
- `Item`: incluye `id` y `createdAt` (generados por la base)
- `NewItem`: solo lo que el usuario proporciona

#### `src/modules/items/item_repository.ts`

**Propósito**: Única capa que ejecuta SQL. Sin lógica de negocio.

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../../db/db_service';
import { Item, NewItem } from './item_model';

// Interfaz del repositorio (contrato)
export interface ItemRepository {
  findAll(): Promise<Item[]>;
  create(newItem: NewItem): Promise<Item>;
}

// Token para inyección de dependencias (las interfaces no existen en runtime)
export const itemRepositoryToken = Symbol('ItemRepository');

// Forma de las filas tal como salen de PostgreSQL (snake_case)
interface ItemRow {
  id: number;
  title: string;
  created_at: Date;
}

// Convierte snake_case → camelCase
function toItem(row: ItemRow): Item {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at.toISOString(),
  };
}

// Implementación real con PostgreSQL
@Injectable()
export class PgItemRepository implements ItemRepository {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async findAll(): Promise<Item[]> {
    const result = await this.db.query<ItemRow>(
      'SELECT id, title, created_at FROM items ORDER BY id',
    );
    return result.rows.map(toItem);
  }

  async create(newItem: NewItem): Promise<Item> {
    const result = await this.db.query<ItemRow>(
      'INSERT INTO items (title) VALUES ($1) RETURNING id, title, created_at',
      [newItem.title],
    );
    return toItem(result.rows[0]);
  }
}
```

**Decisiones de diseño**:

1. **Interfaz `ItemRepository`**: Permite cambiar la implementación (en tests usamos una versión en memoria)
2. **SQL explícito**: No usamos ORM, escribimos SQL directo (más control, más fácil de debuggear)
3. **Parámetros ($1, $2)**: Nunca concatenamos valores (evita SQL injection)
4. **RETURNING**: PostgreSQL devuelve los valores generados (`id`, `created_at`) sin necesidad de hacer otra query
5. **Traducción snake_case ↔ camelCase**: PostgreSQL usa `created_at`, JavaScript usa `createdAt`

#### `src/modules/items/item_service.ts`

**Propósito**: Lógica de negocio y validaciones. No sabe nada de HTTP ni SQL.

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ValidationError } from '../../common/validation_error';
import { Item } from './item_model';
import { ItemRepository, itemRepositoryToken } from './item_repository';

const maxTitleLength = 120;

@Injectable()
export class ItemService {
  constructor(
    @Inject(itemRepositoryToken) private readonly repository: ItemRepository
  ) {}

  list(): Promise<Item[]> {
    return this.repository.findAll();
  }

  create(rawTitle: unknown): Promise<Item> {
    // Validación 1: tipo y no vacío
    if (typeof rawTitle !== 'string' || rawTitle.trim() === '') {
      throw new ValidationError('El mensaje es obligatorio');
    }

    const title = rawTitle.trim();

    // Validación 2: longitud máxima
    if (title.length > maxTitleLength) {
      throw new ValidationError(
        `El mensaje no puede superar los ${maxTitleLength} caracteres`
      );
    }

    return this.repository.create({ title });
  }
}
```

**Reglas de negocio**:
1. El título es **obligatorio**
2. Se hace `trim()` automáticamente (elimina espacios al inicio/final)
3. No puede superar 120 caracteres
4. Si falla una validación, lanza `ValidationError` (el filtro de excepciones lo convierte en HTTP 400)

**¿Por qué `rawTitle: unknown`?**
- Viene directo del body HTTP, no hay garantía de tipo
- TypeScript obliga a verificar el tipo antes de usarlo
- Más seguro que confiar en el tipo declarado

#### `src/modules/items/item_controller.ts`

**Propósito**: Traducir HTTP ↔ servicio. Sin lógica de negocio.

```typescript
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ItemService } from './item_service';

@Controller('api/items')
export class ItemController {
  constructor(@Inject(ItemService) private readonly service: ItemService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  create(@Body() body: { title?: unknown } | undefined) {
    // Pasa el título al servicio (que valida)
    return this.service.create(body?.title);
  }
}
```

**Decisiones**:
- El controller solo delega al servicio
- `@Body() body: { title?: unknown }`: el body puede no tener `title` (el servicio valida)
- Nest convierte automáticamente el resultado en JSON
- Nest devuelve HTTP 201 automáticamente en endpoints `@Post()`

#### `src/modules/items/item_module.ts`

**Propósito**: Ensamblar el módulo de items.

```typescript
import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db_module';
import { ItemController } from './item_controller';
import { PgItemRepository, itemRepositoryToken } from './item_repository';
import { ItemService } from './item_service';

@Module({
  imports: [DbModule],  // Necesita DbService
  controllers: [ItemController],
  providers: [
    ItemService,
    // Registra la implementación real del repositorio
    { provide: itemRepositoryToken, useClass: PgItemRepository },
  ],
})
export class ItemModule {}
```

**Inyección de dependencias**:
- `ItemService` recibe `itemRepositoryToken` → Nest inyecta `PgItemRepository`
- En tests, se reemplaza con `InMemoryItemRepository`

---

## 5. Base de Datos (PostgreSQL)

### 5.1. Esquema

```sql
CREATE TABLE IF NOT EXISTS items (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columnas**:
- `id`: Autoincremental (PRIMARY KEY)
- `title`: Texto de máximo 120 caracteres (NOT NULL)
- `created_at`: Timestamp con zona horaria (UTC), generado automáticamente

**Tipos de datos**:
- `SERIAL`: Equivalente a `INTEGER AUTO_INCREMENT` en MySQL
- `VARCHAR(120)`: Cadena de longitud variable
- `TIMESTAMPTZ`: Timestamp con zona horaria (siempre se guarda en UTC)

### 5.2. Queries

#### Listar todos los items

```sql
SELECT id, title, created_at FROM items ORDER BY id;
```

#### Crear un item

```sql
INSERT INTO items (title) VALUES ($1) RETURNING id, title, created_at;
```

**RETURNING**: PostgreSQL devuelve los valores de la fila insertada (incluye el `id` generado y `created_at`)

### 5.3. Conexión

**Driver**: `pg` (node-postgres)

**Pool de conexiones**:
```typescript
new Pool({
  host: 'localhost',           // o IP de la VM
  port: 5432,
  user: 'g2_team_4_user',
  password: '...',
  database: 'g2-team-4-db',
  connectionTimeoutMillis: 5000,
});
```

**Ventajas del pool**:
- Mantiene N conexiones abiertas
- Las reutiliza (más rápido que abrir/cerrar cada vez)
- Gestiona automáticamente la cola de peticiones

---

## 6. Docker y Despliegue

### 6.1. Archivo: `docker-compose.yml`

**Propósito**: Orquestar los contenedores del backend y frontend.

```yaml
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: g2-team-4-api
    container_name: g2-team-4-api-1
    ports:
      - "${API_PORT:-3000}:3000"
    environment:
      PORT: 3000
      DB_HOST: ${DB_HOST:?Falta DB_HOST en el archivo .env}
      DB_PORT: ${DB_PORT:-5432}
      DB_NAME: ${DB_NAME:?Falta DB_NAME en el archivo .env}
      DB_USER: ${DB_USER:?Falta DB_USER en el archivo .env}
      DB_PASSWORD: ${DB_PASSWORD:?Falta DB_PASSWORD en el archivo .env}
    volumes:
      - ./backend:/app
      - /app/node_modules
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:3000/api/health').then(r => process.exit(r.ok ? 0 : 1))"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped

  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    image: g2-team-4-web
    container_name: g2-team-4-web-1
    ports:
      - "${WEB_PORT:-5173}:5173"
    environment:
      API_PROXY_TARGET: http://api:3000
      WATCH_POLLING: ${WATCH_POLLING:-false}
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
```

**Detalles importantes**:

1. **Variables de entorno con validación**:
   - `${DB_HOST:?Falta DB_HOST...}`: Falla si no está definida
   - `${API_PORT:-3000}`: Usa 3000 si no está definida

2. **Volúmenes**:
   - `./backend:/app`: Monta el código fuente (hot reload en desarrollo)
   - `/app/node_modules`: Volumen anónimo que evita sobrescribir node_modules del contenedor

3. **Healthcheck**:
   - Verifica cada 10 segundos que `/api/health` responda
   - Si falla 3 veces seguidas, marca el contenedor como "unhealthy"

4. **depends_on + condition**:
   - `web` espera a que `api` esté `healthy` antes de arrancar
   - Evita que el frontend arranque antes que el backend

5. **restart: unless-stopped**:
   - Reinicia automáticamente si el contenedor crashea
   - No reinicia si se detuvo manualmente

### 6.2. Archivo: `backend/Dockerfile`

```dockerfile
FROM node:22-alpine

WORKDIR /app

# 1. Copiar solo los manifiestos primero
COPY package.json package-lock.json ./

# 2. Instalar dependencias (capa cacheada si no cambian los manifiestos)
RUN npm ci

# 3. Copiar el código fuente
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

**Optimización de caché**:
- Si `package.json` no cambia, Docker reutiliza la capa de `npm ci`
- Rebuilds son mucho más rápidos (segundos en vez de minutos)

**¿Por qué `npm ci` y no `npm install`?**
- `npm ci` es más rápido
- Instala exactamente lo que dice `package-lock.json` (reproducible)
- Falla si el lock no coincide con `package.json` (detecta inconsistencias)

### 6.3. Archivo: `frontend/Dockerfile`

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173
# --host 0.0.0.0: Vite solo escucha localhost por defecto, esto lo hace accesible desde fuera
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

**`--host 0.0.0.0`**:
- Sin esto, Vite solo escucha en `localhost` del contenedor
- No sería accesible desde el host ni desde otros contenedores

### 6.4. Archivo: `docker-compose.local-db.yml`

**Propósito**: Agregar un contenedor PostgreSQL para pruebas locales.

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: g2-team-4-db-1
    environment:
      POSTGRES_DB: g2-team-4-db
      POSTGRES_USER: g2_team_4_user
      POSTGRES_PASSWORD: local_password
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U g2_team_4_user -d g2-team-4-db"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  api:
    depends_on:
      db:
        condition: service_healthy

volumes:
  db-data:
```

**Uso**:
```bash
docker compose -f docker-compose.yml -f docker-compose.local-db.yml up --build
```

**Compose merge**:
- `-f docker-compose.yml`: define `api` y `web`
- `-f docker-compose.local-db.yml`: agrega `db` y hace que `api` dependa de `db`

**Volumen `db-data`**:
- Persiste los datos entre reinicios
- Para borrar: `docker compose down -v`

---

## 7. Flujo de Datos Completo

### Ejemplo: Guardar un mensaje

**1. Usuario escribe "Hola mundo" y presiona "Guardar"**

**Frontend (`app.tsx`)**:
```typescript
async function handleSubmit(event: FormEvent) {
  event.preventDefault();
  setSaving(true);
  try {
    await createItem('Hola mundo');
    // ...
  }
}
```

**2. Llama a la función `createItem` de `api.ts`**

```typescript
export async function createItem(title: string): Promise<Item> {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Hola mundo' }),
  });
  // ...
}
```

**3. Vite proxy redirige `/api/items` → `http://api:3000/api/items`**

**4. Backend recibe la petición en `ItemController`**

```typescript
@Post()
create(@Body() body: { title?: unknown }) {
  return this.service.create(body?.title);  // body.title = 'Hola mundo'
}
```

**5. `ItemService` valida el título**

```typescript
create(rawTitle: unknown): Promise<Item> {
  if (typeof rawTitle !== 'string' || rawTitle.trim() === '') {
    throw new ValidationError('El mensaje es obligatorio');
  }
  const title = rawTitle.trim();  // 'Hola mundo'
  if (title.length > 120) {
    throw new ValidationError('...');
  }
  return this.repository.create({ title });
}
```

**6. `PgItemRepository` ejecuta el INSERT**

```typescript
async create(newItem: NewItem): Promise<Item> {
  const result = await this.db.query<ItemRow>(
    'INSERT INTO items (title) VALUES ($1) RETURNING id, title, created_at',
    ['Hola mundo'],
  );
  return toItem(result.rows[0]);
}
```

**7. PostgreSQL ejecuta**:
```sql
INSERT INTO items (title) VALUES ('Hola mundo') RETURNING id, title, created_at;
```

Devuelve:
```
 id |   title    |         created_at
----+------------+----------------------------
  5 | Hola mundo | 2026-11-19 05:30:12.123+00
```

**8. El repositorio convierte la fila a `Item`**:
```typescript
{
  id: 5,
  title: 'Hola mundo',
  createdAt: '2026-11-19T05:30:12.123Z'
}
```

**9. El servicio devuelve el `Item` al controller**

**10. Nest convierte el `Item` a JSON y responde HTTP 201**:
```json
{
  "id": 5,
  "title": "Hola mundo",
  "createdAt": "2026-11-19T05:30:12.123Z"
}
```

**11. Frontend recibe la respuesta**:
```typescript
const item = await createItem('Hola mundo');
// item = { id: 5, title: 'Hola mundo', createdAt: '...' }
```

**12. Limpia el input y recarga la lista**:
```typescript
setTitle('');
await loadItems();  // GET /api/items
```

**13. La interfaz se actualiza automáticamente** (React re-renderiza)

---

## 8. Testing

### 8.1. Archivo: `backend/test/items.test.ts`

**Propósito**: Tests end-to-end del walking skeleton sin necesidad de PostgreSQL.

```typescript
import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app_module';
import { DbService } from '../src/db/db_service';
import { Item, NewItem } from '../src/modules/items/item_model';
import { ItemRepository, itemRepositoryToken } from '../src/modules/items/item_repository';

// Implementación del repositorio en memoria (sin PostgreSQL)
class InMemoryItemRepository implements ItemRepository {
  private items: Item[] = [];

  async findAll(): Promise<Item[]> {
    return [...this.items];
  }

  async create(newItem: NewItem): Promise<Item> {
    const item: Item = {
      id: this.items.length + 1,
      title: newItem.title,
      createdAt: new Date().toISOString(),
    };
    this.items.push(item);
    return item;
  }
}

let app: INestApplication;

// Construye la app real reemplazando solo la base y el repositorio
async function buildApp(databaseUp: boolean): Promise<INestApplication> {
  const fakeDb = {
    check: async () => {
      if (!databaseUp) throw new Error('base caída (simulada)');
      return { database: 'test', user: 'test', serverTime: new Date().toISOString() };
    },
  };

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(DbService)
    .useValue(fakeDb)
    .overrideProvider(itemRepositoryToken)
    .useValue(new InMemoryItemRepository())
    .compile();

  app = moduleRef.createNestApplication({ logger: false });
  await app.init();
  return app;
}

afterEach(async () => {
  await app?.close();
});

describe('walking skeleton', () => {
  it('GET /api/health responde 200 con database:"up"', async () => {
    const server = (await buildApp(true)).getHttpServer();

    const response = await request(server).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', api: 'up', database: 'up' });
    expect(response.body.timestamp).toBeTypeOf('string');
  });

  it('GET /api/health responde 503 con database:"down" si la base falla', async () => {
    const server = (await buildApp(false)).getHttpServer();

    const response = await request(server).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({ api: 'up', database: 'down' });
  });

  it('crea un item y luego aparece en el listado', async () => {
    const server = (await buildApp(true)).getHttpServer();

    const created = await request(server).post('/api/items').send({ title: '  Mi item  ' });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe('Mi item');  // el servicio hace trim

    const list = await request(server).get('/api/items');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).toMatchObject({ id: 1, title: 'Mi item' });
  });

  it('POST con título vacío responde 400', async () => {
    const server = (await buildApp(true)).getHttpServer();

    const response = await request(server).post('/api/items').send({ title: '   ' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTypeOf('string');
  });
});
```

**Estrategia de testing**:

1. **Reemplazar solo lo necesario**: PostgreSQL y el repositorio
2. **Mantener el resto real**: módulos, servicios, controllers, filtros de excepciones
3. **Tests independientes**: cada test construye su propia app
4. **Sin efectos secundarios**: datos en memoria, se descartan al terminar cada test

**¿Por qué no mockeamos todo?**
- Los tests verifican que la **integración** entre capas funciona
- Si mockeamos todo, solo verificamos que los mocks funcionan
- Con esta estrategia, detectamos errores de integración reales

### 8.2. Correr los tests

```bash
cd backend
npm test
```

**Salida esperada**:
```
 ✓ test/items.test.ts (4 tests) 211ms
   ✓ walking skeleton > GET /api/health responde 200 con database:"up" 176ms
   ✓ walking skeleton > GET /api/health responde 503 con database:"down" si la base falla 7ms
   ✓ walking skeleton > crea un item y luego aparece en el listado 22ms
   ✓ walking skeleton > POST con título vacío responde 400 6ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Duration  1.57s
```

---

## 9. Configuración y Variables de Entorno

### 9.1. Archivo: `.env.example` (para VM con base real)

```env
# Puertos externos (ajusta según tu equipo para no chocar con otros)
WEB_PORT=5174
API_PORT=3004

# Base de datos compartida en la VM
DB_HOST=localhost              # o la IP del servidor PostgreSQL
DB_PORT=5432
DB_NAME=g2-team-4-db
DB_USER=g2_team_4_user
DB_PASSWORD=                   # completar con la contraseña real

# Solo si necesitas hot reload en Windows/macOS dentro de Docker
WATCH_POLLING=false
```

### 9.2. Archivo: `.env.local.example` (para pruebas locales con base desechable)

```env
WEB_PORT=5173
API_PORT=3000

DB_HOST=db
DB_PORT=5432
DB_NAME=g2-team-4-db
DB_USER=g2_team_4_user
DB_PASSWORD=local_password

WATCH_POLLING=false
```

### 9.3. Variables importantes

| Variable | Descripción | Valores |
|----------|-------------|---------|
| `WEB_PORT` | Puerto externo del frontend | 5173 (dev) / 5174 (prod) |
| `API_PORT` | Puerto externo del backend | 3000 (dev) / 3004 (prod) |
| `DB_HOST` | Host de PostgreSQL | `db` (Docker local) / `localhost` (VM) / IP |
| `DB_PORT` | Puerto de PostgreSQL | 5432 (estándar) |
| `DB_NAME` | Nombre de la base de datos | `g2-team-4-db` |
| `DB_USER` | Usuario de PostgreSQL | `g2_team_4_user` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | (nunca subir a Git) |
| `API_PROXY_TARGET` | URL del backend para el proxy de Vite | `http://api:3000` |
| `WATCH_POLLING` | Forzar polling para hot reload | `false` / `true` |

### 9.4. Seguridad

**⚠️ NUNCA subir `.env` a Git**

- El `.env` contiene credenciales reales
- Ya está en `.gitignore`
- Solo subir `.env.example` y `.env.local.example` (plantillas sin contraseñas)

**Verificar antes de hacer commit**:
```bash
git status
# .env NO debe aparecer en la lista
```

---

## 10. Comandos de Referencia Rápida

### Desarrollo Local

```bash
# Generar lock files y correr tests
cd backend && npm install && npm run typecheck && npm test
cd ../frontend && npm install && npm run typecheck

# Levantar con base desechable
cp .env.local.example .env
docker compose -f docker-compose.yml -f docker-compose.local-db.yml up --build

# Detener y borrar todo (incluye datos de la base)
docker compose -f docker-compose.yml -f docker-compose.local-db.yml down -v
```

### Despliegue en VM

```bash
# Configurar
cp .env.example .env
nano .env  # completar DB_HOST, DB_PASSWORD y puertos

# Levantar
docker compose up -d --build

# Ver logs
docker compose logs -f api
docker compose logs -f web

# Ver estado
docker compose ps

# Detener
docker compose down
```

### Testing

```bash
# Backend (desde carpeta backend/)
npm test                    # Corre todos los tests
npm run typecheck           # Verifica tipos TypeScript

# Frontend (desde carpeta frontend/)
npm run typecheck           # Verifica tipos TypeScript
```

### Docker

```bash
# Ver contenedores corriendo
docker compose ps

# Ver logs en vivo
docker compose logs -f

# Reiniciar un servicio
docker compose restart api

# Rebuild sin caché
docker compose build --no-cache api
docker compose up -d

# Limpiar todo (contenedores, volúmenes, imágenes)
docker compose down -v --rmi all
```

---

## 11. Troubleshooting

### Problema: "Connection timeout" al conectar a la base

**Causas posibles**:
1. `DB_HOST` incorrecto
2. PostgreSQL no está corriendo
3. Firewall bloquea el puerto 5432
4. Base de datos no es accesible desde Docker

**Soluciones**:
```bash
# Verificar que PostgreSQL esté corriendo
docker compose ps

# Probar conexión desde el contenedor
docker compose exec api sh
apk add postgresql-client
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Si la base está en la misma VM pero "localhost" no funciona
# Cambiar en .env: DB_HOST=host.docker.internal
```

### Problema: "port is already allocated"

**Causa**: Otro proceso usa el puerto.

**Solución**:
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :5173     # Windows
lsof -i :5173                     # Linux/Mac

# Cambiar el puerto en .env
WEB_PORT=5174
API_PORT=3004
```

### Problema: Frontend no recarga automáticamente al editar archivos

**Causa**: Polling de archivos no funciona bien en volúmenes Docker en Windows/macOS.

**Solución**:
```bash
# En .env:
WATCH_POLLING=true
```

### Problema: "npm ci" falla con "package-lock.json does not match package.json"

**Causa**: Los archivos están desincronizados.

**Solución**:
```bash
# Regenerar el lock
rm package-lock.json
npm install

# Rebuild Docker
docker compose up --build
```

### Problema: Tests fallan con "Cannot find module"

**Causa**: Dependencias no instaladas.

**Solución**:
```bash
cd backend
npm install
npm test
```

---

## 12. Próximos Pasos (después del Walking Skeleton)

1. **Autenticación**: Login/logout, sesiones
2. **Canales**: Organizar mensajes en canales
3. **Usuarios**: Perfiles, avatares
4. **Tiempo real**: WebSockets para actualizaciones en vivo
5. **Reacciones**: Emoji en mensajes
6. **Hilos**: Respuestas a mensajes
7. **Búsqueda**: Buscar mensajes por texto
8. **Archivos**: Subir imágenes/documentos

---

## Conclusión

Este walking skeleton es una **base sólida** para construir el sistema completo:

✅ **Arquitectura en capas** bien definida  
✅ **Separación de responsabilidades** (controller → service → repository)  
✅ **Tipado fuerte** con TypeScript en frontend y backend  
✅ **Testing** automatizado sin dependencias externas  
✅ **Docker** para despliegue consistente  
✅ **Healthchecks** para monitoreo del sistema  
✅ **Manejo de errores** centralizado y consistente  
✅ **SQL parametrizado** (seguro contra inyecciones)  

Cada decisión de diseño está pensada para:
- **Facilitar el testing**
- **Mantener el código limpio y legible**
- **Escalar sin refactorizar toda la base**
- **Detectar errores rápido (fail fast)**

---

**Equipo 4 - G2**  
Ingeniería de Software I - 2026-II  
Universidad Nacional de Colombia
