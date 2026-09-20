import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEMO_URL, SHOW_GUIDES_LINK } from '@/config/site'
import pepaLogoMaster from '@/assets/brand/pepa-family-app-logo-master.png'

// Cada entrada lleva a una página que existe. "route" = pantalla de la web
// (navegación sin recargar); "page" = página propia (demo, guías): enlace normal.
const NAV_LINKS: ({ kind: 'route'; to: string; label: string } | { kind: 'page'; href: string; label: string })[] = [
  { kind: 'route', to: '/funciones', label: 'Funciones' },
  { kind: 'page', href: DEMO_URL, label: 'Demo' },
  { kind: 'route', to: '/paco', label: 'La vida con Paco' },
  ...(SHOW_GUIDES_LINK ? [{ kind: 'page' as const, href: '/guias/', label: 'Guías' }] : []),
  { kind: 'route', to: '/preguntas', label: 'Preguntas' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  const renderLink = (link: (typeof NAV_LINKS)[number], onNavigate?: () => void) =>
    link.kind === 'route' ? (
      <Link key={link.to} to={link.to} onClick={onNavigate}>
        {link.label}
      </Link>
    ) : (
      <a key={link.href} href={link.href}>
        {link.label}
      </a>
    )

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="PEPA Family App — ir al inicio">
          <img className="brand-logo" src={pepaLogoMaster} alt="" width={1881} height={836} />
        </Link>

        <nav className="main-nav" aria-label="Principal">
          {NAV_LINKS.map((link) => renderLink(link))}
        </nav>

        <div className="header-actions">
          <a href={DEMO_URL} className="btn btn-primary">
            Probar PEPA
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-movil" className="mobile-nav" aria-label="Menú móvil">
          {NAV_LINKS.map((link) => renderLink(link, () => setOpen(false)))}
        </nav>
      )}
    </header>
  )
}
