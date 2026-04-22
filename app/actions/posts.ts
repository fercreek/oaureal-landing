'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const LIMITS = {
  title: 256,
  slug: 200,
  excerpt: 1000,
  coverImage: 2048,
  content: 1_000_000,
} as const;

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type PostInput = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  cover_image?: string;
};

function validatePostInput(data: PostInput): { title: string; slug: string; excerpt: string; coverImage: string | null; content: object } {
  if (typeof data.title !== 'string' || !data.title.trim() || data.title.length > LIMITS.title) {
    throw new Error('Título inválido');
  }
  if (typeof data.slug !== 'string' || !data.slug.trim() || data.slug.length > LIMITS.slug || !SLUG_REGEX.test(data.slug)) {
    throw new Error('Slug inválido');
  }
  if (typeof data.excerpt !== 'string' || data.excerpt.length > LIMITS.excerpt) {
    throw new Error('Resumen inválido');
  }
  if (typeof data.content !== 'string' || data.content.length === 0 || data.content.length > LIMITS.content) {
    throw new Error('Contenido inválido');
  }
  let parsedContent: unknown;
  try {
    parsedContent = JSON.parse(data.content);
  } catch {
    throw new Error('Contenido inválido');
  }
  if (typeof parsedContent !== 'object' || parsedContent === null) {
    throw new Error('Contenido inválido');
  }
  const coverImage = data.cover_image?.trim() || '';
  if (coverImage.length > LIMITS.coverImage) {
    throw new Error('URL de imagen inválida');
  }

  return {
    title: data.title.trim(),
    slug: data.slug.trim(),
    excerpt: data.excerpt.trim(),
    coverImage: coverImage || null,
    content: parsedContent as object,
  };
}

export async function createPost(data: PostInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const clean = validatePostInput(data);
  await prisma.post.create({
    data: {
      title: clean.title,
      slug: clean.slug,
      content: clean.content,
      excerpt: clean.excerpt,
      published: data.published,
      coverImage: clean.coverImage,
      publishedAt: data.published ? new Date() : null,
      authorId: user.id,
    },
  });
  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');
}

export async function updatePost(id: string, data: PostInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  if (typeof id !== 'string' || id.length === 0 || id.length > 64) {
    throw new Error('ID inválido');
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== user.id) throw new Error('No autorizado');

  const clean = validatePostInput(data);
  await prisma.post.update({
    where: { id },
    data: {
      title: clean.title,
      slug: clean.slug,
      content: clean.content,
      excerpt: clean.excerpt,
      published: data.published,
      coverImage: clean.coverImage,
      publishedAt: data.published ? new Date() : null,
    },
  });
  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');
  revalidatePath(`/blog/${existing.slug}`);
  if (clean.slug !== existing.slug) revalidatePath(`/blog/${clean.slug}`);
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  if (typeof id !== 'string' || id.length === 0 || id.length > 64) {
    throw new Error('ID inválido');
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== user.id) throw new Error('No autorizado');

  await prisma.post.delete({ where: { id } });
  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');
  if (existing.slug) revalidatePath(`/blog/${existing.slug}`);
}
