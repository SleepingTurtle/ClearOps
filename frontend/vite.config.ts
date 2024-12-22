import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '..'));

  return {
    plugins: [react()],
    define: {
      'process.env': { ...rootEnv },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: rootEnv.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});