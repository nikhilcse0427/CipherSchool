import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      strictPort: true,
    },
    // Use absolute base URL for production
    base: mode === 'production' ? '/' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000, // in kbs
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', '@codesandbox/sandpack-react']
          },
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        }
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    define: {
      'process.env': {}
    },
    // Environment variables
    envPrefix: 'VITE_',
    publicDir: 'public',
  });
};