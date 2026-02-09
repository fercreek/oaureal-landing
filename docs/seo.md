# SEO: aparecer en Google

Pasos para que el sitio sea indexado y aparezca en Google.

## 1. Verificar la propiedad en Google Search Console

1. Entra en [Google Search Console](https://search.google.com/search-console).
2. Añade la propiedad (prefijo de URL, p. ej. `https://oaureal.com`).
3. Elige el método **Etiqueta HTML** (meta tag).
4. Copia el valor del atributo `content` de la meta `google-site-verification`.
5. En el proyecto, define la variable de entorno:
   - **Nombre**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - **Valor**: el código que te dio Google (solo el valor de `content`, sin comillas).
6. Vuelve a desplegar para que la meta etiqueta esté en el sitio.
7. En Search Console, haz clic en **Comprobar**.

La meta solo se incluye en el HTML si `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` está definida (por ejemplo en Vercel → Settings → Environment Variables).

## 2. Enviar el sitemap

1. En Search Console, con la propiedad verificada, ve a **Sitemaps** (en el menú lateral).
2. En "Añadir un sitemap nuevo" escribe: `sitemap.xml`
3. Envía.

URL del sitemap: **https://oaureal.com/sitemap.xml**

El sitemap incluye la homepage, `/blog`, `/aviso-legal` y cada entrada del blog. Ya está declarado en `robots.txt` para que los buscadores lo descubran.

## 3. Revisar la cobertura de indexación

1. En Search Console, ve a **Páginas** (o **Cobertura** / **Indexación**, según la vista).
2. Tras unos días, revisa si hay páginas válidas indexadas y si aparecen errores (por ejemplo "No se puede rastrear" o "No indexada").
3. Corrige según las sugerencias (enlaces rotos, redirecciones, contenido bloqueado, etc.).

Con la propiedad verificada y el sitemap enviado, Google irá rastreando e indexando. La aparición en resultados depende del contenido, la competencia y el tiempo; revisar cobertura ayuda a detectar problemas técnicos.
