import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        timeout: 5000,
        // Ignore connection errors - fallback logic handles them
        ws: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
