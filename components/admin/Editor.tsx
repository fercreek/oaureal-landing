'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  SquareCode,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect, useRef } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

function parseContent(content: string): object | undefined {
  const trimmed = content?.trim();
  if (!trimmed || !trimmed.startsWith('{')) return undefined;
  try {
    const parsed = JSON.parse(trimmed) as { type?: string };
    if (typeof parsed !== 'object' || parsed === null) return undefined;
    if (parsed.type !== 'doc') return undefined;
    return parsed as object;
  } catch {
    return undefined;
  }
}

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'] as const;
const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function isSafeHttpUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:' || parsed.protocol === 'tel:';
  } catch {
    return false;
  }
}

export default function Editor({ content, onChange, placeholder = 'Escribe tu artículo aquí...' }: EditorProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  const initialContent = parseContent(content);

  const editor = useEditor({
    immediatelyRender: false,
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
        protocols: ['http', 'https', 'mailto', 'tel'],
        HTMLAttributes: {
          class: 'text-primary underline',
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none min-h-[400px] p-6 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  const contentSyncedRef = useRef(false);
  useEffect(() => {
    if (!editor) return;
    const parsed = parseContent(content);
    if (!parsed) return;
    if (!contentSyncedRef.current) {
      editor.commands.setContent(parsed);
      contentSyncedRef.current = true;
    }
  }, [editor, content]);

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ALLOWED_IMAGE_MIME_TYPES.join(',');
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;

      if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as typeof ALLOWED_IMAGE_MIME_TYPES[number])) {
        alert('Formato no permitido. Usa JPG, PNG, WebP, GIF o AVIF.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        alert('La imagen supera el tamaño máximo de 5 MB.');
        return;
      }

      setUploading(true);
      try {
        const ext = MIME_EXTENSION_MAP[file.type];
        const randomName = crypto.randomUUID();
        const fileName = `${randomName}.${ext}`;
        const filePath = `blog-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

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

  const btn = (onClick: () => void, active: boolean, Icon: typeof Bold, disabled?: boolean, title?: string) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active ? 'bg-primary text-bg' : 'text-text-muted hover:text-text hover:bg-white/10 disabled:opacity-50'
      }`}
    >
      <Icon size={18} />
    </button>
  );

  const sep = () => <div className="w-px h-6 bg-white/10 mx-0.5 shrink-0" />;

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/10 bg-white/5">
        {btn(() => editor.chain().focus().undo().run(), false, Undo2, !editor.can().undo(), 'Deshacer')}
        {btn(() => editor.chain().focus().redo().run(), false, Redo2, !editor.can().redo(), 'Rehacer')}
        {sep()}
        {btn(
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive('bold'),
          Bold,
          !editor.can().chain().focus().toggleBold().run(),
          'Negrita'
        )}
        {btn(
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive('italic'),
          Italic,
          !editor.can().chain().focus().toggleItalic().run(),
          'Cursiva'
        )}
        {btn(
          () => editor.chain().focus().toggleStrike().run(),
          editor.isActive('strike'),
          Strikethrough,
          !editor.can().chain().focus().toggleStrike().run(),
          'Tachado'
        )}
        {btn(
          () => editor.chain().focus().toggleCode().run(),
          editor.isActive('code'),
          Code,
          !editor.can().chain().focus().toggleCode().run(),
          'Código inline'
        )}
        {sep()}
        {btn(
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive('heading', { level: 2 }),
          Heading2,
          undefined,
          'Título 2'
        )}
        {btn(
          () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          editor.isActive('heading', { level: 3 }),
          Heading3,
          undefined,
          'Título 3'
        )}
        {btn(
          () => editor.chain().focus().toggleBlockquote().run(),
          editor.isActive('blockquote'),
          Quote,
          undefined,
          'Cita'
        )}
        {btn(
          () => editor.chain().focus().toggleCodeBlock().run(),
          editor.isActive('codeBlock'),
          SquareCode,
          undefined,
          'Bloque de código'
        )}
        {sep()}
        {btn(
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive('bulletList'),
          List,
          undefined,
          'Lista con viñetas'
        )}
        {btn(
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive('orderedList'),
          ListOrdered,
          undefined,
          'Lista numerada'
        )}
        {btn(
          () => editor.chain().focus().setHorizontalRule().run(),
          false,
          Minus,
          undefined,
          'Línea horizontal'
        )}
        {sep()}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('URL del enlace:');
            if (!url) return;
            if (!isSafeHttpUrl(url)) {
              alert('URL no válida. Solo se permiten enlaces http(s), mailto: o tel:.');
              return;
            }
            editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('link') ? 'bg-primary text-bg' : 'text-text-muted hover:text-text hover:bg-white/10'
          }`}
          title="Enlace"
        >
          <LinkIcon size={18} />
        </button>
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={uploading}
          className="p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-white/10 disabled:opacity-50"
          title="Imagen"
        >
          <ImageIcon size={18} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
