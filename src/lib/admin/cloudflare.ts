import { supabase } from '@/lib/supabaseClient'

export interface CloudflareStats {
  configured: boolean
  error?: string
  days?: { day: string; views: number; visits: number }[]
  countries?: { name: string; views: number }[]
  referrers?: { name: string; views: number }[]
  paths?: { name: string; views: number }[]
}

export function totalsOf(stats: CloudflareStats): { views: number; visits: number } {
  const days = stats.days ?? []
  return { views: days.reduce((a, d) => a + d.views, 0), visits: days.reduce((a, d) => a + d.visits, 0) }
}

export async function getCloudflareStats(): Promise<CloudflareStats> {
  const { data, error } = await supabase.functions.invoke('pepa-web-cloudflare')
  if (error) throw error
  return data as CloudflareStats
}
