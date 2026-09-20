import { describe, expect, it } from 'vitest'
import { parseDemoEntry } from '../../src/demo/entry'
import { buildSignupUrl } from '../../src/demo/links'
import { demoReducer, initialState } from '../../src/demo/state'

describe('entrada a la demo desde una guía', () => {
  it('reconoce zona y guía válidas', () => {
    expect(parseDemoEntry('?zona=economia&desde=presupuesto-familiar-sin-hojas-complicadas')).toEqual({
      tab: 'economia',
      guide: 'presupuesto-familiar-sin-hojas-complicadas',
    })
  })

  it('sin parámetros, entra como siempre', () => {
    expect(parseDemoEntry('')).toEqual({ tab: null, guide: null })
  })

  it('ignora zonas que no existen', () => {
    for (const zona of ['admin', 'ubicacion', 'INICIO', '', '../x', '<script>']) {
      expect(parseDemoEntry(`?zona=${encodeURIComponent(zona)}`).tab).toBeNull()
    }
  })

  it('solo acepta guías con formato de slug (nada de texto libre)', () => {
    for (const desde of ['Mi Guía', 'a b', '<script>alert(1)</script>', 'a/b', '-x', 'x-', 'a'.repeat(61), 'a--b', '../etc']) {
      expect(parseDemoEntry(`?desde=${encodeURIComponent(desde)}`).guide, desde).toBeNull()
    }
    expect(parseDemoEntry(`?desde=${'a'.repeat(60)}`).guide).toBe('a'.repeat(60))
  })
})

describe('abrir la demo en una zona', () => {
  it('abre esa pantalla directamente', () => {
    expect(initialState('cumpleanos').tab).toBe('cumpleanos')
  })

  it('sin zona, abre en Inicio como siempre', () => {
    expect(initialState().tab).toBe('inicio')
    expect(initialState(null).tab).toBe('inicio')
  })

  it('desde una zona se puede seguir navegando', () => {
    expect(demoReducer(initialState('cocina'), { type: 'next' }).tab).toBe('cumpleanos')
  })
})

describe('"Crear mi familia" conserva la guía de origen', () => {
  it('añade guia=<slug> junto a origen=demo', () => {
    const url = new URL(buildSignupUrl('reparto-tareas-casa-justo'))
    expect(url.searchParams.get('origen')).toBe('demo')
    expect(url.searchParams.get('guia')).toBe('reparto-tareas-casa-justo')
  })

  it('sin guía, solo origen=demo', () => {
    const url = new URL(buildSignupUrl())
    expect(url.searchParams.get('origen')).toBe('demo')
    expect(url.searchParams.has('guia')).toBe(false)
  })
})
