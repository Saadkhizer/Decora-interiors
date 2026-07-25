import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development the frontend (5173) proxies API + uploads to the
// backend (4000) so you can use relative URLs like fetch('/api/products').
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4100',
      '/uploads': 'http://localhost:4100',
    },
  },
});
