import { createClient } from '@/lib/supabase/server';

export async function generateMetadata(slug: string) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) {
    return {
      title: 'Artículo no encontrado | Oaureal',
    };
  }

  return {
    title: `${post.title} | Oaureal Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}
