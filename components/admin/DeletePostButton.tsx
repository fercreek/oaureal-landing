'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deletePost } from '@/app/actions/posts';

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
}

export default function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`¿Borrar el artículo "${postTitle}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deletePost(postId);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al borrar');
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
      title="Borrar"
    >
      <Trash2 size={18} />
    </button>
  );
}
