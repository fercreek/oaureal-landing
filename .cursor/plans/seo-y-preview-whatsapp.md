---
name: SEO y preview WhatsApp
overview: Mejorar el SEO del landing (sitemap, robots, meta enriquecidos) y el preview al compartir en WhatsApp y redes añadiendo imagen Open Graph, Twitter Cards y descripción optimizada.
todos: []
---

# Optimización SEO y preview al compartir (WhatsApp)

## Estado actual

En [app/layout.tsx](app/layout.tsx) ya tienes:

- `metadata` con title, description, keywords, authors, `metadataBase`, canonical
- `openGraph`: type, locale, url, title, description, siteName (sin imagen)
- `robots` y `icons`

No existe: imagen para Open Graph, Twitter Card, sitemap ni robots.txt.

---

## 1. Preview al compartir (WhatsApp, Telegram, redes)

WhatsApp y la mayoría de plataformas usan **Open Graph** y, en su caso, **Twitter Card**. Sin `og:image` el preview muestra poco o nada.

### Cambios en [app/layout.tsx](app/layout.tsx)

- **Añadir `openGraph.images`**
  - URL absoluta de una imagen de preview (p. ej. `https://oaureal.com/og-image.png`).
  - Tamaño recomendado: **1200×630 px** (ratio 1.91:1).
  - Incluir `width` y `height` en el objeto de imagen para que Next genere las meta correctas.
- **Añadir Twitter Card**
  - `twitter: { card: 'summary_large_image', title, description, images: [misma URL que og:image] }`
  - Así el enlace muestra título, descripción e imagen en Twitter y en muchas apps que reutilizan estas meta.
- **Descripción para compartir**
  - Mantener la descripción actual (ya es corta y clara) o acortarla a ~155 caracteres si quieres que no se corte en algunos clientes.

### Imagen OG

- Crear y subir **`public/og-image.png`** (1200×630 px) con logo/marca y texto tipo "Sintoniza tu ritmo interno" o "Oaureal – Entrenamiento cerebral con binaurales".
- Si no tienes imagen aún, se puede dejar configurada la ruta `/og-image.png` y usar temporalmente `logo-white.png` (o similar) como fallback; el preview funcionará pero con menos impacto.

---

## 2. SEO técnico

### Sitemap

- Añadir **`app/sitemap.ts`** (dynamic sitemap de Next.js).
  - Incluir la homepage (`https://oaureal.com/`).
  - Incluir `/blog` y cada entrada del blog (`/blog/[slug]`) obteniendo slugs publicados desde Prisma.
  - Devolver array de `{ url, lastModified, changeFrequency?, priority? }` según la [API de Next](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

### Robots.txt

- Añadir **`app/robots.ts`**.
  - Regla: `User-agent: *` → `Allow: /`.
  - Opcional: `Disallow: /admin` para no indexar el panel.
  - `Sitemap: https://oaureal.com/sitemap.xml`.

Así los buscadores descubren todas las URLs y el sitemap desde un único punto.

---

## 3. Opcional: JSON-LD para SEO

- En el layout (o en un componente incluido en el layout), añadir un `<script type="application/ld+json">` con esquema **WebSite** (y opcionalmente **Organization**): nombre, url, description, mismo idioma que el sitio.
- Ayuda a Google a entender la marca y puede mejorar cómo se muestra el sitio en resultados (sin cambiar el diseño de la página).

---

## Resumen de archivos

| Acción       | Archivo                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------- |
| Editar       | [app/layout.tsx](app/layout.tsx) – openGraph.images, twitter, opcional ajuste description |
| Crear        | `app/sitemap.ts` – sitemap con homepage + blog                                            |
| Crear        | `app/robots.ts` – allow /, sitemap, opcional disallow /admin                              |
| Añadir asset | `public/og-image.png` (1200×630) – tú la creas/subes                                      |
| Opcional     | JSON-LD WebSite/Organization en layout                                                    |

Con esto el link se verá con título, descripción e imagen en WhatsApp y el resto de redes, y el SEO del landing quedará reforzado con sitemap y robots.
