import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use root path (/) for custom domain, /portfolio/ for GitHub Pages subdirectory
  base: mode === 'github-pages' ? '/portfolio/' : '/',
}))
