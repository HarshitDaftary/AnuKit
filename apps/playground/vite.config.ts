import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@anukit/components': path.resolve(__dirname, '../../packages/components/src'),
      '@anukit/styles': path.resolve(__dirname, '../../packages/styles/src'),
      '@anukit/tokens': path.resolve(__dirname, '../../packages/tokens/src'),
      '@anukit/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@anukit/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});