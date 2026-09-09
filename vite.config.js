import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server proxies /api to a local `vercel dev` process when you run
// one alongside `npm run dev`. In production on Vercel, /api is handled
// automatically by the serverless function in the api folder.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
