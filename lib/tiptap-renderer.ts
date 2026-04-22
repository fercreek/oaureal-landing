interface TipTapMark {
  type: string;
  attrs?: { href?: string };
}

interface TipTapNodeObject {
  type?: string;
  content?: TipTapNode[];
  attrs?: { level?: number; src?: string; alt?: string };
  text?: string;
  marks?: TipTapMark[];
}

type TipTapNode = string | TipTapNodeObject;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ALLOWED_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];
const ALLOWED_IMAGE_PROTOCOLS = ['http:', 'https:'];

function sanitizeUrl(raw: string, allowed: string[], fallback: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (!allowed.includes(parsed.protocol)) return fallback;
    return parsed.toString();
  } catch {
    return fallback;
  }
}

export function renderTipTapContent(content: string): string {
  try {
    const json = typeof content === 'string' ? JSON.parse(content) : content;
    return renderNode(json as TipTapNode);
  } catch {
    return '<p>Error al cargar el contenido</p>';
  }
}

function renderNode(node: TipTapNode): string {
  if (typeof node === 'string') {
    return node;
  }

  if (!node || typeof node !== 'object') {
    return '';
  }

  const mapChildren = (children: TipTapNode[] | undefined) =>
    children?.map((child) => renderNode(child)).join('') || '';

  if (node.type === 'doc') {
    return mapChildren(node.content);
  }

  if (node.type === 'paragraph') {
    return `<p>${mapChildren(node.content)}</p>`;
  }

  if (node.type === 'heading') {
    const level = node.attrs?.level ?? 2;
    return `<h${level}>${mapChildren(node.content)}</h${level}>`;
  }

  if (node.type === 'text') {
    let text = escapeHtml(node.text ?? '');
    if (node.marks) {
      node.marks.forEach((mark) => {
        if (mark.type === 'bold') {
          text = `<strong>${text}</strong>`;
        } else if (mark.type === 'italic') {
          text = `<em>${text}</em>`;
        } else if (mark.type === 'strike') {
          text = `<s>${text}</s>`;
        } else if (mark.type === 'code') {
          text = `<code class="bg-white/10 px-2 py-1 rounded text-[#a5f0fa]">${text}</code>`;
        } else if (mark.type === 'link') {
          const safeHref = sanitizeUrl(mark.attrs?.href ?? '#', ALLOWED_LINK_PROTOCOLS, '#');
          text = `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer nofollow" class="text-[#a5f0fa] underline">${text}</a>`;
        }
      });
    }
    return text;
  }

  if (node.type === 'blockquote') {
    return `<blockquote class="border-l-4 border-[#a5f0fa] pl-6 my-4 text-gray-400">${mapChildren(node.content)}</blockquote>`;
  }

  if (node.type === 'codeBlock') {
    const content =
      node.content
        ?.map((child) =>
          typeof child === 'object' && child?.type === 'text'
            ? escapeHtml((child as TipTapNodeObject).text ?? '')
            : renderNode(child)
        )
        .join('') ?? '';
    return `<pre class="bg-white/5 border border-white/10 rounded-xl p-6 my-4 overflow-x-auto"><code class="text-[#a5f0fa] text-sm">${content}</code></pre>`;
  }

  if (node.type === 'horizontalRule') {
    return '<hr class="border-white/10 my-8" />';
  }

  if (node.type === 'bulletList') {
    return `<ul>${mapChildren(node.content)}</ul>`;
  }

  if (node.type === 'orderedList') {
    return `<ol>${mapChildren(node.content)}</ol>`;
  }

  if (node.type === 'listItem') {
    return `<li>${mapChildren(node.content)}</li>`;
  }

  if (node.type === 'image') {
    const rawSrc = node.attrs?.src ?? '';
    const safeSrc = sanitizeUrl(rawSrc, ALLOWED_IMAGE_PROTOCOLS, '');
    if (!safeSrc) return '';
    const alt = escapeHtml(node.attrs?.alt ?? '');
    return `<img src="${escapeHtml(safeSrc)}" alt="${alt}" class="rounded-xl my-8" />`;
  }

  if (node.type === 'hardBreak') {
    return '<br />';
  }

  if (node.content) {
    return node.content.map((child) => renderNode(child)).join('');
  }

  return '';
}
