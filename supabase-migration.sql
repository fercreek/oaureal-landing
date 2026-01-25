-- Crear tabla de posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  excerpt TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas por slug
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);

-- Crear índice para posts publicados
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published) WHERE published = true;

-- Habilitar Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer posts publicados
CREATE POLICY "Posts públicos son visibles para todos"
  ON posts
  FOR SELECT
  USING (published = true);

-- Política: Solo usuarios autenticados pueden crear posts
CREATE POLICY "Usuarios autenticados pueden crear posts"
  ON posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Solo el autor puede actualizar sus posts
CREATE POLICY "Autores pueden actualizar sus posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Política: Solo el autor puede eliminar sus posts
CREATE POLICY "Autores pueden eliminar sus posts"
  ON posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Crear bucket para imágenes del blog (ejecutar en Supabase Dashboard > Storage)
-- O usar la API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Política para subir imágenes (solo autenticados)
-- CREATE POLICY "Usuarios autenticados pueden subir imágenes"
--   ON storage.objects
--   FOR INSERT
--   WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Política para leer imágenes (público)
-- CREATE POLICY "Imágenes son públicas"
--   ON storage.objects
--   FOR SELECT
--   USING (bucket_id = 'blog-images');
