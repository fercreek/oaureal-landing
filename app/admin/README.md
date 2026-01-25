# Panel de Administración del Blog

Acceso exclusivo para que el admin gestione el blog en `/blog`. No se expone en la navegación pública; el acceso es directo por URL o por enlaces internos.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/admin/login` | Inicio de sesión (email + contraseña de Supabase Auth) |
| `/admin/dashboard` | Lista de artículos (propios: publicados y borradores) |
| `/admin/posts/new` | Crear nuevo artículo |
| `/admin/posts/[id]` | Editar artículo existente |

## Requisitos

- Usuario creado en **Supabase Auth** (Authentication > Users). Ese usuario es el admin.
- Sesión activa (cookies) para acceder a dashboard y a crear/editar posts.

## Uso

1. Ir a `/admin/login` e iniciar sesión con el usuario de Supabase.
2. Si ya hay sesión, se redirige a `/admin/dashboard`.
3. Desde el dashboard se pueden crear, editar y publicar artículos. Solo se listan los posts del usuario logueado.
4. Los permisos (crear/editar solo propios) se validan en **Server Actions**; la autoría se comprueba con `authorId` en la base de datos.

## Notas

- No enlazar `/admin` en la navegación pública del sitio.
- El login y la protección de rutas usan **Supabase Auth**. Los datos del blog se gestionan con **Prisma** y las Server Actions en `app/actions/posts.ts`.
