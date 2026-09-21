import { DEMO_TABS, type DemoTab } from '@/demo/state'

// Entrada a la demo desde una guía: /demo/?zona=cumpleanos&desde=<slug>
// - zona: pestaña con la que se abre (lista cerrada, la de DEMO_TABS).
// - desde: slug de la guía de origen; solo sirve para medir qué guía
//   trae gente (se reenvía a "Crear mi familia"). Formato estricto: nada
//   de texto libre.
export interface DemoEntry {
  tab: DemoTab | null
  guide: string | null
}

const GUIDE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const MAX_GUIDE_LENGTH = 60

export function parseDemoEntry(search: string): DemoEntry {
  const params = new URLSearchParams(search)
  const zone = params.get('zona')
  const from = params.get('desde')
  // «cumpleanos» era la zona de la demo antigua (el evento del cumpleaños);
  // las guías que la usan siguen llegando a ese mismo sitio.
  const tab = zone === 'cumpleanos' ? 'eventos' : (DEMO_TABS.find((t) => t.id === zone)?.id ?? null)
  const guide = from && from.length <= MAX_GUIDE_LENGTH && GUIDE_RE.test(from) ? from : null
  return { tab, guide }
}
