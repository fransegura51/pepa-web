import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DEMO_MODULES, DEMO_SCREENS, DEMO_TABS, demoReducer, globalIndex, initialState, moduleOf } from '../../src/demo/state'

const ROOT = resolve(__dirname, '../..')

describe('secciones de la demo', () => {
  it('recorren toda la app, empezando por Inicio', () => {
    const ids = DEMO_MODULES.map((m) => m.tab)
    expect(ids[0]).toBe('inicio')
    for (const id of ['familia', 'calendario', 'eventos', 'puntos', 'compras', 'cocina', 'economia', 'cumples', 'contactos', 'documentos']) {
      expect(ids, id).toContain(id)
    }
    expect(DEMO_TABS.map((t) => t.id)).toEqual(ids)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('el calendario enseña sus 9 vistas y Economía desglosa cuentas, estadísticas, movimientos y banco', () => {
    expect(moduleOf('calendario').screens.map((s) => s.label)).toEqual([
      'Vista general',
      'Mes',
      'Semana',
      '3 días',
      'Día',
      'Familiar',
      'Agenda',
      'Personal',
      'Externos',
    ])
    const eco = moduleOf('economia').screens.map((s) => s.label)
    for (const label of ['Resumen', 'Categorías', 'Movimientos', 'Presupuestos', 'Banco', 'Hucha de los niños']) {
      expect(eco, label).toContain(label)
    }
  })

  it('cada pantalla tiene título, explicación y texto alternativo de verdad', () => {
    for (const { tab, screen: s } of DEMO_SCREENS) {
      const id = `${tab}/${s.label}`
      expect(s.label.length, id).toBeGreaterThan(1)
      expect(s.title.length, id).toBeGreaterThan(5)
      expect(s.text.length, id).toBeGreaterThan(30)
      expect(s.alt.length, id).toBeGreaterThan(30)
    }
  })

  it('cada pantalla usa una captura real (WebP 750×1624) que existe en el proyecto', () => {
    for (const { tab, screen: s } of DEMO_SCREENS) {
      const id = `${tab}/${s.label}`
      const rel = s.image.replace(/^\//, '')
      expect(rel, id).toMatch(/^screenshots\/demo\/[a-z0-9-]+\.webp$/)
      const file = resolve(ROOT, 'public', rel)
      expect(existsSync(file), `${id}: falta ${rel}`).toBe(true)
      const size = statSync(file).size
      expect(size, `${id} pesa ${size} bytes`).toBeGreaterThan(20_000)
      expect(size, `${id} pesa demasiado`).toBeLessThan(400_000)
      const buf = readFileSync(file)
      expect(buf.subarray(0, 4).toString('ascii'), id).toBe('RIFF')
      expect(buf.subarray(8, 12).toString('ascii'), id).toBe('WEBP')
      // Con pérdida: cabecera VP8 (ancho y alto en 14 bits) o VP8X (extendida,
      // ancho-1 y alto-1 en 24 bits).
      const kind = buf.subarray(12, 16).toString('ascii')
      expect(['VP8 ', 'VP8X'], id).toContain(kind)
      const width = kind === 'VP8X' ? buf.readUIntLE(24, 3) + 1 : buf.readUInt16LE(26) & 0x3fff
      const height = kind === 'VP8X' ? buf.readUIntLE(27, 3) + 1 : buf.readUInt16LE(28) & 0x3fff
      expect(width, `${id} ancho`).toBe(750)
      expect(height, `${id} alto`).toBe(1624)
    }
  })

  it('no hay dos pantallas con la misma captura', () => {
    expect(new Set(DEMO_SCREENS.map((s) => s.screen.image)).size).toBe(DEMO_SCREENS.length)
  })
})

describe('navegación', () => {
  it('empieza en Inicio, o en la zona pedida desde una guía', () => {
    expect(initialState()).toEqual({ tab: 'inicio', screen: 0 })
    expect(initialState('cocina')).toEqual({ tab: 'cocina', screen: 0 })
  })

  it('siguiente y anterior recorren todas las pantallas y se paran en los extremos', () => {
    let s = initialState()
    s = demoReducer(s, { type: 'prev' })
    expect(globalIndex(s)).toBe(0)
    for (let i = 0; i < DEMO_SCREENS.length + 10; i++) s = demoReducer(s, { type: 'next' })
    expect(globalIndex(s)).toBe(DEMO_SCREENS.length - 1)
    s = demoReducer(s, { type: 'prev' })
    expect(globalIndex(s)).toBe(DEMO_SCREENS.length - 2)
  })

  it('siguiente pasa de una sección a la siguiente al acabar sus pantallas', () => {
    const first = DEMO_MODULES[0]
    let s = initialState()
    for (let i = 0; i < first.screens.length; i++) s = demoReducer(s, { type: 'next' })
    expect(s).toEqual({ tab: DEMO_MODULES[1].tab, screen: 0 })
  })

  it('se puede saltar a cualquier sección y a cualquier pantalla de ella', () => {
    const s = demoReducer(initialState(), { type: 'goTab', tab: 'economia' })
    expect(s).toEqual({ tab: 'economia', screen: 0 })
    expect(demoReducer(s, { type: 'goScreen', screen: 3 }).screen).toBe(3)
    expect(demoReducer(s, { type: 'goScreen', screen: 999 }).screen).toBe(moduleOf('economia').screens.length - 1)
    expect(demoReducer(s, { type: 'goScreen', screen: -4 }).screen).toBe(0)
  })

  it('cambiar de sección vuelve a su primera pantalla', () => {
    let s = demoReducer(initialState('calendario'), { type: 'goScreen', screen: 5 })
    s = demoReducer(s, { type: 'goTab', tab: 'compras' })
    expect(s.screen).toBe(0)
  })
})
