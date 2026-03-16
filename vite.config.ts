import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'ChatbotWidget',
      formats: ['iife'],
      fileName: () => 'embed.bundle.js',
    },
  },
})
