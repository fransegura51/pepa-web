import { useState, type FormEvent } from 'react'
import { addLead } from '@/lib/leads'

export function WaitlistForm({ source, showMessage = false }: { source: string; showMessage?: boolean }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      await addLead({ email, name, message, source })
      setStatus('ok')
      setEmail('')
      setName('')
      setMessage('')
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
      <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Apuntarme →'}
      </button>
      {status === 'error' && <p className="form-message form-message--error">{errorText}</p>}
    </form>
  )
}
