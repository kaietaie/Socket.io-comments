import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    // To access env vars here use process.env.VITE_PORT
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: `${process.env.VITE_HOST} : ${process.env.VITE_PORT || 3000}`,
          changeOrigin: true
        }
      },
    }
  });
}


