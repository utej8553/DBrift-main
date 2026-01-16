import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://54.226.88.47:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
