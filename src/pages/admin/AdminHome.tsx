import { Link } from 'react-router-dom'

const ACTIONS = [
  { to: '/admin/videos?nuevo=1', label: '+ Añadir vídeo' },
  { to: '/admin/promociones?nuevo=1', label: '+ Nueva promoción' },
  { to: '/admin/novedades?nuevo=1', label: '+ Nueva novedad' },
  { to: '/admin/pregunta?nuevo=1', label: '+ Nueva pregunta' },
]

export function AdminHome() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem' }}>Panel de PEPA</h1>
      <p style={{ color: 'var(--texto-suave)' }}>Gestiona el contenido de la web pública sin tocar código.</p>
      <div className="admin-quick-actions">
        {ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} className="btn btn-primary" style={{ justifyContent: 'center' }}>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
