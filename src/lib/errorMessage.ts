// Los errores de Supabase Auth llegan como objetos planos con
// `.message`, no como instancias de Error (mismo comportamiento ya
// documentado en family-app/src/domain/errorMessage.ts) — con
// `instanceof Error` se perdía el motivo real y solo quedaba un
// mensaje genérico, imposible de depurar a distancia.
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message || fallback
  if (typeof err === 'string') return err || fallback
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string' && m) return m
  }
  return fallback
}

const TRANSLATIONS: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos.',
  'Email not confirmed': 'El email de esta cuenta todavía no está confirmado.',
}

export function authErrorMessage(err: unknown): string {
  const raw = errorMessage(err, 'No se ha podido entrar.')
  if (TRANSLATIONS[raw]) return TRANSLATIONS[raw]
  if (/rate limit/i.test(raw)) return 'Demasiados intentos seguidos — espera un minuto y vuelve a intentarlo.'
  return raw
}
