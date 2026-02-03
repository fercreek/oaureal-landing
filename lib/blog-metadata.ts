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

const BASE_URL = 'https://oaureal.com';

export async function generateMetadata(slug: string) {
  const post = await findPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado | Oaureal',
    };
  }

  const canonicalSlug = normalizeSlug(post.slug);
  const canonicalUrl = `${BASE_URL}/blog/${canonicalSlug}`;
  const image = post.coverImage ?? `${BASE_URL}/logo-white.png`;

  return {
    title: `${post.title} | Oaureal Blog`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ['Oaureal Labs'],
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}
