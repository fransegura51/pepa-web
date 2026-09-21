import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { VisitStatsView } from '../../src/components/admin/VisitStats'
import { pageLabel, summarizeVisits } from '../../src/lib/admin/visits'
import { decideVisit, madridDay, type VisitContext } from '../../src/lib/visits'

const ROOT = resolve(__dirname, '../..')
const read = (file: string) => readFileSync(resolve(ROOT, file), 'utf8')

const HUMAN: VisitContext = {
  path: '/precios',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
  webdriver: false,
  dev: false,
  optedOut: false,
  lastCountedDay: null,
  today: '2026-09-21',
}

describe('qué visitas se cuentan', () => {
  it('una persona normal cuenta, y es visitante nuevo la primera vez del día', () => {
    expect(decideVisit(HUMAN)).toEqual({ count: true, newVisitor: true })
  })

  it('la segunda página del mismo día cuenta como página vista pero no como visitante nuevo; al día siguiente vuelve a serlo', () => {
    expect(decideVisit({ ...HUMAN, lastCountedDay: '2026-09-21' })).toEqual({ count: true, newVisitor: false })
    expect(decideVisit({ ...HUMAN, lastCountedDay: '2026-09-20' })).toEqual({ count: true, newVisitor: true })
  })

  it.each([
    ['el panel de administración', { path: '/admin/videos' }],
    ['la raíz del panel', { path: '/admin' }],
    ['desarrollo local', { dev: true }],
    ['el navegador de la administradora', { optedOut: true }],
    ['un navegador automatizado', { webdriver: true }],
    ['Googlebot', { userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }],
    ['una vista previa de WhatsApp', { userAgent: 'WhatsApp/2.23.20.0' }],
    ['una herramienta (curl)', { userAgent: 'curl/8.4.0' }],
    ['sin navegador identificable', { userAgent: '' }],
  ])('no cuenta: %s', (_name, over) => {
    expect(decideVisit({ ...HUMAN, ...over })).toEqual({ count: false, newVisitor: false })
  })

  it('"/administracion" no es el panel: sí cuenta', () => {
    expect(decideVisit({ ...HUMAN, path: '/administracion' }).count).toBe(true)
  })

  it('el día es el de Madrid, igual que el del servidor', () => {
    expect(madridDay(new Date('2026-09-21T22:30:00Z'))).toBe('2026-09-22')
    expect(madridDay(new Date('2026-09-21T10:00:00Z'))).toBe('2026-09-21')
  })
})

describe('resumen para el panel', () => {
  const rows = [
    { day: '2026-09-21', path: '/', views: 10, visitors: 6 },
    { day: '2026-09-21', path: '/precios', views: 4, visitors: 1 },
    { day: '2026-09-20', path: '/', views: 5, visitors: 5 },
    { day: '2026-09-16', path: '/funciones', views: 3, visitors: 2 },
    { day: '2026-09-15', path: '/', views: 100, visitors: 50 },
    { day: '2026-08-23', path: '/', views: 7, visitors: 7 },
  ]
  const s = summarizeVisits(rows, '2026-09-21')

  it('hoy, ayer, 7 y 30 días', () => {
    expect(s.today).toEqual({ views: 14, visitors: 7 })
    expect(s.yesterday).toEqual({ views: 5, visitors: 5 })
    // 7 días = del 15 al 21 de septiembre
    expect(s.last7).toEqual({ views: 122, visitors: 64 })
    // 30 días = del 23 de agosto al 21 de septiembre (incluye ambos extremos)
    expect(s.last30).toEqual({ views: 129, visitors: 71 })
  })

  it('serie de 30 días completa, ordenada, con ceros donde no hubo visitas', () => {
    expect(s.series).toHaveLength(30)
    expect(s.series[0].day).toBe('2026-08-23')
    expect(s.series[29].day).toBe('2026-09-21')
    expect(s.series.find((d) => d.day === '2026-09-10')).toEqual({ day: '2026-09-10', views: 0, visitors: 0 })
  })

  it('páginas más vistas', () => {
    expect(s.topPages[0]).toEqual({ path: '/', views: 122 })
    expect(s.topPages.map((p) => p.path)).toEqual(['/', '/precios', '/funciones'])
    expect(pageLabel('/')).toBe('Inicio')
  })

  it('sin datos: todo a cero y sin romper', () => {
    const empty = summarizeVisits([], '2026-09-21')
    expect(empty.last30).toEqual({ views: 0, visitors: 0 })
    expect(empty.topPages).toEqual([])
    const html = renderToString(<VisitStatsView summary={empty} totals={null} excludedDevice={false} />)
    expect(html).toContain('Todavía no hay visitas registradas')
  })

  it('el panel enseña los números, los totales y el aviso del navegador excluido', () => {
    const html = renderToString(<VisitStatsView summary={s} totals={{ totalViews: 12345, totalVisitors: 456, since: '2026-09-20' }} excludedDevice />)
    const text = html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    for (const expected of ['Visitas a la web', 'Hoy', 'Ayer', 'Últimos 7 días', 'Últimos 30 días', 'Inicio', '12.345', '456', 'Desde el 20/9', 'Sin cookies ni datos personales', 'no cuenta tus propias visitas']) {
      expect(text, expected).toContain(expected)
    }
  })
})

describe('integración', () => {
  it('la web cuenta cada página y el panel de inicio enseña las visitas', () => {
    expect(read('src/App.tsx')).toContain('<PageViewTracker />')
    expect(read('src/pages/admin/AdminHome.tsx')).toContain('<VisitStatsPanel />')
  })

  it('la administradora se excluye a sí misma del contador', () => {
    expect(read('src/components/admin/AdminLayout.tsx')).toContain('excludeThisDeviceFromVisits()')
  })

  it('el cliente solo avisa por la función pública y no guarda datos personales', () => {
    const src = read('src/lib/visits.ts')
    expect(src).toContain("rpc('record_pepa_web_visit'")
    expect(src).not.toMatch(/document\.cookie/)
    expect(src).not.toMatch(/fingerprint|geolocation|ipify|canvas\.toDataURL/i)
  })

  it('la política de privacidad lo explica', () => {
    const page = read('src/pages/Privacidad.tsx')
    expect(page).toContain('cuenta las visitas de forma anónima')
    expect(page).toContain('no guarda tu dirección IP')
  })
})
