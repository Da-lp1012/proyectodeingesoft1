import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    // El navegador llama a /api en su mismo origen y Vite reenvía a la API:
    // así no hay CORS ni hace falta instalar el paquete cors.
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    // Docker Desktop (Windows/macOS) a veces no propaga eventos de archivo al contenedor;
    // con polling el hot-reload funciona, a costa de algo de CPU.
    watch: process.env.WATCH_POLLING === 'true' ? { usePolling: true } : undefined,
  },
});
