import { supabase } from '@/lib/supabaseClient'
import type { PacoVideoRow } from '@/lib/admin/types'

function fromRow(r: {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  platform: string | null
  sort_order: number
  featured: boolean
  published: boolean
}): PacoVideoRow {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    videoUrl: r.video_url,
    thumbnailUrl: r.thumbnail_url,
    platform: r.platform,
    sortOrder: r.sort_order,
    featured: r.featured,
    published: r.published,
  }
}

// is_app_owner ve también los borradores (RLS), el público solo los publicados.
export async function listAdminVideos(): Promise<PacoVideoRow[]> {
  const { data, error } = await supabase.from('pepa_web_paco_videos').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return data.map(fromRow)
}

export async function listPublicVideos(): Promise<PacoVideoRow[]> {
  const { data, error } = await supabase
    .from('pepa_web_paco_videos')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data.map(fromRow)
}

export async function createVideo(input: {
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  platform: string
  featured: boolean
}): Promise<void> {
  const { error } = await supabase.from('pepa_web_paco_videos').insert({
    title: input.title,
    description: input.description || null,
    video_url: input.videoUrl,
    thumbnail_url: input.thumbnailUrl || null,
    platform: input.platform || null,
    featured: input.featured,
  })
  if (error) throw error
}

export async function updateVideo(
  id: string,
  input: { title: string; description: string; videoUrl: string; thumbnailUrl: string; platform: string; featured: boolean },
): Promise<void> {
  const { error } = await supabase
    .from('pepa_web_paco_videos')
    .update({
      title: input.title,
      description: input.description || null,
      video_url: input.videoUrl,
      thumbnail_url: input.thumbnailUrl || null,
      platform: input.platform || null,
      featured: input.featured,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}

export async function setVideoPublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase.from('pepa_web_paco_videos').update({ published, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function reorderVideos(orderedIds: string[]): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from('pepa_web_paco_videos').update({ sort_order: index }).eq('id', id)),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error(failed.error.message)
}

export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase.from('pepa_web_paco_videos').delete().eq('id', id)
  if (error) throw error
}
