import { supabase } from '@/lib/supabaseClient'

export interface VisitRow {
  day: string
  path: string
  views: number
  visitors: number
}

export interface VisitTotals {
  totalViews: number
  totalVisitors: number
  since: string | null
}

export interface Counts {
  views: number
  visitors: number
}

export interface VisitSummary {
  today: Counts
  yesterday: Counts
  last7: Counts
  last30: Counts
  // Los últimos 30 días, del más antiguo al de hoy, con ceros donde no hubo visitas.
  series: { day: string; views: number; visitors: number }[]
  topPages: { path: string; views: number }[]
}

export async function getVisitRows(days = 30): Promise<VisitRow[]> {
  const { data, error } = await supabase.rpc('get_pepa_web_visit_stats', { p_days: days })
  if (error) throw error
  return (data as { day: string; path: string; views: number | string; visitors: number | string }[]).map((r) => ({
    day: r.day,
    path: r.path,
    views: Number(r.views),
    visitors: Number(r.visitors),
  }))
}

export async function getVisitTotals(): Promise<VisitTotals> {
  const { data, error } = await supabase.rpc('get_pepa_web_visit_totals')
  if (error) throw error
  const row = (data as { total_views: number | string; total_visitors: number | string; since: string | null }[])[0]
  return { totalViews: Number(row?.total_views ?? 0), totalVisitors: Number(row?.total_visitors ?? 0), since: row?.since ?? null }
}

function addDays(day: string, delta: number): string {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10)
}

function sum(list: { views: number; visitors: number }[]): Counts {
  return list.reduce((acc, r) => ({ views: acc.views + r.views, visitors: acc.visitors + r.visitors }), { views: 0, visitors: 0 })
}

// Suma por día y por página lo que devuelve el servidor. `today` es el día de Madrid ("2026-09-21").
export function summarizeVisits(rows: VisitRow[], today: string, days = 30): VisitSummary {
  const byDay = new Map<string, Counts>()
  const byPath = new Map<string, number>()
  for (const r of rows) {
    const c = byDay.get(r.day) ?? { views: 0, visitors: 0 }
    byDay.set(r.day, { views: c.views + r.views, visitors: c.visitors + r.visitors })
    byPath.set(r.path, (byPath.get(r.path) ?? 0) + r.views)
  }
  const series = Array.from({ length: days }, (_, i) => {
    const day = addDays(today, i - (days - 1))
    const c = byDay.get(day) ?? { views: 0, visitors: 0 }
    return { day, views: c.views, visitors: c.visitors }
  })
  return {
    today: sum(series.slice(-1)),
    yesterday: sum(series.slice(-2, -1)),
    last7: sum(series.slice(-7)),
    last30: sum(series),
    series,
    topPages: [...byPath.entries()]
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views || a.path.localeCompare(b.path))
      .slice(0, 8),
  }
}

export function pageLabel(path: string): string {
  return path === '/' ? 'Inicio' : path
}
