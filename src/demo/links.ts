import { APP_URL } from '@/config/site'

// Origen con el que se etiqueta a quien llega a la app desde la demo.
// La app (family-app) lo lee al registrarse y lo guarda como metadato
// del usuario, sin datos personales, para medir cuánta gente llega
// desde aquí.
export const DEMO_ORIGIN = 'demo'

// guide: slug de la guía desde la que se llegó a la demo (ya validado por
// parseDemoEntry); permite medir qué guía trae registros.
export function buildSignupUrl(guide: string | null = null): string {
  const url = new URL(APP_URL)
  url.searchParams.set('origen', DEMO_ORIGIN)
  if (guide) url.searchParams.set('guia', guide)
  return url.toString()
}

// Salida de la demo: vuelve a la web (carga completa, la demo es otra página).
export const SITE_HOME = '/'
