import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DemoPage } from '@/demo/DemoPage'
import '@/styles/global.css'

// Entrada de la demo pública (/demo/). Deliberadamente NO comparte
// arranque con la web: sin router, sin proveedores de textos/imágenes
// y sin Supabase (ver tests/demo/isolation.test.ts).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoPage />
  </StrictMode>,
)
