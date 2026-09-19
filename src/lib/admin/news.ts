import { supabase } from '@/lib/supabaseClient'
import type { NewsRow } from '@/lib/admin/types'

function fromRow(r: {
  id: string
  title: string
  description: string
  image_url: string | null
  link_url: string | null
  published_at: string | null
  published: boolean
}): NewsRow {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    imageUrl: r.image_url,
    linkUrl: r.link_url,
    publishedAt: r.published_at,
    published: r.published,
  }
}

export async function listAdminNews(): Promise<NewsRow[]> {
  const { data, error } = await supabase.from('pepa_web_news').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(fromRow)
}

export async function listPublicNews(): Promise<NewsRow[]> {
  const { data, error } = await supabase
    .from('pepa_web_news')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (error) throw error
  return data.map(fromRow)
}

export interface NewsInput {
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  publishedAt: string
}

export async function createNews(input: NewsInput): Promise<void> {
  const { error } = await supabase.from('pepa_web_news').insert({
    title: input.title,
    description: input.description,
    image_url: input.imageUrl || null,
    link_url: input.linkUrl || null,
    published_at: input.publishedAt || null,
  })
  if (error) throw error
}

export async function updateNews(id: string, input: NewsInput): Promise<void> {
  const { error } = await supabase
    .from('pepa_web_news')
    .update({
      title: input.title,
      description: input.description,
      image_url: input.imageUrl || null,
      link_url: input.linkUrl || null,
      published_at: input.publishedAt || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}

export async function setNewsPublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase.from('pepa_web_news').update({ published, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase.from('pepa_web_news').delete().eq('id', id)
  if (error) throw error
}
