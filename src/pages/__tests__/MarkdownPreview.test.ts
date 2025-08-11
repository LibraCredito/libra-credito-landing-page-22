/* @vitest-environment jsdom */

import { describe, expect, it } from 'vitest';
import { renderMarkdownPreview } from '../AdminDashboard';

describe('renderMarkdownPreview', () => {
  it('applies styling classes to markdown elements', () => {
    const markdown = '# Título\n\n## Subtítulo\n\n### Seção\n\nParágrafo com [link](https://example.com) **negrito** *itálico* `código`.\n\n> Citação\n\n- Item 1\n- Item 2\n\n1. Primeiro\n2. Segundo';
    const html = renderMarkdownPreview(markdown);
    const doc = new DOMParser().parseFromString(html, 'text/html');

    expect(doc.querySelector('h1')?.className).toBe('text-3xl font-bold text-gray-900 mt-12 mb-8 border-l-4 border-blue-500 pl-4');
    expect(doc.querySelector('h2')?.className).toBe('text-2xl font-bold text-gray-900 mt-10 mb-6 border-l-4 border-blue-500 pl-4');
    expect(doc.querySelector('h3')?.className).toBe('text-xl font-semibold text-gray-900 mt-8 mb-4 border-l-4 border-blue-500 pl-4');
    expect(doc.querySelector('p')?.className).toBe('mb-6 text-gray-700 leading-relaxed');
    expect(doc.querySelector('a')?.className).toBe('text-blue-600 hover:text-blue-800 underline');
    expect(doc.querySelector('strong')?.className).toBe('font-semibold text-gray-900');
    expect(doc.querySelector('em')?.className).toBe('italic text-gray-700');
    expect(doc.querySelector('blockquote')?.className).toBe('border-l-4 border-blue-500 bg-gray-50 p-4 my-6 italic text-gray-700');
    expect(doc.querySelector('code')?.className).toBe('bg-gray-100 text-gray-900 px-2 py-1 rounded font-mono text-sm');
    expect(doc.querySelector('ul')?.className).toBe('list-disc list-inside space-y-2 my-6 ml-4');
    expect(doc.querySelector('ol')?.className).toBe('list-decimal list-inside space-y-2 my-6 ml-4');
    expect(doc.querySelector('li')?.className).toBe('mb-2 text-gray-700');
  });
});
