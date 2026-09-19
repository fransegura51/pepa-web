import { Link } from 'react-router-dom'
import { SOCIAL_LINKS } from '@/config/site'

const SOCIAL_ICON: Record<string, string> = {
  TikTok: '🎵',
  Facebook: 'f',
  Instagram: '📷',
  YouTube: '▶',
}

export function Footer() {
  return (
    <footer className="site-footer section--marino">
      <div className="container">
        <div className="footer-top">
          <div className="footer-col">
            <Link to="/" className="brand" style={{ color: '#fff', marginBottom: 10 }}>
              <span className="brand-mark" aria-hidden="true">
                🏠
              </span>
              PEPA Family App
            </Link>
            <p style={{ color: '#c7d0e3', maxWidth: '32ch' }}>Tu familia. Tu tiempo. Tu PEPA. 💚</p>
            <div className="footer-social">
              {SOCIAL_LINKS.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                  {SOCIAL_ICON[link.label] ?? link.label[0]}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>PEPA</h4>
            <Link to="/funciones">Funciones</Link>
            <Link to="/paco">La vida con Paco</Link>
            <Link to="/precios">Precios</Link>
            <Link to="/preguntas">Preguntas</Link>
            <Link to="/novedades">Novedades</Link>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/condiciones">Condiciones</Link>
          </div>

          <div className="footer-col">
            <h4>Contacto</h4>
            <Link to="/contacto">Escríbenos</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PEPA Family App. Hecha para familias reales.</span>
        </div>
      </div>
    </footer>
  )
}
