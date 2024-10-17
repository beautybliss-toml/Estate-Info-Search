import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://62.3.6.117:8081',
        changeOrigin: true,
        secure: false,
      },
      '/api1': {
        target: 'http://62.3.6.117:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../backend/client/build', // Specify your custom output directory here
  },
})
