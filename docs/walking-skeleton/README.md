# Slackless — Walking Skeleton

## ¿Qué es?

La versión mínima del sistema que **atraviesa todas las capas** (interfaz → API → base de datos): una página donde se escribe un mensaje, se guarda en la base de datos y se listan los mensajes guardados. No tiene más lógica de negocio.

Stack: React 19 + Vite + TypeScript · NestJS 11 (Node 22) + TypeScript · PostgreSQL con el driver `pg` (patrón Repository, SQL parametrizado, sin ORM) · Vitest + Supertest · Docker Compose v2.

La base de datos **no** se levanta con Docker: se usa la base del equipo en la VM (`g2-team-4-db`, usuario `g2_team_4_user`). La API crea la tabla `items` al arrancar si no existe.

## Requisitos

- Docker (con Compose v2).
- Node.js 22 y npm, solo para generar los `package-lock.json` y correr tests fuera de Docker.

## 1. Primera vez: lock files y tests

Los Dockerfile usan `npm ci`, que exige los `package-lock.json` (hay que subirlos a Git):

```bash
(cd backend && npm install && npm run typecheck && npm test)
(cd frontend && npm install && npm run typecheck)
```

## 2. Prueba local con base desechable

```bash
cp .env.local.example .env
docker compose -f docker-compose.yml -f docker-compose.local-db.yml up --build
```

Abre http://localhost:5173: las tres tarjetas deben ponerse en verde; guarda un mensaje y recarga la página. Para borrar todo: `docker compose -f docker-compose.yml -f docker-compose.local-db.yml down -v`.

## 3. Prueba / despliegue con la base real

```bash
cp .env.example .env     # completa DB_HOST, DB_PASSWORD y puertos propios
docker compose up -d --build
docker compose ps
docker compose logs api  # debe verse "Conexión OK" y "Esquema verificado"
```

Desde tu computador, la base remota se alcanza con un túnel de PuTTY (puerto local 5433 → `localhost:5432` de la VM); en ese caso usa `DB_HOST=host.docker.internal` y `DB_PORT=5433`.

Si la base está en la misma VM y la IP no responde desde el contenedor, prueba `DB_HOST=host.docker.internal`.

## URLs

| Qué | URL |
|---|---|
| App (frontend) | http://localhost:5173 (o `WEB_PORT`) |
| Salud de la API (por el proxy) | http://localhost:5173/api/health |
| Salud de la API (directo, solo desde la misma máquina) | http://localhost:3000/api/health |
| Salud + datos de la base | http://localhost:3000/health/db |
| Listar / crear mensajes | `GET` / `POST` http://localhost:3000/api/items |

## Estructura

```
.
├── docker-compose.yml            # api + web (base remota)
├── docker-compose.local-db.yml   # solo pruebas locales: agrega un Postgres temporal
├── .env.example / .env.local.example
├── backend/
│   ├── src/main.ts, app_module.ts
│   ├── src/config/env.ts         # lee y valida variables de entorno
│   ├── src/common/               # ValidationError + filtro de excepciones
│   ├── src/db/                   # DbService: pool de pg, check() y creación de la tabla
│   ├── src/modules/health/       # GET /api/health y GET /health/db
│   ├── src/modules/items/        # model, repository (SQL), service (reglas), controller (HTTP)
│   └── test/items.test.ts
└── frontend/
    ├── vite.config.ts            # proxy /api -> API_PROXY_TARGET
    └── src/                      # main.tsx, app.tsx, api.ts, styles.css
```

## Comandos útiles

```bash
docker compose logs -f api   # logs en vivo (o web)
docker compose ps
docker compose down
```

> Si agregas una dependencia, reconstruye con `docker compose up --build`.
> Si el frontend no recarga al guardar en Windows/macOS, pon `WATCH_POLLING=true` en `.env`.
> Fuera de Docker, el backend lee `backend/.env` (ver `backend/.env.example`).
