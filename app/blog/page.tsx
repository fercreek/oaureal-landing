import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Blog | Oaureal - Entrenamiento Cerebral',
  description: 'Artículos educativos sobre ondas cerebrales, bienestar mental y entrenamiento cerebral con sonidos binaurales.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-24 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif italic mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Blog Oaureal
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Descubre la ciencia detrás del entrenamiento cerebral, las ondas cerebrales y el bienestar mental.
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No hay artículos disponibles aún.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#a5f0fa]/50 transition-all hover:bg-white/10"
              >
                {post.coverImage && (
                  <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-[#011797]/20 to-[#54008c]/20 mb-6 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
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
                <h2 className="text-2xl font-serif mb-3 text-white group-hover:text-[#a5f0fa] transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-6 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-[#a5f0fa] text-sm font-bold group-hover:gap-4 transition-all">
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
