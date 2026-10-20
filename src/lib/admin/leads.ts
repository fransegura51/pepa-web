import { supabase } from '@/lib/supabaseClient'

export interface LeadRow {
  created_at: string
  source: string | null
}

export interface LeadSummary {
  total: number
  last7: number
  byChannel: { channel: string; count: number }[]
}

/** Saca el canal de `source` ("formulario|utm=tiktok|c=2026-10"). Sin utm: "directo". */
export function channelOf(source: string | null | undefined): string {
  const m = /(?:^|\|)utm=([a-z0-9_-]+)/.exec(source || '')
  return m ? m[1] : 'directo'
}

export function summarizeLeads(rows: LeadRow[], now: Date = new Date()): LeadSummary {
  const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000
  const counts = new Map<string, number>()
  let last7 = 0
  for (const r of rows) {
    const c = channelOf(r.source)
    counts.set(c, (counts.get(c) ?? 0) + 1)
    if (new Date(r.created_at).getTime() >= weekAgo) last7 += 1
  }
  const byChannel = [...counts.entries()].map(([channel, count]) => ({ channel, count })).sort((a, b) => b.count - a.count)
  return { total: rows.length, last7, byChannel }
}

export async function getLeadRows(): Promise<LeadRow[]> {
  const { data, error } = await supabase.from('pepa_web_leads').select('created_at, source').order('created_at', { ascending: false }).limit(5000)
  if (error) throw error
  return (data ?? []) as LeadRow[]
}
