import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'OAUREAL LAB | Ciencia y regulación mental',
  description: 'Oaureal Lab es el espacio donde se explica lo que en Oaureal se experimenta. Exploramos la ciencia, los procesos biológicos y los sistemas que influyen en la regulación y los estados mentales.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-24 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-lab italic mb-6 text-primary">
            OAUREAL LAB
          </h1>
          <p className="text-lg text-text max-w-3xl mx-auto font-body leading-relaxed">
            Oaureal Lab es el espacio donde se explica lo que en Oaureal se experimenta.
            <br />
            Aquí exploramos la ciencia, los procesos biológicos y los sistemas —sonoros, fisiológicos y naturales— que influyen en la regulación y los estados mentales.
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg font-body">No hay artículos disponibles aún.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/10"
              >
                {post.coverImage && (
                  <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-dark/20 mb-6 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-text-secondary mb-4 font-body">
                  {post.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-title mb-3 text-text group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-text-muted mb-6 line-clamp-3 font-body">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-primary text-sm font-subtitle font-bold group-hover:gap-4 transition-all">
                  <span>Leer más</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
