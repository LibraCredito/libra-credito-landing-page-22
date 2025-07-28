import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    react()
  ],
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
          // Separar ícones para tree shaking
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
      'class-variance-authority'
    ],
    // Excluir para lazy loading
    exclude: ['@supabase/supabase-js']
  }
  }));
