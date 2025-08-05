import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import AppServer from '../src/AppServer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prerender() {
  const distIndexPath = path.resolve(__dirname, '../dist/index.html');
  const template = await readFile(distIndexPath, 'utf-8');
  const appHtml = renderToString(<AppServer />);
  const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  await writeFile(distIndexPath, html);
  console.log('SSR prerender complete');
}

prerender();
