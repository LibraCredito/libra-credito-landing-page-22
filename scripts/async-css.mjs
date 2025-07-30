import fs from 'fs/promises';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets', 'css');

async function asyncCss() {
  try {
    const files = await fs.readdir(assetsDir);
    const cssFile = files.find(file => file.endsWith('.css'));

    if (!cssFile) {
      console.error('No CSS file found in dist/assets');
      return;
    }

    const cssPath = `/assets/css/${cssFile}`;
    const indexPath = path.join(distDir, 'index.html');
    let indexHtml = await fs.readFile(indexPath, 'utf8');

    const preloadLink = `<link rel="preload" href="${cssPath}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;
    const noscriptLink = `<noscript><link rel="stylesheet" href="${cssPath}"></noscript>`;

    // Remove any existing stylesheet link tags before injecting preload
    indexHtml = indexHtml.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, '');

    indexHtml = indexHtml.replace(
      /<\/head>/,
      `  ${preloadLink}\n  ${noscriptLink}\n</head>`
    );

    await fs.writeFile(indexPath, indexHtml);
    console.log('Successfully added async CSS loading to index.html');
  } catch (error) {
    console.error('Error modifying index.html for async CSS:', error);
  }
}

asyncCss();
