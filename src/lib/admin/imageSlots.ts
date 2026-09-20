import { asset } from '@/lib/assetUrl'

// Lista blanca de fotos sustituibles desde /admin → Imágenes — mismo
// criterio que los textos editables (claves fijas, no libres). Cada
// clave se reutiliza en todos los sitios de la web donde aparezca ese
// módulo (hero, "Más organización", demo de la app, Eventos): subir
// una vez actualiza todos los sitios a la vez.
export interface ImageSlotDef {
  key: string
  label: string
  fallback: string
  fallbackAlt: string
}

export const IMAGE_SLOTS: ImageSlotDef[] = [
  { key: 'home', label: 'Inicio (hero)', fallback: asset('screenshots/home.webp'), fallbackAlt: 'Pantalla de inicio de PEPA' },
  { key: 'calendario', label: 'Calendario', fallback: asset('screenshots/calendario.webp'), fallbackAlt: 'Calendario compartido de PEPA' },
  { key: 'compras', label: 'Compras', fallback: asset('screenshots/compras.webp'), fallbackAlt: 'Lista de la compra de PEPA' },
  { key: 'economia', label: 'Economía', fallback: asset('screenshots/economia.webp'), fallbackAlt: 'Economía familiar en PEPA' },
  { key: 'cocina', label: 'Cocina', fallback: asset('screenshots/cocina.webp'), fallbackAlt: 'Menú semanal en PEPA' },
  { key: 'eventos', label: 'Eventos', fallback: asset('screenshots/eventos.webp'), fallbackAlt: 'Un evento organizado con PEPA' },
  { key: 'documentos', label: 'Documentos', fallback: asset('screenshots/documentos.svg'), fallbackAlt: 'Documentos de la familia en PEPA' },
]
