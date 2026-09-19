import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEMO_URL } from '@/config/site'

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/funciones', label: 'Funciones' },
  { to: '/paco', label: 'La vida con Paco' },
  { to: '/precios', label: 'Precios' },
  { to: '/preguntas', label: 'Preguntas' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            🏠
          </span>
          PEPA <span style={{ fontWeight: 500, fontSize: '0.7em', color: 'var(--texto-suave)' }}>Family App</span>
        </Link>

        <nav className="main-nav" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a href={DEMO_URL} className="btn btn-primary">
            Probar PEPA ahora
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Menú móvil">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
