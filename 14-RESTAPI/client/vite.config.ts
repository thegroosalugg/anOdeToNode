import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // expose local host to other devices on network
  server: {
    host: true, // or "0.0.0.0"
  },
  // tell vite to resolve absolute paths
  resolve: {
    alias: {
      '@': '/src'
    }
  }
  // end
})
