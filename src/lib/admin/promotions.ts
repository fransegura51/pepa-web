import { supabase } from '@/lib/supabaseClient'
import type { PromotionRow } from '@/lib/admin/types'

function fromRow(r: {
  id: string
  title: string
  body: string
  image_url: string | null
  button_text: string | null
  button_url: string | null
  starts_at: string | null
  ends_at: string | null
  published: boolean
}): PromotionRow {
  return {
    id: r.id,
    title: r.title,
    body: r.body,
    imageUrl: r.image_url,
    buttonText: r.button_text,
    buttonUrl: r.button_url,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
    published: r.published,
  }
}

export async function listAdminPromotions(): Promise<PromotionRow[]> {
  const { data, error } = await supabase.from('pepa_web_promotions').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(fromRow)
}

// La franja pública solo debe mostrar como mucho una promo activa.
export async function getActivePromotion(): Promise<PromotionRow | null> {
  const { data, error } = await supabase
    .from('pepa_web_promotions')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(1)
  if (error) throw error
  return data.length > 0 ? fromRow(data[0]) : null
}

export interface PromotionInput {
  title: string
  body: string
  imageUrl: string
  buttonText: string
  buttonUrl: string
  startsAt: string
  endsAt: string
}

export async function createPromotion(input: PromotionInput): Promise<void> {
  const { error } = await supabase.from('pepa_web_promotions').insert({
    title: input.title,
    body: input.body,
    image_url: input.imageUrl || null,
    button_text: input.buttonText || null,
    button_url: input.buttonUrl || null,
    starts_at: input.startsAt || null,
    ends_at: input.endsAt || null,
  })
  if (error) throw error
}

export async function updatePromotion(id: string, input: PromotionInput): Promise<void> {
  const { error } = await supabase
    .from('pepa_web_promotions')
    .update({
      title: input.title,
      body: input.body,
      image_url: input.imageUrl || null,
      button_text: input.buttonText || null,
      button_url: input.buttonUrl || null,
      starts_at: input.startsAt || null,
      ends_at: input.endsAt || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}

export async function setPromotionPublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase.from('pepa_web_promotions').update({ published, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function deletePromotion(id: string): Promise<void> {
  const { error } = await supabase.from('pepa_web_promotions').delete().eq('id', id)
  if (error) throw error
}
