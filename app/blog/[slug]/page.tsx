import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado | Oaureal',
    };
  }

  return {
    title: `${post.title} | Oaureal Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <article className="max-w-4xl mx-auto px-6 py-24 pt-32">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#a5f0fa] hover:text-[#a5f0fa]/80 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Volver al blog</span>
        </Link>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.description,
              image: post.image || '',
              datePublished: post.date,
              author: {
                '@type': 'Person',
                name: post.author,
              },
              publisher: {
                '@type': 'Organization',
                name: 'Oaureal',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://oaureal.com/logo.png',
                },
              },
              keywords: post.tags.join(', '),
            }),
          }}
        />

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif italic mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            {post.title}
          </h1>

          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#a5f0fa]/10 text-[#a5f0fa] text-sm font-bold"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.image && (
            <div className="w-full h-96 rounded-3xl bg-gradient-to-br from-[#011797]/20 to-[#54008c]/20 mb-12 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          )}
        </header>

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-serif
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-[#a5f0fa] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-bold
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:text-gray-300
            prose-blockquote:border-[#a5f0fa] prose-blockquote:text-gray-400
            prose-code:text-[#a5f0fa] prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <footer className="mt-16 pt-8 border-t border-white/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#a5f0fa]/50 transition-all text-white font-bold"
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
