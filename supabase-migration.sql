INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Usuarios autenticados pueden subir imágenes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Imágenes son públicas"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');
