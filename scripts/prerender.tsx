import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import AppServer from '../src/AppServer';
import { BLOG_POSTS } from '../src/data/blogPosts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RouteConfig {
  url: string;
  file: string;
  title?: string;
  description?: string;
  data?: any;
}

async function renderPage(template: string, route: RouteConfig) {
  const appHtml = renderToString(<AppServer url={route.url} initialData={route.data} />);
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  if (route.title) {
    html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
  }
  if (route.description) {
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${route.description}" />`);
  }
  const outPath = path.resolve(__dirname, '../dist', route.file);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
}

async function prerender() {
  const indexPath = path.resolve(__dirname, '../dist/index.html');
  const template = await readFile(indexPath, 'utf-8');

  await renderPage(template, { url: '/', file: 'index.html' });

  const posts = BLOG_POSTS.filter(p => p.published);
  await renderPage(template, {
    url: '/blog',
    file: 'blog/index.html',
    title: 'Blog | Libra Crédito | Artigos e Dicas Financeiras',
    description: 'Confira artigos e dicas sobre capital de giro, consolidação de dívidas e financiamento para reformas. Mantenha-se informado com o blog da Libra Crédito.',
    data: { posts }
  });

  for (const post of posts) {
    await renderPage(template, {
      url: `/blog/${post.slug}`,
      file: `blog/${post.slug}/index.html`,
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.description,
      data: { post }
    });
  }

  console.log('SSR prerender complete');
}

prerender();
