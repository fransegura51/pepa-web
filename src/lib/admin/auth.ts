import { supabase } from '@/lib/supabaseClient'

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getSessionEmail(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user.email ?? null
}

// Solo para decidir qué pinta la interfaz — la seguridad real la dan
// las políticas RLS de cada tabla (todas con el mismo predicado
// is_app_owner). Ver 0122_pepa_web_admin_access.sql.
export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_pepa_web_admin')
  if (error) return false
  return data === true
}
