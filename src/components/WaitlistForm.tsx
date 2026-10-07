import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { addLead } from '@/lib/leads'

export function WaitlistForm({ source, showMessage = false }: { source: string; showMessage?: boolean }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!consent) return
    setStatus('sending')
    try {
      await addLead({ email, name, message, source })
      setStatus('ok')
      setEmail('')
      setName('')
      setMessage('')
      setConsent(false)
    } catch (err) {
      setStatus('error')
      setErrorText(err instanceof Error ? err.message : 'No se ha podido enviar. Inténtalo de nuevo.')
    }
  }

  if (status === 'ok') {
    return <p className="form-message form-message--ok">¡Ya estás en la lista! Te avisamos en cuanto puedas entrar. 💚</p>
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} id="lista-de-espera">
      <input
        type="email"
        name="email"
        required
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email"
      />
      {showMessage && (
        <>
          <input type="text" name="name" placeholder="Tu nombre (opcional)" value={name} onChange={(e) => setName(e.target.value)} aria-label="Nombre" />
          <textarea
            name="message"
            placeholder="¿Algo que quieras contarnos? (opcional)"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Mensaje"
          />
        </>
      )}
      <label className="waitlist-consent">
        <input type="checkbox" name="consent" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          Quiero apuntarme a la lista de espera y recibir novedades de PEPA por correo (aproximadamente una cada 30 días).
          Puedo darme de baja cuando quiera.
        </span>
      </label>
      <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending' || !consent}>
        {status === 'sending' ? 'Enviando…' : 'Apuntarme →'}
      </button>
      <p className="waitlist-legal">
        Responsable: PEPA Family App · info@pepafamilyapp.es. Usaremos tu correo solo para gestionar la lista de espera y
        enviarte novedades de PEPA. Base legal: tu consentimiento, que puedes retirar en cualquier momento escribiendo a
        info@pepafamilyapp.es. Más información en la <Link to="/privacidad">política de privacidad</Link>.
      </p>
      {status === 'error' && <p className="form-message form-message--error">{errorText}</p>}
    </form>
  )
}
