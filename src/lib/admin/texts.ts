import { supabase } from '@/lib/supabaseClient'

// Lista blanca de textos editables desde /admin — el panel solo deja
// tocar estas claves, nunca texto libre (Skill: "no convertir toda la
// web en un CMS complejo").
export interface EditableTextDef {
  key: string
  label: string
  fallback: string
}

export const EDITABLE_TEXTS: EditableTextDef[] = [
  { key: 'hero_title', label: 'Titular del hero', fallback: 'Tu familia ya es bastante caos… PEPA lo organiza.' },
  {
    key: 'hero_subtitle',
    label: 'Subtítulo del hero',
    fallback: 'Calendario, compras, economía, cocina, eventos y mucho más. Todo en una sola app.',
  },
  { key: 'hero_cta', label: 'Botón principal del hero', fallback: 'Probar PEPA gratis' },
  {
    key: 'final_cta_title',
    label: 'Título de la llamada final (una línea por frase)',
    fallback: 'Tu familia seguirá siendo un caos.\nPero puede ser un caos organizado. 💚',
  },
]

export async function getAllTexts(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('pepa_web_texts').select('key, value')
  if (error) throw error
  return Object.fromEntries(data.map((r) => [r.key, r.value]))
}

export async function setText(key: string, value: string): Promise<void> {
  const { error } = await supabase.from('pepa_web_texts').upsert({ key, value, updated_at: new Date().toISOString() })
  if (error) throw error
}
