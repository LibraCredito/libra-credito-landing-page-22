import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from "vite-plugin-compression";
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
    mode === 'production' && compression({
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(js|css)$/i,
    }),
    mode === 'production' && compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      filter: /\.(js|css)$/i,
    }),
    process.env.STATS && visualizer({
      filename: 'stats.html',
      template: 'treemap',
      open: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600, // Reduzir limite para identificar chunks grandes
    // Otimizações para tree-shaking e code splitting
    rollupOptions: {
      output: {
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

          // Preserve deterministic name for main stylesheet
          if (extType === 'css' && assetInfo.name === 'index.css') {
            return 'assets/css/index.css';
          }

          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        // Manual chunks para melhor cache e performance
        manualChunks: {
          // Vendor chunks separados para melhor cache
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select'
          ],
          'vendor-utils': ['axios', 'clsx', 'class-variance-authority'],
          // Separar ícones para melhor tree shaking e parse mais rápido
          'vendor-icons': ['lucide-react']
        },
      }
    }
  },
  // Otimizações de dependências para lazy loading
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'clsx',
      'class-variance-authority',
      'lucide-react'
    ],
    // Excluir para lazy loading
    exclude: ['@supabase/supabase-js']
  }
  }));
