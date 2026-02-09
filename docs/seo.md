# SEO: aparecer en Google

Pasos para que el sitio sea indexado y aparezca en Google.

## 1. Verificar la propiedad en Google Search Console (DNS TXT)

Verificación por registro **TXT en DNS**: no requiere cambios en el código ni redespliegue.

1. Entra en [Google Search Console](https://search.google.com/search-console).
2. Añade la propiedad como **Dominio** (p. ej. `oaureal.com`) para verificar todas las URLs del dominio.
3. Elige el método **Registro DNS**.
4. Google te mostrará un registro TXT. Ejemplo:
   - **Nombre / Host**: `@` o el subdominio que indique Google (a veces deja el campo vacío o `@`).
   - **Valor / Contenido**: algo como `google-site-verification=XXXXXXXXXXXXXXXX`.
5. En el panel de tu proveedor DNS (donde gestionas oaureal.com — Vercel, Cloudflare, GoDaddy, etc.):
   - Crea un registro de tipo **TXT**.
   - En el nombre usa el que te dio Google (normalmente `@` para la raíz del dominio).
   - En el valor pega exactamente la cadena `google-site-verification=...` que te dio Google.
6. Guarda los cambios y espera a que se propague el DNS (puede tardar unos minutos u horas).
7. En Search Console, haz clic en **Comprobar**.

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
