import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    // La HOME importa el cliente de datos de la web: con estas variables de
    // prueba se puede pintar en el servidor sin conectar a nada.
    env: { VITE_SUPABASE_URL: 'http://localhost:54321', VITE_SUPABASE_ANON_KEY: 'clave-de-prueba' },
    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
