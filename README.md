# CubePath UI

Panel web para consultar y monitorear VPS de CubePath.

## Stack Actual

- `Next.js 16.2.1` (App Router)
- `React 19.2.4`
- `TypeScript`
- `Tailwind CSS v4`
- `Zustand` (persistencia de API key)
- `Recharts` (gráficas de métricas)

## Funcionalidades

- Configuración de API key desde UI (`/settings`).
- Listado de VPS (`/vps`).
- Detalle de VPS con layout compartido y navegación lateral:
  - Métricas en tiempo real (`/vps/[id]`)
  - Backups (`/vps/[id]/backups`)
  - Bandwidth usage (`/vps/[id]/bandwidth-usage`)
- Auto refresh en métricas.
- Proxy backend en `app/api/vps/route.ts` para centralizar llamadas a CubePath.

## Rutas Principales

- `GET /settings`: configuración de API key.
- `GET /vps`: listado de instancias.
- `GET /vps/:id`: dashboard de métricas.
- `GET /vps/:id/backups`: historial de backups.
- `GET /vps/:id/bandwidth-usage`: consumo acumulado de bandwidth.

## API Interna (Proxy)

Ruta: `GET /api/vps`

Query params soportados:

- `vps_id` (obligatorio cuando se consulta un recurso de una VPS específica)
- `metrics=true`
- `backups=true`
- `bandwidth_use=true` (alias soportado también: `bandwidth_usage=true`)

Ejemplos:

```bash
# Listado de VPS
curl -H "Authorization: Bearer <API_KEY>" "http://localhost:3000/api/vps"

# Métricas de una VPS
curl -H "Authorization: Bearer <API_KEY>" "http://localhost:3000/api/vps?metrics=true&vps_id=22570"

# Backups de una VPS
curl -H "Authorization: Bearer <API_KEY>" "http://localhost:3000/api/vps?backups=true&vps_id=22570"

# Bandwidth usage de una VPS
curl -H "Authorization: Bearer <API_KEY>" "http://localhost:3000/api/vps?bandwidth_use=true&vps_id=22570"
```

## Variables de Entorno

Crear archivo `.env.local`:

```bash
URL_CUBE_PATH=https://<tu-api-cubepath>
```

## Ejecutar el Proyecto

Instalar dependencias:

```bash
pnpm install
```

Levantar entorno de desarrollo:

```bash
pnpm dev
```

Abrir en navegador:

`http://localhost:3000`

## Scripts Disponibles

- `pnpm dev`: inicia servidor de desarrollo.
- `pnpm build`: compila para producción.
- `pnpm start`: ejecuta build de producción.
- `pnpm lint`: corre ESLint.
