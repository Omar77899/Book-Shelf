import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, /books is proxied to the Express server so no CORS/URL config is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/books': 'http://localhost:5000',
    },
  },
});
