import { describe, expect, it } from 'vitest'
import { channelOf, summarizeLeads } from '@/lib/admin/leads'

describe('channelOf', () => {
  it('saca el canal de utm=', () => {
    expect(channelOf('landing_hero_form|utm=tiktok|c=2026-10')).toBe('tiktok')
  })
  it('sin utm es directo', () => {
    expect(channelOf('landing_hero_form|c=2026-10')).toBe('directo')
    expect(channelOf(null)).toBe('directo')
  })
})

describe('summarizeLeads', () => {
  it('cuenta el total, la última semana y por canal', () => {
    const now = new Date('2026-10-20T12:00:00Z')
    const rows = [
      { created_at: '2026-10-19T10:00:00Z', source: 'f|utm=tiktok|c=1' },
      { created_at: '2026-10-18T10:00:00Z', source: 'f|utm=tiktok|c=1' },
      { created_at: '2026-09-01T10:00:00Z', source: 'f|c=1' },
    ]
    const s = summarizeLeads(rows, now)
    expect(s.total).toBe(3)
    expect(s.last7).toBe(2)
    expect(s.byChannel[0]).toEqual({ channel: 'tiktok', count: 2 })
    expect(s.byChannel[1]).toEqual({ channel: 'directo', count: 1 })
  })
})
