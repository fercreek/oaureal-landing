import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Edit, Eye } from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const { user } = await requireAuth();

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif mb-2">Panel de Administración</h1>
            <p className="text-gray-400">Gestiona los artículos del blog</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-2 px-6 py-3 bg-[#a5f0fa] text-black font-bold rounded-xl shadow-[0_0_20px_#a5f0fa] hover:opacity-90 transition-all"
            >
              <Plus size={18} />
              Nuevo Artículo
            </Link>
            <LogoutButton />
          </div>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-xl bg-white/5">
            <p className="text-gray-400 mb-4">No hay artículos aún</p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#a5f0fa] text-black font-bold rounded-xl hover:opacity-90 transition-all"
            >
              <Plus size={18} />
              Crear primer artículo
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#a5f0fa]/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-serif text-white">{post.title}</h3>
                      {post.published ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                          Publicado
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                          Borrador
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Slug: {post.slug}</span>
                      {post.publishedAt && (
                        <span>
                          Publicado: {new Date(post.publishedAt).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Ver artículo"
                      >
                        <Eye size={18} />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="p-2 rounded-lg text-gray-400 hover:text-[#a5f0fa] hover:bg-white/10 transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
