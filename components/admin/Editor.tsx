'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, Heading2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function Editor({ content, onChange, placeholder = 'Escribe tu artículo aquí...' }: EditorProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#a5f0fa] underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none min-h-[400px] p-6 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;

      setUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        editor.chain().focus().setImage({ src: data.publicUrl }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error al subir la imagen');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-white/5">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('bold')
              ? 'bg-[#a5f0fa] text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('italic')
              ? 'bg-[#a5f0fa] text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#a5f0fa] text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Heading2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-[#a5f0fa] text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <List size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={() => {
            const url = window.prompt('URL del enlace:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('link')
              ? 'bg-[#a5f0fa] text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={handleImageUpload}
          disabled={uploading}
          className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ImageIcon size={18} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
