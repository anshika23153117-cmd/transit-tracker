import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite: "Any request starting with /airlabs should go to airlabs.co"
      '/airlabs': {
        target: 'https://airlabs.co/api/v9',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/airlabs/, ''),
      },
    },
  },
})