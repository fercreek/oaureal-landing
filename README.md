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

## Estructura del Proyecto

```
oaureal-landing/
├── app/
│   ├── layout.tsx          # Layout principal con metadata
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales y Tailwind
├── components/
│   ├── ui/                 # Componentes UI básicos
│   │   └── Preloader.tsx
│   ├── features/           # Componentes con lógica compleja
│   │   ├── AudioVisualizer.tsx
│   │   └── Quiz.tsx
│   └── sections/           # Secciones de la landing
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── AudioSection.tsx
│       ├── Evidence.tsx
│       ├── QuizSection.tsx
│       ├── Pricing.tsx
│       ├── FAQ.tsx
│       ├── Investment.tsx
│       ├── Footer.tsx
│       └── StickyCTA.tsx
├── lib/
│   ├── constants.ts        # Constantes y configuración
│   └── utils.ts            # Utilidades (cn helper)
└── public/                 # Assets estáticos
```

## Desarrollo Local

### Prerrequisitos

- Node.js 18+ y npm instalados

### Pasos para ejecutar localmente

```bash
# 1. Clonar el repositorio (si aplica)
git clone <repository-url>
cd oaureal-landing

# 2. Instalar dependencias
npm install

# 3. Ejecutar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

El servidor de desarrollo se recargará automáticamente cuando hagas cambios en el código.

## Build para Producción

```bash
# Crear build de producción
npm run build

# Ejecutar build localmente
npm start
```

## Despliegue en Vercel

### Opción 1: Deploy con un clic (Recomendado)

1. Haz clic en el botón "Deploy with Vercel" arriba
2. Conecta tu repositorio de GitHub/GitLab/Bitbucket
3. Vercel detectará automáticamente Next.js y configurará el proyecto
4. Configura las variables de entorno si es necesario
5. Haz clic en "Deploy"

### Opción 2: Desde el Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub/GitLab/Bitbucket
4. Vercel detectará automáticamente Next.js
5. Configura las variables de entorno si es necesario
6. Haz clic en "Deploy"

### Opción 3: Desde la CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Iniciar sesión en Vercel (solo la primera vez)
vercel login

# Desplegar (preview)
vercel

# Desplegar a producción
vercel --prod
```

### Configuración Recomendada en Vercel

- **Framework Preset**: Next.js (detectado automáticamente)
- **Build Command**: `next build` (por defecto)
- **Output Directory**: `.next` (por defecto)
- **Install Command**: `npm install` (por defecto)

### Variables de Entorno

Si necesitas variables de entorno, configúralas en:
- Dashboard de Vercel → Project Settings → Environment Variables

## Características

- ✅ Diseño responsive
- ✅ Animaciones con Framer Motion
- ✅ Optimizado para SEO
- ✅ Analytics de Vercel integrado
- ✅ TypeScript para type safety
- ✅ Componentes modulares y reutilizables

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm start` - Ejecutar build localmente
- `npm run lint` - Ejecutar ESLint

## Configuración de Supabase (Blog Dinámico)

El proyecto incluye un sistema de blog dinámico gestionado a través de Supabase.

### Pasos de Configuración

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
   - Anota la URL del proyecto y la clave anónima (anon key)

2. **Configurar variables de entorno**
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Agrega las siguientes variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

3. **Ejecutar migración de base de datos**
   - Ve al SQL Editor en tu dashboard de Supabase
   - Copia y ejecuta el contenido de `supabase-migration.sql`
   - Esto creará la tabla `posts` y las políticas de seguridad

4. **Configurar Storage para imágenes**
   - Ve a Storage en el dashboard de Supabase
   - Crea un bucket llamado `blog-images`
   - Configura el bucket como público
   - Las políticas de acceso se configuran automáticamente con la migración

5. **Crear usuario administrador**
   - Ve a Authentication > Users en Supabase
   - Crea un nuevo usuario con email y contraseña
   - Este usuario podrá acceder a `/admin/login` y gestionar el blog

### Panel de Administración

- **Login**: `/admin/login` - Inicia sesión con tu cuenta de Supabase
- **Dashboard**: `/admin/dashboard` - Lista y gestiona todos los artículos
- **Nuevo artículo**: `/admin/posts/new` - Crea un nuevo artículo
- **Editar artículo**: `/admin/posts/[id]` - Edita un artículo existente

### Características del Blog

- Editor WYSIWYG con TipTap
- Subida de imágenes a Supabase Storage
- Publicación/borrador de artículos
- SEO optimizado con metadata dinámica
- ISR (Incremental Static Regeneration) para mejor rendimiento

## Notas

- El proyecto usa Tailwind CSS v4 con PostCSS
- Todos los componentes client-side están marcados con `'use client'`
- Los colores personalizados están definidos en `app/globals.css`
- El blog dinámico requiere configuración de Supabase para funcionar