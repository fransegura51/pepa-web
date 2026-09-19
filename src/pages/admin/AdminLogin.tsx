import { useState, type FormEvent } from 'react'
import { requestPasswordReset, signIn } from '@/lib/admin/auth'
import { authErrorMessage } from '@/lib/errorMessage'

export function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<'signin' | 'reset'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    try {
      if (mode === 'reset') {
        await requestPasswordReset(email.trim())
        // Nunca se confirma si ese email tiene cuenta o no (evita que
        // alguien use este formulario para comprobar qué emails están
        // registrados) — el mensaje es el mismo se encuentre o no.
        setInfo('Si ese email tiene una cuenta, te hemos mandado un enlace para elegir una contraseña nueva.')
      } else {
        await signIn(email.trim(), password)
        onSignedIn()
      }
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-card">
      <p className="eyebrow">PEPA · Admin</p>
      <h1 style={{ fontSize: '1.4rem' }}>{mode === 'signin' ? 'Entrar' : 'Recuperar contraseña'}</h1>
      <form className="admin-form" onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode === 'signin' && (
          <label>
            Contraseña
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        )}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Procesando…' : mode === 'signin' ? 'Entrar' : 'Mandar enlace'}
        </button>
        {error && <p className="form-message form-message--error">{error}</p>}
        {info && <p className="form-message form-message--ok">{info}</p>}
      </form>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ marginTop: 8 }}
        onClick={() => {
          setMode(mode === 'signin' ? 'reset' : 'signin')
          setError('')
          setInfo('')
        }}
      >
        {mode === 'signin' ? '¿Olvidaste tu contraseña?' : '← Volver a entrar'}
      </button>
    </div>
  )
}
