import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dominio propio ya comprado (pepafamilyapp.es) — se sirve desde la
// raíz, con public/CNAME. Antes de esto vivía en /pepa-web/ (ver
// git log de vite.config.ts si hiciera falta volver atrás).
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
