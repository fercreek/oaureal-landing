import { use } from 'react';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditPostPage({ 
  params,
}: { 
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <EditPostContent id={id} />;
}

async function EditPostContent({ id }: { id: string }) {
  const { user } = await requireAuth();

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post || post.authorId !== user.id) {
    notFound();
  }

  const formPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
    excerpt: post.excerpt,
    published: post.published,
    cover_image: post.coverImage ?? '',
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-subtitle font-bold">Volver al dashboard</span>
        </Link>
        <h1 className="text-4xl font-title mb-8 text-primary">Editar Artículo</h1>
        <PostForm post={formPost} />
      </div>
    </div>
  );
}
