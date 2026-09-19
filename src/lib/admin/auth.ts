import { supabase } from '@/lib/supabaseClient'

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

// Petición real: "se me ha borrado la cuenta de administrador no
// tengo la contraseña para entrar" — la cuenta seguía existiendo, lo
// que faltaba era una forma de recuperar la contraseña sin tener que
// pedirlo a mano. redirectTo apunta a la raíz del sitio (un archivo
// real, sin el truco de 404.html de GitHub Pages de por medio — un
// enlace de email es justo el caso más frágil para ese doble salto);
// AdminResetPassword reconoce el enlace de recuperación por su propio
// hash (#type=recovery) antes de nada.
export async function requestPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/',
  })
  if (error) throw error
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
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
