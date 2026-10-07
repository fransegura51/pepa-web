import { describe, expect, it } from 'vitest'
import { CONSENT_VERSION, buildSource, limpiarOrigen } from '@/lib/leads'

describe('origen y consentimiento de la lista de espera', () => {
  it('limpia el origen y descarta lo raro', () => {
    expect(limpiarOrigen('TikTok')).toBe('tiktok')
    expect(limpiarOrigen('a b<script>')).toBe('abscript')
    expect(limpiarOrigen('')).toBeNull()
    expect(limpiarOrigen(null)).toBeNull()
    expect(limpiarOrigen('x'.repeat(80))).toHaveLength(30)
  })

  it('guarda formulario, origen y versión del consentimiento en source', () => {
    expect(buildSource('home_acceso_anticipado', 'instagram')).toBe(`home_acceso_anticipado|utm=instagram|c=${CONSENT_VERSION}`)
    expect(buildSource('precios_page', null)).toBe(`precios_page|c=${CONSENT_VERSION}`)
  })
})
