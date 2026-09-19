import { supabase } from '@/lib/supabaseClient'

export async function getImageMap(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('pepa_web_images').select('key, url')
  if (error) throw error
  return Object.fromEntries(data.map((r) => [r.key, r.url]))
}

export async function setImage(key: string, url: string, alt?: string): Promise<void> {
  const { error } = await supabase.from('pepa_web_images').upsert({ key, url, alt: alt || null, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function clearImage(key: string): Promise<void> {
  const { error } = await supabase.from('pepa_web_images').delete().eq('key', key)
  if (error) throw error
}
