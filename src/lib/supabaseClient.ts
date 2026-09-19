import { createClient } from '@supabase/supabase-js'

// Mismo proyecto Supabase que family-app (misma URL/anon key pública)
// — así no hace falta un segundo proyecto. Esta web solo toca sus
// propias tablas aisladas (pepa_web_leads, pepa_web_poll_votes /
// pepa_web_poll_results): ninguna tiene relación con las tablas de
// familias/gastos/etc., y su RLS lo garantiza en el servidor, no aquí.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, anonKey)
