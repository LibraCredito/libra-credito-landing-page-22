import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { BlogService } from '../src/services/blogService';

// Basic localStorage polyfill for Node environment
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  } as Storage;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.SITE_URL || 'https://libracredito.com.br';

async function generate() {
  const posts = await BlogService.getPublishedPosts();

  const sitemapItems = posts
    .map(post => {
      const url = `${BASE_URL}/blog/${post.slug}`;
      const lastmod = new Date(post.createdAt || new Date()).toISOString();
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems}\n</urlset>`;

  const rssItems = posts
    .map(post => {
      const url = `${BASE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.createdAt || new Date()).toUTCString();
      return `  <item>\n    <title><![CDATA[${post.title}]]></title>\n    <link>${url}</link>\n    <pubDate>${pubDate}</pubDate>\n  </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>Libra Crédito Blog</title>\n  <link>${BASE_URL}/blog</link>\n  <description>Últimos posts do blog</description>\n${rssItems}\n</channel>\n</rss>`;

  await writeFile(path.resolve(__dirname, '../public/sitemap.xml'), sitemap + '\n', 'utf-8');
  await writeFile(path.resolve(__dirname, '../public/rss.xml'), rss + '\n', 'utf-8');

  console.log('Generated sitemap.xml and rss.xml');
}

generate();
