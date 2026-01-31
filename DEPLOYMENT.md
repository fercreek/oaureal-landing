# Guía de Despliegue: Orden Correcto

**Si ya usas** `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env` (como en las líneas 14-15) **y funcionan**: mantenlos tal cual. Esta guía los deja igual y se centra en añadir **Database** (connection strings, contraseña) y en aclarar la diferencia entre las claves **Legacy** vs **Publishable** en la nueva UI de API Keys.

---

## Orden de Pasos

### 1. Configurar Supabase (PRIMERO)

#### 1.1 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Haz clic en "New Project"
3. Completa:
   - **Name**: `oaureal-blog` (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña (la necesitarás para `DATABASE_URL`)
   - **Region**: Elige la más cercana
4. Espera a que se cree el proyecto (2-3 minutos)

#### 1.2 Obtener Credenciales (API Keys)

1. En el dashboard de Supabase, ve a **Project Settings** (engranaje) → **API Keys**
2. **Project URL**: En la misma página o en **General** suele aparecer `https://<project-ref>.supabase.co`. Esa URL es tu `NEXT_PUBLIC_SUPABASE_URL`.
3. **Clave para el cliente (Auth/Storage)**:
   - Supabase ofrece dos formatos. **Para este proyecto usamos el legacy (JWT).**
   - Abre la pestaña **"Legacy anon, service_role API keys"** (no uses "Publishable and secret API keys").
   - Copia la **anon (public)** key (formato JWT: `eyJhbGciOiJIUzI1NiIs...`).
   - Esa clave es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Si ya tienes en `.env` valores como:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://bwurpiislnbvpehdpapv.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIs..."
   ```
   **no los cambies**: úsalos igual en `.env.local` y en Vercel. El "Publishable key" (`sb_publishable_...`) es distinto y este proyecto no lo usa.

#### 1.3 Obtener Connection Strings para Prisma

1. **Obtener la contraseña de la base de datos**:
   - Ve a **Database** → **Configuration** → **Settings** (panel izquierdo).
   - En **"Database password"** anota la contraseña. Si no la recuerdas, haz clic en **"Reset database password"** y guárdala.

2. **Obtener los connection strings**:
   - En el dashboard de Supabase, haz clic en el botón **"Connect"** (arriba a la derecha o en la barra superior).
   - Se abrirá un panel con las opciones de conexión.

3. **`DATABASE_URL`** (Transaction mode / pooler para serverless):
   - En el panel "Connect", selecciona **"Transaction mode"** (o busca la opción con puerto **6543**).
   - Copia la connection string. El formato es:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
     ```
   - Reemplaza `[YOUR-PASSWORD]` con la **Database password** del paso 1.
   - **Importante**: Debe terminar en `?pgbouncer=true` y usar el puerto **6543**.
   - Ejemplo: `postgresql://postgres:xkh_jep0ahk%21dbr8MQM@db.bwurpiislnbvpehdpapv.supabase.co:6543/postgres?pgbouncer=true`
   - ⚠️ Si la contraseña tiene caracteres especiales (como `!`), deben estar URL-encoded (`!` → `%21`).

4. **`DIRECT_URL`** (Direct connection para migraciones):
   - En el mismo panel "Connect", selecciona **"Direct connection"** (puerto **5432**).
   - Copia la connection string. El formato es:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
     ```
   - Reemplaza `[YOUR-PASSWORD]` con la misma contraseña (también URL-encoded si tiene caracteres especiales).
   - Ejemplo: `postgresql://postgres:xkh_jep0ahk%21dbr8MQM@db.bwurpiislnbvpehdpapv.supabase.co:5432/postgres`

#### 1.4 Crear Usuario Admin

1. Ve a **Authentication** → **Users**
2. Haz clic en "Add user" → "Create new user"
3. Completa:
   - **Email**: tu email (ej: `admin@oaureal.com`)
   - **Password**: crea una contraseña segura
   - **Auto Confirm User**: ✅ (marca esta casilla)
4. Guarda estas credenciales (las usarás para `/admin/login`)

#### 1.5 Configurar Storage

1. Ve a **Storage** en el dashboard
2. Haz clic en "New bucket"
3. Configura:
   - **Name**: `blog-images`
   - **Public bucket**: ✅ (marca esta casilla)
4. Haz clic en "Create bucket"

5. Ve al **SQL Editor** en Supabase
6. Ejecuta el contenido de `supabase-migration.sql` para crear las políticas de Storage:
   ```sql
   CREATE POLICY "Usuarios autenticados pueden subir imágenes"
     ON storage.objects
     FOR INSERT
     WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

   CREATE POLICY "Imágenes son públicas"
     ON storage.objects
     FOR SELECT
     USING (bucket_id = 'blog-images');
   ```

---

### 2. Configurar Variables de Entorno Localmente

1. Usa **`.env`** en la raíz del proyecto (o `.env.local`; Next.js carga ambos y `.env.local` tiene prioridad).
   - Si ya tienes todo en **`.env`**, no hace falta `.env.local`.

2. Edita `.env` (o `.env.local`) y completa:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIs..."
   ```

   ⚠️ **IMPORTANTE**:
   - `xxxxx`: project reference de Supabase (ej. `bwurpiislnbvpehdpapv`). Lo ves en la URL del proyecto.
   - `[YOUR-PASSWORD]`: la **Database password** de **Database** → **Configuration** → **Settings** (no la del usuario de Authentication).
     - Si la contraseña tiene caracteres especiales (como `!`, `@`, `#`, etc.), deben estar **URL-encoded**:
       - `!` → `%21`
       - `@` → `%40`
       - `#` → `%23`
       - etc.
   - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`: si ya los tienes en `.env` (API Keys → Legacy anon), **mantén exactamente los mismos valores**; no uses el "Publishable key" (`sb_publishable_...`).
   - El formato usa `db.xxxxx.supabase.co` (no `aws-0-...pooler.supabase.com`).

---

### 3. Ejecutar Migraciones de Prisma

1. Aplica las migraciones a tu base de datos:
   ```bash
   npx prisma migrate deploy
   ```

   Esto creará las tablas necesarias (`posts`, `QuizSubmission`, etc.) en Supabase.
   
   ✅ **Si todo está bien**, verás algo como:
   ```
   Applying migration `20250125000000_init`
   The following migration(s) have been applied:
   migrations/
     └─ 20250125000000_init/
       └─ migration.sql
   All migrations have been successfully applied.
   ```

2. (Opcional) Verifica que todo está bien:
   ```bash
   npx prisma studio
   ```
   Esto abrirá Prisma Studio en el navegador para ver tus datos.

---

### 4. Probar Localmente

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Prueba:
   - **Blog público**: http://localhost:3000/blog
   - **Admin login**: http://localhost:3000/admin/login
     - Usa el email y contraseña que creaste en Supabase
   - **Dashboard**: http://localhost:3000/admin/dashboard
   - **Crear post**: http://localhost:3000/admin/posts/new

3. Verifica que puedes:
   - ✅ Iniciar sesión en `/admin/login`
   - ✅ Ver el dashboard (aunque esté vacío)
   - ✅ Crear un artículo de prueba
   - ✅ Verlo en `/blog`

---

### 5. Desplegar a Vercel

#### 5.1 Preparar Repositorio

1. Asegúrate de que tu código está en GitHub/GitLab/Bitbucket
2. **NO** subas `.env` ni `.env.local` (están en `.gitignore`). Las variables se configuran en Vercel.

#### 5.2 Conectar a Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio
4. Vercel detectará Next.js automáticamente

#### 5.3 Configurar Variables de Entorno en Vercel

1. En la configuración del proyecto, ve a **Environment Variables**
2. Agrega estas 4 variables con **los mismos valores** que usas en `.env`:

   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | Connection string **Transaction mode** (puerto 6543, `?pgbouncer=true`). Formato: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true` |
   | `DIRECT_URL` | Connection string **Direct connection** (puerto 5432). Formato: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` (ej. `https://bwurpiislnbvpehdpapv.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Legacy anon** key (JWT `eyJ...`), **no** el Publishable key (`sb_publishable_...`) |

3. Marca todas como disponibles en **Production**, **Preview** y **Development**.

#### 5.4 Configurar Build Command

1. En **Settings** → **Build & Development Settings**
2. Verifica que:
   - **Build Command**: `prisma migrate deploy && next build` (ya está en `package.json`)
   - **Install Command**: `npm install` (por defecto)
   - **Output Directory**: `.next` (por defecto)

#### 5.5 Deploy

1. Haz clic en "Deploy"
2. Espera a que termine el build
3. Si hay errores, revisa los logs:
   - Verifica que las variables de entorno están correctas
   - Verifica que `DATABASE_URL` y `DIRECT_URL` tienen la contraseña correcta

---

## Resumen del Orden

```
1. Supabase (crear proyecto, obtener credenciales, crear usuario, Storage)
   ↓
2. Variables de entorno local (.env)
   ↓
3. Migraciones Prisma (npx prisma migrate deploy)
   ↓
4. Probar localmente (npm run dev)
   ↓
5. Vercel (conectar repo, variables de entorno, deploy)
```

---

## Troubleshooting

### Error: P1001 "Can't reach database server"
- **Proyecto Supabase pausado**: En plan gratuito, los proyectos se pausan tras inactividad. Entra al [dashboard de Supabase](https://supabase.com/dashboard), abre tu proyecto y haz clic en **"Restore project"** si aparece pausado.
- **Red/firewall**: Comprueba que tu red permite conexiones salientes a `db.xxxxx.supabase.co` (puertos 5432 y 6543).
- **Connection strings**: Revisa que `DIRECT_URL` usa puerto **5432** y el host `db.<project-ref>.supabase.co`. La contraseña debe estar URL-encoded si tiene caracteres especiales.
- **Build local sin DB**: Si solo quieres comprobar que el frontend compila (sin migraciones), usa `npm run build:next`. El comando completo `npm run build` requiere que la base de datos esté accesible.

### Error: "Invalid database string"
- Verifica que `DATABASE_URL` y `DIRECT_URL` tienen la contraseña correcta
- Verifica que no hay espacios extra en las URLs
- **Si tu contraseña tiene caracteres especiales** (`!`, `@`, `#`, `%`, etc.), deben estar URL-encoded:
  - `!` → `%21`
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `=` → `%3D`
  - etc.
- Verifica que el formato es `db.xxxxx.supabase.co` (no `aws-0-...pooler.supabase.com`)

### Error: "PrismaClient needs to be constructed with..."
- Ejecuta `npx prisma generate` localmente
- Verifica que `DATABASE_URL` está en `.env` (o `.env.local`)

### Error en Vercel: "Failed to collect page data"
- Verifica que todas las variables de entorno están configuradas en Vercel
- Verifica que `DATABASE_URL` tiene `?pgbouncer=true` al final

### No puedo iniciar sesión en `/admin/login`
- Verifica que el usuario existe en Supabase **Authentication** → **Users**
- Verifica que usas la **Legacy anon** key (JWT) en `NEXT_PUBLIC_SUPABASE_ANON_KEY`, no la "Publishable key" (`sb_publishable_...`)
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` coincide con tu proyecto (ej. `https://bwurpiislnbvpehdpapv.supabase.co`)

---

## Componente de Personalización de Colores

El proyecto incluye un componente `ColorPicker` (`components/ui/ColorPicker.tsx`) que permite cambiar los colores del design system de forma dinámica.

### Características

- **Cambio dinámico**: Permite cambiar el color primario (y opcionalmente el secundario) desde la UI
- **Generación automática**: Genera variaciones light/dark automáticamente desde el color base
- **Persistencia**: Los cambios se guardan en `localStorage` del navegador y persisten entre sesiones
- **Actualización en tiempo real**: Actualiza las CSS variables (`--color-primary`, `--color-primary-light`, `--color-primary-dark`) dinámicamente, afectando todos los componentes inmediatamente

### Ubicación

- **Landing** (`app/page.tsx`): Botón flotante compacto en la esquina inferior derecha
- **Admin Dashboard** (`app/admin/(protected)/dashboard/page.tsx`): Panel completo con selector de color secundario

### Uso

El componente está integrado por defecto. Para usarlo en otras páginas:

```tsx
import ColorPicker from '@/components/ui/ColorPicker';

// Versión completa
<ColorPicker showSecondary={true} position="fixed" />

// Versión compacta (botón flotante)
<ColorPicker compact={true} position="fixed" />
```

### Notas importantes

- **Cambios temporales**: Los cambios realizados con `ColorPicker` son temporales y solo afectan al navegador del usuario (guardados en `localStorage`). No modifican el código fuente.
- **Cambios permanentes**: Para cambios permanentes que afecten a todos los usuarios, edita `app/globals.css` directamente y actualiza las variables CSS en `@theme inline`.
- **localStorage**: Los cambios se guardan con la clave `oaureal-color-theme`. Si el usuario limpia el `localStorage`, los colores vuelven a los valores por defecto de `globals.css`.
- **Reset**: El componente incluye un botón "Restaurar Colores por Defecto" que elimina los valores de `localStorage` y restaura los valores originales de `globals.css`.
