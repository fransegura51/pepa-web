import { useState, type FormEvent } from 'react'
import { signIn } from '@/lib/admin/auth'
import { authErrorMessage } from '@/lib/errorMessage'

export function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(email.trim(), password)
      onSignedIn()
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-card">
      <p className="eyebrow">PEPA · Admin</p>
      <h1 style={{ fontSize: '1.4rem' }}>Entrar</h1>
      <form className="admin-form" onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        {error && <p className="form-message form-message--error">{error}</p>}
      </form>
    </div>
  )
}
