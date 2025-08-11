/* @vitest-environment jsdom */

import { describe, expect, it } from 'vitest';
import { renderMarkdownPreview } from '../AdminDashboard';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

describe('renderMarkdownPreview', () => {
  it('matches blog rendering for titles, lists, links and images', () => {
    const markdown = '# Título\n\nLista:\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)\n\n![Alt](https://example.com/img.png)';
    const previewHtml = renderMarkdownPreview(markdown);
    const blogHtml = DOMPurify.sanitize(marked.parse(markdown)).replace(/<h1(\s|>)/g, '<h1 class="text-2xl"$1');

    expect(previewHtml).toBe(blogHtml);
    expect(previewHtml).toContain('<h1 class="text-2xl">Título</h1>');
    expect(previewHtml).toContain('<ul>');
    expect(previewHtml).toContain('<a href="https://example.com"');
    expect(previewHtml).toContain('<img src="https://example.com/img.png"');
  });
});
