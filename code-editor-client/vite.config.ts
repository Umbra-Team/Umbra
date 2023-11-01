import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
declare const global: Window;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: typeof global === 'undefined' && Window,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
