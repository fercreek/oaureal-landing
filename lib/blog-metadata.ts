import { prisma } from '@/lib/prisma';

export async function generateMetadata(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true },
  });

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
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}
