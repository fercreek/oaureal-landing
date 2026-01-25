export function renderTipTapContent(content: string): string {
  try {
    const json = typeof content === 'string' ? JSON.parse(content) : content;
    return renderNode(json);
  } catch {
    return '<p>Error al cargar el contenido</p>';
  }
}

function renderNode(node: any): string {
  if (typeof node === 'string') {
    return node;
  }

  if (!node || typeof node !== 'object') {
    return '';
  }

  if (node.type === 'doc') {
    return node.content?.map((child: any) => renderNode(child)).join('') || '';
  }

  if (node.type === 'paragraph') {
    const content = node.content?.map((child: any) => renderNode(child)).join('') || '';
    return `<p>${content}</p>`;
  }

  if (node.type === 'heading') {
    const level = node.attrs?.level || 2;
    const content = node.content?.map((child: any) => renderNode(child)).join('') || '';
    return `<h${level}>${content}</h${level}>`;
  }

  if (node.type === 'text') {
    let text = node.text || '';
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        if (mark.type === 'bold') {
          text = `<strong>${text}</strong>`;
        } else if (mark.type === 'italic') {
          text = `<em>${text}</em>`;
        } else if (mark.type === 'link') {
          text = `<a href="${mark.attrs?.href || '#'}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
      });
    }
    return text;
  }

  if (node.type === 'bulletList') {
    const content = node.content?.map((child: any) => renderNode(child)).join('') || '';
    return `<ul>${content}</ul>`;
  }

  if (node.type === 'orderedList') {
    const content = node.content?.map((child: any) => renderNode(child)).join('') || '';
    return `<ol>${content}</ol>`;
  }

  if (node.type === 'listItem') {
    const content = node.content?.map((child: any) => renderNode(child)).join('') || '';
    return `<li>${content}</li>`;
  }

  if (node.type === 'image') {
    const src = node.attrs?.src || '';
    const alt = node.attrs?.alt || '';
    return `<img src="${src}" alt="${alt}" class="rounded-xl my-8" />`;
  }

  if (node.type === 'hardBreak') {
    return '<br />';
  }

  if (node.content) {
    return node.content.map((child: any) => renderNode(child)).join('');
  }

  return '';
}
