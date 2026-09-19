import { Link } from 'react-router-dom'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function NotFound() {
  useDocumentMeta('Página no encontrada — PEPA Family App', 'Esta página no existe.')

  return (
    <div className="simple-page" style={{ textAlign: 'center' }}>
      <div className="container">
        <span className="sticky-note">Ni PEPA la encuentra…</span>
        <h1 style={{ marginTop: 20 }}>404 — Esta página no existe</h1>
        <p style={{ color: 'var(--texto-suave)' }}>Puede que el enlace esté mal o que la página se haya movido.</p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
