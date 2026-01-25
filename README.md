# Oaureal Landing Page

Landing page para Oaureal - Plataforma de entrenamiento cerebral con sonidos binaurales.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/oaureal-landing)

## Stack Tecnológico

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (animaciones)
- **Lucide React** (iconos)
- **Vercel Analytics**
- **Prisma** (ORM, migraciones y acceso a datos)
- **Supabase** (Auth y Storage para imágenes del blog)

## Estructura del Proyecto

```
oaureal-landing/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── blog/                 # Sección pública del blog
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── admin/                # Panel exclusivo para gestionar el blog
│   │   ├── login/
│   │   ├── (protected)/      # Dashboard y posts (requieren auth)
│   │   │   ├── dashboard/
│   │   │   └── posts/
│   │   └── README.md
│   ├── actions/              # Server Actions (crear/editar posts)
│   │   └── posts.ts
│   └── globals.css
├── components/
│   ├── ui/
│   ├── features/
│   ├── sections/
│   └── admin/                # Editor, PostForm, LogoutButton
├── lib/
│   ├── prisma.ts             # Cliente Prisma (singleton)
│   ├── auth.ts               # requireAuth para rutas protegidas
│   ├── blog-metadata.ts      # Metadata dinámica del blog
│   ├── tiptap-renderer.ts    # Render TipTap JSON a HTML
│   ├── supabase/             # Cliente Supabase (Auth, Storage)
│   ├── generated/prisma/     # Cliente generado por Prisma
│   └── ...
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── supabase-migration.sql    # Solo Storage (bucket blog-images)
```

## Desarrollo Local

### Prerrequisitos

- Node.js 18+ y npm
- PostgreSQL (local o Supabase)

### Pasos

```bash
git clone <repository-url>
cd oaureal-landing
npm install
cp .env.example .env.local
```

Configura `.env.local` con:
- `DATABASE_URL`: Connection string **Transaction mode** (puerto 6543, `?pgbouncer=true`) - Obténlo del botón **"Connect"** en Supabase.
- `DIRECT_URL`: Connection string **Direct connection** (puerto 5432) - También del botón **"Connect"**.
- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto (ej. `https://xxxxx.supabase.co`).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Legacy anon key (JWT) de **Project Settings** → **API Keys** → pestaña **"Legacy"**.

**Formato de connection strings:**
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

⚠️ Si la contraseña tiene caracteres especiales, URL-encodéalos (`!` → `%21`, `@` → `%40`, etc.).

```bash
npx prisma migrate deploy
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Blog en `/blog`, admin en `/admin/login`.

### Prisma

- `npx prisma migrate deploy` - Aplicar migraciones (usa `DIRECT_URL` para conectarse)
- `npx prisma migrate dev` - Crear nuevas migraciones en desarrollo
- `npx prisma studio` - Inspeccionar datos

## Build para Producción

```bash
npm run build
npm start
```

El script `build` ejecuta `prisma migrate deploy` y luego `next build`. Asegúrate de que `DATABASE_URL` y `DIRECT_URL` estén configurados.

## Despliegue en Vercel

1. Conecta el repositorio en Vercel.
2. Configura **Environment Variables** (usa los mismos valores de `.env.local`):
   - `DATABASE_URL` - Connection string **Transaction mode** (puerto 6543, `?pgbouncer=true`). Formato: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true`
   - `DIRECT_URL` - Connection string **Direct connection** (puerto 5432). Formato: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - `NEXT_PUBLIC_SUPABASE_URL` - URL del proyecto (ej. `https://xxxxx.supabase.co`).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Legacy anon key (JWT) de Supabase.
   
   ⚠️ Obtén los connection strings del botón **"Connect"** en el dashboard de Supabase. Si la contraseña tiene caracteres especiales, URL-encodéalos.
3. **Build Command**: `prisma migrate deploy && next build` (ya definido en `package.json`).
4. Deploy.

## Configuración de Supabase y Prisma

### Base de datos (Prisma)

- La tabla `posts` se gestiona con **Prisma Migrate** (`prisma/migrations/`).
- Ejecuta `npx prisma migrate dev` en local o `prisma migrate deploy` en CI/Vercel.

### Supabase: Auth y Storage

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Obtén los connection strings: Haz clic en el botón **"Connect"** del dashboard y copia:
   - **Transaction mode** (puerto 6543) → `DATABASE_URL`
   - **Direct connection** (puerto 5432) → `DIRECT_URL`
3. Obtén las credenciales de API: **Project Settings** → **API Keys** → pestaña **"Legacy"**:
   - **anon (public)** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. En **SQL Editor**, ejecuta `supabase-migration.sql` para crear el bucket `blog-images` y las políticas de Storage (subida para autenticados, lectura pública).
5. En **Authentication > Users**, crea un usuario (email + contraseña). Ese usuario es el admin del blog y accede por `/admin/login`.

Para más detalles, ver [DEPLOYMENT.md](DEPLOYMENT.md).

### Variables de entorno

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Prisma (runtime). Transaction Pooler para serverless. |
| `DIRECT_URL` | Prisma (migraciones). Conexión directa a Postgres. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Auth y Storage (cliente). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Auth y Storage (cliente). |

## Blog y Admin

- **Blog público**: `/blog` (lista) y `/blog/[slug]` (artículo). Solo se muestran posts publicados.
- **Admin**: Acceso exclusivo para gestionar el blog. Login en `/admin/login`, dashboard en `/admin/dashboard`, crear/editar en `/admin/posts/new` y `/admin/posts/[id]`.
- Los permisos (quién puede crear/editar posts) se validan en **Server Actions** (`app/actions/posts.ts`) usando Supabase Auth.

Para más detalle sobre el panel de administración, ver [app/admin/README.md](app/admin/README.md).

## Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Migrar BD y build de producción
- `npm start` - Servir build localmente
- `npm run lint` - ESLint

## Características

- Diseño responsive, animaciones (Framer Motion), SEO
- Blog con Prisma + TipTap, metadata dinámica, ISR
- Admin protegido (Supabase Auth), solo el admin puede modificar el blog
