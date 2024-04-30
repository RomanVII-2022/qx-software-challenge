import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/tasks': 'https://task.quatrixglobal.com'
    }
  },
  plugins: [react()],
})
