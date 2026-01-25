import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { generateMetadata as generatePostMetadata } from '@/lib/blog-metadata';
import { renderTipTapContent } from '@/lib/tiptap-renderer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return generatePostMetadata((await params).slug);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });

  if (!post) {
    notFound();
  }

  const contentStr = typeof post.content === 'string' ? post.content : JSON.stringify(post.content);
  const contentHtml = renderTipTapContent(contentStr);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <article className="max-w-4xl mx-auto px-6 py-24 pt-32">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-subtitle font-bold">Volver al blog</span>
        </Link>

        <header className="mb-12">
          {post.publishedAt && (
            <div className="flex items-center gap-4 text-sm text-text-secondary mb-6 font-body">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-title italic mb-6 text-primary">
            {post.title}
          </h1>

          <p className="text-xl text-text-muted mb-8 leading-relaxed font-body">{post.excerpt}</p>

          {post.coverImage && (
            <div className="w-full h-96 rounded-3xl bg-gradient-to-br from-primary/20 to-primary-dark/20 mb-12 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          )}
        </header>

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-text prose-headings:font-title prose-headings:text-primary
            prose-p:text-text-muted prose-p:leading-relaxed prose-p:font-body
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-text prose-strong:font-bold
            prose-ul:text-text-muted prose-ol:text-text-muted
            prose-li:text-text-muted prose-li:font-body
            prose-blockquote:border-primary prose-blockquote:text-text-muted
            prose-code:text-primary prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
            prose-img:rounded-xl prose-img:my-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <footer className="mt-16 pt-8 border-t border-white/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-text font-subtitle font-bold"
          >
            <ArrowLeft size={18} />
            Ver más artículos
          </Link>
        </footer>
      </article>
      <Footer />
    </div>
  );
}
