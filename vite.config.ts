import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sirve el repo bajo /pepa-web/ hasta que haya dominio propio
// (entonces esto pasa a '/' y se añade un CNAME — ver public/404.html).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/pepa-web/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}))
