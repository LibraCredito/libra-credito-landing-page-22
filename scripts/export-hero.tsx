import { writeFile } from 'fs/promises';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom/server.js';

// Ensure React is available globally for components compiled with classic runtime
// @ts-ignore
(globalThis as any).React = React;

async function exportHero() {
  const { default: HeroPremium } = await import('../src/components/HeroPremium.tsx');
  const html = renderToStaticMarkup(
    <StaticRouter location="/">
      <HeroPremium />
    </StaticRouter>
  );
  await writeFile('public/hero.html', html);
  console.log('Hero section exported to public/hero.html');
}

exportHero();
