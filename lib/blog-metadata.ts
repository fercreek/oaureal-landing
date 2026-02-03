import { prisma } from '@/lib/prisma';
import { normalizeSlug } from '@/lib/utils';

export async function findPublishedPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });
  if (post) return post;
  const normalized = normalizeSlug(slug);
  const posts = await prisma.post.findMany({
    where: { published: true },
    take: 500,
  });
  return posts.find((p) => normalizeSlug(p.slug) === normalized) ?? null;
}

export async function generateMetadata(slug: string) {
  const post = await findPublishedPostBySlug(slug);

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
