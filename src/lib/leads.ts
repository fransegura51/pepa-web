import { supabase } from '@/lib/supabaseClient'

export async function addLead(input: { email: string; name?: string; message?: string; source?: string }) {
  const { error } = await supabase.from('pepa_web_leads').insert({
    email: input.email,
    name: input.name || null,
    message: input.message || null,
    source: input.source || 'landing_hero_form',
  })
  if (error) {
    if (error.code === '23505') throw new Error('Ya estabas en la lista con ese email.')
    throw error
  }
}
