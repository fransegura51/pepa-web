import { describe, expect, it } from 'vitest'
import { CONSENT_VERSION, buildSource, captureOrigin, getOrigin, limpiarOrigen } from '@/lib/leads'

describe('origen y consentimiento de la lista de espera', () => {
  it('limpia el origen y descarta lo raro', () => {
    expect(limpiarOrigen('TikTok')).toBe('tiktok')
    expect(limpiarOrigen('a b<script>')).toBe('abscript')
    expect(limpiarOrigen('')).toBeNull()
    expect(limpiarOrigen(null)).toBeNull()
    expect(limpiarOrigen('x'.repeat(80))).toHaveLength(30)
  })

  it('captura ?origen= y lo recupera para el alta', () => {
    const store: Record<string, string> = {}
    const g = globalThis as unknown as Record<string, unknown>
    g.window = { location: { search: '?origen=TikTok' } }
    g.sessionStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => void (store[k] = v),
    }
    captureOrigin()
    expect(getOrigin()).toBe('tiktok')
    delete g.window
    delete g.sessionStorage
  })

  it('guarda formulario, origen y versión del consentimiento en source', () => {
    expect(buildSource('home_acceso_anticipado', 'instagram')).toBe(`home_acceso_anticipado|utm=instagram|c=${CONSENT_VERSION}`)
    expect(buildSource('precios_page', null)).toBe(`precios_page|c=${CONSENT_VERSION}`)
  })
})
