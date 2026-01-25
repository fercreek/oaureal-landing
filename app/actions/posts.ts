'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  cover_image?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const content = typeof data.content === 'string' ? (JSON.parse(data.content) as object) : data.content;
  await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      content,
      excerpt: data.excerpt,
      published: data.published,
      coverImage: data.cover_image || null,
      publishedAt: data.published ? new Date() : null,
      authorId: user.id,
    },
  });
  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published: boolean;
    cover_image?: string;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== user.id) throw new Error('No autorizado');

  const content = typeof data.content === 'string' ? (JSON.parse(data.content) as object) : data.content;
  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      content,
      excerpt: data.excerpt,
      published: data.published,
      coverImage: data.cover_image || null,
      publishedAt: data.published ? new Date() : null,
    },
  });
  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');
  revalidatePath(`/blog/${existing.slug}`);
  if (data.slug !== existing.slug) revalidatePath(`/blog/${data.slug}`);
}
