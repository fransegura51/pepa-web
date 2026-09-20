import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DEMO_STEPS, DEMO_TABS, demoReducer, initialState, stepIndex } from '../../src/demo/state'

const ROOT = resolve(__dirname, '../..')

describe('pantallas de la demo', () => {
  it('son 6, en el orden Inicio → Calendario → Compras → Economía → Cocina → Cumpleaños', () => {
    expect(DEMO_STEPS.map((s) => s.tab)).toEqual(['inicio', 'calendario', 'compras', 'economia', 'cocina', 'cumpleanos'])
    expect(DEMO_TABS.map((t) => t.id)).toEqual(DEMO_STEPS.map((s) => s.tab))
  })

  it('cada una tiene título, explicación y texto alternativo de verdad', () => {
    for (const s of DEMO_STEPS) {
      expect(s.title.length, s.tab).toBeGreaterThan(5)
      expect(s.text.length, s.tab).toBeGreaterThan(40)
      expect(s.alt.length, s.tab).toBeGreaterThan(30)
    }
  })

  it('cada pantalla usa una captura real (WebP 750×1624) que existe en el proyecto', () => {
    for (const s of DEMO_STEPS) {
      const rel = s.image.replace(/^\//, '')
      expect(rel, s.tab).toMatch(/^screenshots\/[a-z]+\.webp$/)
      const file = resolve(ROOT, 'public', rel)
      expect(existsSync(file), `${s.tab}: falta ${rel}`).toBe(true)
      const size = statSync(file).size
      expect(size, `${s.tab} pesa ${size} bytes`).toBeGreaterThan(20_000)
      expect(size, `${s.tab} pesa demasiado`).toBeLessThan(400_000)
      const buf = readFileSync(file)
      expect(buf.subarray(0, 4).toString('ascii'), s.tab).toBe('RIFF')
      expect(buf.subarray(8, 12).toString('ascii'), s.tab).toBe('WEBP')
      // Cabecera VP8 (con pérdida): ancho y alto en 14 bits.
      expect(buf.subarray(12, 16).toString('ascii'), s.tab).toBe('VP8 ')
      expect(buf.readUInt16LE(26) & 0x3fff, `${s.tab} ancho`).toBe(750)
      expect(buf.readUInt16LE(28) & 0x3fff, `${s.tab} alto`).toBe(1624)
    }
  })

  it('no hay dos pantallas con la misma captura', () => {
    expect(new Set(DEMO_STEPS.map((s) => s.image)).size).toBe(DEMO_STEPS.length)
  })
})

describe('navegación', () => {
  it('empieza en Inicio, o en la zona pedida desde una guía', () => {
    expect(initialState().tab).toBe('inicio')
    expect(initialState('cocina').tab).toBe('cocina')
  })

  it('siguiente y anterior recorren las pantallas y se paran en los extremos', () => {
    let s = initialState()
    s = demoReducer(s, { type: 'prev' })
    expect(s.tab).toBe('inicio')
    for (let i = 0; i < 10; i++) s = demoReducer(s, { type: 'next' })
    expect(s.tab).toBe('cumpleanos')
    expect(stepIndex(s.tab)).toBe(DEMO_STEPS.length - 1)
    s = demoReducer(s, { type: 'prev' })
    expect(s.tab).toBe('cocina')
  })

  it('se puede saltar directamente a cualquier pantalla', () => {
    expect(demoReducer(initialState(), { type: 'goTab', tab: 'economia' }).tab).toBe('economia')
  })
})
