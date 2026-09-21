import { supabase } from '@/lib/supabaseClient'

// Contador de visitas ANÓNIMO de la web pública (se ve en /admin). No se guarda IP, navegador ni ninguna cookie:
// solo se avisa al servidor de "una página vista" (y, una vez al día por navegador, de "visitante nuevo"). Ver
// 0140_pepa_web_visits.sql en family-app.

export const NO_COUNT_KEY = 'pepa_web_no_count'
export const LAST_DAY_KEY = 'pepa_web_visit_day'

// Robots y vistas previas que no son visitas de personas.
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python-requests|httpclient/i

// Día en la zona horaria de la web (Madrid), igual que el servidor: "2026-09-21".
export function madridDay(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export interface VisitContext {
  path: string
  userAgent: string
  webdriver: boolean
  dev: boolean
  // El propio navegador de la administradora se excluye para no contarse a sí misma.
  optedOut: boolean
  lastCountedDay: string | null
  today: string
}

export function decideVisit(c: VisitContext): { count: boolean; newVisitor: boolean } {
  const isAdminPath = c.path === '/admin' || c.path.startsWith('/admin/')
  const count = !c.dev && !c.optedOut && !c.webdriver && !isAdminPath && c.userAgent.trim() !== '' && !BOT_RE.test(c.userAgent)
  return { count, newVisitor: count && c.lastCountedDay !== c.today }
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Modo privado o almacenamiento bloqueado: se cuenta la página igualmente, sin recordar el día.
  }
}

export function excludeThisDeviceFromVisits(): void {
  writeStorage(NO_COUNT_KEY, '1')
}

export function isThisDeviceExcluded(): boolean {
  return readStorage(NO_COUNT_KEY) !== null
}

let lastPath: string | null = null

// Llamar al entrar en cada página. Nunca lanza ni retrasa nada: si falla, la web sigue igual.
export function trackPageView(path: string): void {
  if (typeof window === 'undefined' || path === lastPath) return
  lastPath = path
  const today = madridDay()
  const { count, newVisitor } = decideVisit({
    path,
    userAgent: navigator.userAgent ?? '',
    webdriver: navigator.webdriver === true,
    dev: import.meta.env.DEV,
    optedOut: isThisDeviceExcluded(),
    lastCountedDay: readStorage(LAST_DAY_KEY),
    today,
  })
  if (!count) return
  if (newVisitor) writeStorage(LAST_DAY_KEY, today)
  void supabase.rpc('record_pepa_web_visit', { p_path: path, p_new_visitor: newVisitor }).then(
    () => undefined,
    () => undefined,
  )
}
