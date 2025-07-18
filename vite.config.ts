import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Convert render blocking CSS links to asynchronous
    // ones during the build by injecting media="print" and
    // onload handler.
    {
      name: 'async-css-loader',
      apply: 'build',
      transformIndexHtml(html) {
        return html.replace(/<link rel="stylesheet" href="(.*?)">/g, (full, href) => {
          return full.includes('media=') || full.includes('onload=')
            ? full
            : `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'">`;
        });
      }
    },
    visualizer({ filename: './dist/stats.html', gzipSize: true })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    // Inline all CSS into the JavaScript bundles to avoid
    // additional render‑blocking requests for CSS files
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom')) {
              return 'react-router'
            }
            if (id.includes('@supabase')) {
              return 'supabase'
            }
            if (id.includes('react')) {
              return 'react'
            }
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
            extType = 'images';
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          } else if (/css/i.test(extType)) {
            extType = 'css';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  }
  }));
