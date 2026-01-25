'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Editor from './Editor';
import { Save, X } from 'lucide-react';
import { createPost, updatePost } from '@/app/actions/posts';

interface Post {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  cover_image?: string;
}

interface PostFormProps {
  post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState<Post>({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '{}',
    excerpt: post?.excerpt || '',
    published: post?.published || false,
    cover_image: post?.cover_image || '',
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        published: post.published,
        cover_image: post.cover_image || '',
      });
      setSlugManuallyEdited(true);
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => {
      const newSlug = slugManuallyEdited ? prev.slug : generateSlug(title);
      return {
        ...prev,
        title,
        slug: newSlug,
      };
    });
  };

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        published: publish,
        cover_image: formData.cover_image || undefined,
      };

      if (post?.id) {
        await updatePost(post.id, payload);
      } else {
        await createPost(payload);
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-2 text-gray-300">
          Título *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#a5f0fa] transition-colors"
          placeholder="Título del artículo"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-gray-300">
          Slug *
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          required
          className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#a5f0fa] transition-colors font-mono text-sm"
          placeholder="url-del-articulo"
        />
        <p className="text-xs text-gray-500 mt-2">
          URL amigable para el artículo (ej: guia-ondas-cerebrales)
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-gray-300">
          Extracto *
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
          }
          required
          rows={3}
          className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#a5f0fa] transition-colors"
          placeholder="Breve descripción del artículo (aparece en la lista del blog)"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-gray-300">
          Imagen de portada (URL)
        </label>
        <input
          type="url"
          value={formData.cover_image || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, cover_image: e.target.value }))
          }
          className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#a5f0fa] transition-colors"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-gray-300">
          Contenido *
        </label>
        <Editor
          content={formData.content}
          onChange={(content) =>
            setFormData((prev) => ({ ...prev, content }))
          }
        />
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <Save size={18} />
          Guardar Borrador
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#a5f0fa] text-black font-bold rounded-xl shadow-[0_0_20px_#a5f0fa] hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Save size={18} />
          Publicar
        </button>
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
        >
          <X size={18} />
          Cancelar
        </Link>
      </div>
    </form>
  );
}
