# Oaureal Landing Page

Landing page para Oaureal — Plataforma de entrenamiento cerebral con sonidos binaurales.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/oaureal-landing)

---

## Stack tecnológico

El proyecto usa:

| Capa | Tecnología | Rol |
|------|------------|-----|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) | SSR, rutas, Server Actions |
| **UI** | React 19, TypeScript, [Tailwind CSS v4](https://tailwindcss.com) | Componentes, estilos |
| **Animaciones** | [Framer Motion](https://www.framer.com/motion), [Lucide React](https://lucide.dev) | Animaciones, iconos |
| **Base de datos** | [Prisma](https://www.prisma.io) + PostgreSQL (Supabase) | ORM, migraciones, acceso a `posts` |
| **Auth y Storage** | [Supabase](https://supabase.com) | Login admin, bucket `blog-images` |
| **Hosting** | [Vercel](https://vercel.com) | Build, deploy, serverless |

- **Prisma**: ORM para la base de datos. Gestiona el modelo `Post`, las migraciones en `prisma/migrations/` y el cliente en `lib/prisma.ts`. Usa `DATABASE_URL` (pooler) en runtime y `DIRECT_URL` (conexión directa) para migraciones.
- **Vercel**: Plataforma de deploy. El build ejecuta `prisma migrate deploy` y luego `next build`. Las variables de entorno se configuran en el dashboard de Vercel.

Para una guía paso a paso de despliegue, ver [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Prisma

### Qué hace Prisma aquí

- Define el modelo `Post` en `prisma/schema.prisma` y la tabla `posts` en PostgreSQL.
- Las migraciones viven en `prisma/migrations/`. La inicial es `20250125000000_init`.
- El cliente se genera con `prisma generate` (automático en `postinstall`) y se usa vía `lib/prisma.ts`.

### Variables usadas por Prisma

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Conexión **Transaction mode** (puerto **6543**, `?pgbouncer=true`). Para el runtime en Vercel/serverless. |
| `DIRECT_URL` | Conexión **Direct** (puerto **5432**). Solo para `prisma migrate deploy` y `prisma migrate dev`. |

Ambas se obtienen en Supabase → **Connect** → Transaction mode / Direct connection. Contraseña URL-encoded si tiene caracteres especiales (`!` → `%21`).

### Comandos Prisma

```bash
npx prisma generate      # Generar cliente (se ejecuta en postinstall)
npx prisma migrate dev   # Crear/aplicar migraciones en desarrollo (usa DIRECT_URL)
npx prisma migrate deploy # Aplicar migraciones en producción / Vercel (usa DIRECT_URL)
npx prisma studio        # Inspeccionar datos en el navegador
```

El `build` del proyecto (`npm run build`) ejecuta `prisma migrate deploy` antes de `next build`. Si la base no está accesible, puedes usar `npm run build:next` para solo compilar Next.js.

---

## Vercel

### Rol de Vercel

- **Hosting** de la app Next.js en serverless.
- **Build**: al hacer deploy, Vercel ejecuta `npm run build` → `prisma migrate deploy` + `next build`.
- **Variables de entorno**: debes configurar en el proyecto de Vercel las mismas que en `.env` (ver abajo).

### Desplegar en Vercel

1. Conecta el repo (GitHub/GitLab/Bitbucket) al proyecto en [vercel.com](https://vercel.com).
2. En **Settings → Environment Variables** añade:

   | Variable | Dónde obtenerla |
   |----------|------------------|
   | `DATABASE_URL` | Supabase → **Connect** → **Transaction mode** (puerto 6543, `?pgbouncer=true`) |
   | `DIRECT_URL` | Supabase → **Connect** → **Direct connection** (puerto 5432) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project URL (`https://<ref>.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → **API Keys** → pestaña **Legacy** → anon (public) |

   Usa los mismos valores que en tu `.env` local. Contraseña URL-encoded en las URLs.

3. **Build Command**: dejar el por defecto o `npm run build` (ya incluye `prisma migrate deploy && next build`).
4. Deploy.

Si el build falla con *"Can't reach database server"*, revisa que el proyecto de Supabase no esté pausado y que `DIRECT_URL` sea correcta. Más en [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting).

---

## Estructura del proyecto

```
oaureal-landing/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── blog/                 # Blog público
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── admin/                # Panel admin (blog)
│   │   ├── login/
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   └── posts/
│   │   └── README.md
│   ├── actions/
│   │   └── posts.ts          # Server Actions (Prisma + Supabase Auth)
│   └── globals.css
├── components/
│   ├── ui/
│   ├── features/
│   ├── sections/
│   └── admin/
├── lib/
│   ├── prisma.ts             # Cliente Prisma (singleton)
│   ├── auth.ts               # requireAuth (Supabase)
│   ├── blog-metadata.ts
│   ├── tiptap-renderer.ts
│   └── supabase/             # Cliente Supabase (Auth, Storage)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── supabase-migration.sql    # Storage: bucket blog-images
```

---

## Desarrollo local

### Prerrequisitos

- Node.js 18+
- Proyecto en [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage)

### Pasos

```bash
git clone <repository-url>
cd oaureal-landing
npm install
cp .env.example .env
```

Edita `.env`:

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

Sustituye `xxxxx` por el project ref de Supabase y `[PASSWORD]` por la database password (URL-encoded si tiene `!`, `@`, etc.). Obtén todo desde **Connect** y **API Keys** → Legacy.

```bash
npx prisma migrate deploy
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Blog en `/blog`, admin en `/admin/login`.

---

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Prisma (runtime). Pooler Transaction mode, puerto 6543, `?pgbouncer=true`. |
| `DIRECT_URL` | Prisma (migraciones). Conexión directa, puerto 5432. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Auth y Storage (cliente). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Auth y Storage (cliente). Legacy anon key. |

---

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | `prisma migrate deploy` + `next build` (requiere DB accesible) |
| `npm run build:next` | Solo `next build` (sin migraciones) |
| `npm start` | Servir build de producción |
| `npm run lint` | ESLint |

---

## Personalización de Colores

El proyecto incluye un componente `ColorPicker` que permite cambiar los colores del design system de forma dinámica.

### Componente ColorPicker

**Ubicación:** `components/ui/ColorPicker.tsx`

**Características:**
- Cambia el color primario (celeste neónsito) y genera automáticamente variaciones light/dark
- Opcionalmente permite cambiar el color secundario
- Los cambios se guardan en `localStorage` y persisten entre sesiones
- Actualiza las CSS variables (`--color-primary`, `--color-primary-light`, `--color-primary-dark`) dinámicamente
- Todos los componentes se actualizan automáticamente al cambiar los colores

**Uso:**

```tsx
import ColorPicker from '@/components/ui/ColorPicker';

// Versión completa (panel expandido)
<ColorPicker showSecondary={true} position="fixed" />

// Versión compacta (botón flotante con dropdown)
<ColorPicker compact={true} position="fixed" />
```

**Props:**
- `showSecondary?: boolean` - Mostrar selector de color secundario (default: `false`)
- `compact?: boolean` - Modo compacto con botón flotante (default: `false`)
- `position?: 'fixed' | 'relative'` - Posición del componente (default: `'fixed'`)

**Integración actual:**
- **Landing** (`app/page.tsx`): Modo compacto, botón flotante en la esquina inferior derecha
- **Admin Dashboard** (`app/admin/(protected)/dashboard/page.tsx`): Panel completo con selector secundario

### Cómo funciona

1. **Hook `useColorTheme`** (`lib/hooks/useColorTheme.ts`):
   - Lee valores iniciales desde CSS variables o `localStorage`
   - Genera variaciones light/dark automáticamente usando `lib/utils/colorUtils.ts`
   - Actualiza CSS variables en `:root` cuando cambian los colores
   - Persiste cambios en `localStorage` con clave `oaureal-color-theme`

2. **Utilidades de color** (`lib/utils/colorUtils.ts`):
   - Conversión hex ↔ RGB
   - Generación automática de variaciones (lighten/darken)
   - Validación de formato hex

3. **Persistencia:**
   - Los cambios se guardan en `localStorage` del navegador
   - Se restauran automáticamente al recargar la página
   - Botón "Reset" restaura los valores por defecto de `globals.css`

### Notas importantes

- **Cambios temporales**: Los cambios en `ColorPicker` son temporales (solo en el navegador del usuario) y no afectan el código fuente
- **Cambios permanentes**: Para cambios permanentes que afecten a todos los usuarios, edita `app/globals.css` directamente
- **Fallback**: Si `localStorage` no está disponible, el componente funciona pero no guarda los cambios
- **Performance**: Los cambios se aplican inmediatamente vía CSS variables (no requiere re-render completo)

---

## Blog y Admin

- **Blog**: `/blog` (lista) y `/blog/[slug]` (artículo). Solo posts publicados. Contenido vía Prisma; metadata en `lib/blog-metadata.ts`.
- **Admin**: Login en `/admin/login` (Supabase Auth). Dashboard y CRUD de posts en `/admin/dashboard` y `/admin/posts/*`. Los Server Actions en `app/actions/posts.ts` validan auth y usan Prisma para crear/actualizar posts.

Ver [app/admin/README.md](app/admin/README.md) para más detalle del panel.

---

## Referencias

- [DEPLOYMENT.md](DEPLOYMENT.md) — Orden de pasos, Supabase, Vercel, troubleshooting.
- [app/admin/README.md](app/admin/README.md) — Uso y permisos del admin.
