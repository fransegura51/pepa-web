import { useState, type FormEvent } from 'react'
import { updatePassword } from '@/lib/admin/auth'
import { authErrorMessage } from '@/lib/errorMessage'

// Se llega aquí desde el enlace del email de "¿Olvidaste tu
// contraseña?" (AdminLogin) — Supabase ya ha creado una sesión de
// recuperación válida a partir del token del propio enlace (leído del
// hash de la URL, #access_token=...&type=recovery) antes de que este
// componente se monte, así que solo hace falta pedir la contraseña
// nueva y guardarla.
export function AdminResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Las dos contraseñas no coinciden.')
      return
    }
    setLoading(true)
    try {
      await updatePassword(password)
      setDone(true)
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="admin-login-card">
        <p className="eyebrow">PEPA · Admin</p>
        <h1 style={{ fontSize: '1.4rem' }}>Contraseña actualizada</h1>
        <p>Ya puedes entrar con ella.</p>
        <a className="btn btn-primary btn-block" href="/admin">
          Ir a Admin
        </a>
      </div>
    )
  }

  return (
    <div className="admin-login-card">
      <p className="eyebrow">PEPA · Admin</p>
      <h1 style={{ fontSize: '1.4rem' }}>Elige tu nueva contraseña</h1>
      <form className="admin-form" onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <label>
          Contraseña nueva
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Repítela
          <input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar contraseña'}
        </button>
        {error && <p className="form-message form-message--error">{error}</p>}
      </form>
    </div>
  )
}
