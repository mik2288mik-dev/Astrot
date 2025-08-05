import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/main.tsx',
      external: [],
    },
  },
  optimizeDeps: {
    include: ['framework7', 'framework7-react', 'konsta'],
  },
  server: {
    host: true,
    port: 3000,
  },
});
