import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/auth': 'http://localhost:5001',
      '/users': 'http://localhost:5001',
      '/requests': 'http://localhost:5001',
      '/posts': 'http://localhost:5001',
      '/conversations': 'http://localhost:5001',
    }
  }
})
