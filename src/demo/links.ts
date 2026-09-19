import { APP_URL } from '@/config/site'

// Origen con el que se etiqueta a quien llega a la app desde la demo.
// La app (family-app) lo lee al registrarse y lo guarda como metadato
// del usuario, sin datos personales, para medir cuánta gente llega
// desde aquí.
export const DEMO_ORIGIN = 'demo'

export function buildSignupUrl(): string {
  const url = new URL(APP_URL)
  url.searchParams.set('origen', DEMO_ORIGIN)
  return url.toString()
}

// Salida de la demo: vuelve a la web (carga completa, la demo es otra página).
export const SITE_HOME = '/'
