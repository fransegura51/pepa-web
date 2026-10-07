import { supabase } from '@/lib/supabaseClient'

// Versión del texto de consentimiento que ve la persona al apuntarse. Se guarda
// junto al origen en `source` (la tabla no tiene columnas propias para esto)
// para poder demostrar qué texto aceptó. Si se cambia el texto, subir la versión.
export const CONSENT_VERSION = '2026-10'

const ORIGEN_KEY = 'pepa_origen'

/** Limpia un origen (utm) para que solo tenga letras, números, guion y guion bajo. */
export function limpiarOrigen(valor: string | null | undefined): string | null {
  const v = (valor || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30)
  return v || null
}

/** Guarda el origen de la visita si el enlace trae ?utm=... o ?utm_source=... */
export function captureOrigin(): void {
  try {
    const p = new URLSearchParams(window.location.search)
    const o = limpiarOrigen(p.get('utm') || p.get('utm_source'))
    if (o) sessionStorage.setItem(ORIGEN_KEY, o)
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

export function getOrigin(): string | null {
  try {
    return limpiarOrigen(sessionStorage.getItem(ORIGEN_KEY))
  } catch {
    return null
  }
}

/** Construye el valor de `source`: formulario de origen + utm + versión del consentimiento. */
export function buildSource(base: string, origen: string | null): string {
  return [base, origen ? `utm=${origen}` : null, `c=${CONSENT_VERSION}`].filter(Boolean).join('|')
}

export async function addLead(input: { email: string; name?: string; message?: string; source?: string }) {
  const { error } = await supabase.from('pepa_web_leads').insert({
    email: input.email,
    name: input.name || null,
    message: input.message || null,
    source: buildSource(input.source || 'landing_hero_form', getOrigin()),
  })
  if (error) {
    if (error.code === '23505') throw new Error('Ya estabas en la lista con ese email.')
    throw error
  }
}
