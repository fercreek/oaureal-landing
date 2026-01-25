import PostForm from '@/components/admin/PostForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewPostPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-[#a5f0fa] hover:text-[#a5f0fa]/80 transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-bold">Volver al dashboard</span>
        </Link>
        <h1 className="text-4xl font-serif mb-8">Nuevo Artículo</h1>
        <PostForm />
      </div>
    </div>
  );
}
