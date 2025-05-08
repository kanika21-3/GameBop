import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // This changes the output folder to 'build'
    emptyOutDir: true, // Optional: cleans the output directory before each build
  },
  server: {
    port: 3000, // Optional: customize the dev server port
    open: true  // Optional: auto-open browser on dev server start
  }
})
