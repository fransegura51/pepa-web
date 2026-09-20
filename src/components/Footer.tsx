import { Link } from 'react-router-dom'
import { SHOW_GUIDES_LINK, SOCIAL_LINKS } from '@/config/site'
import pepaLogoMaster from '@/assets/brand/pepa-family-app-logo-master.png'

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
            <Link to="/" className="footer-brand" style={{ marginBottom: 10 }}>
              <img src={pepaLogoMaster} alt="PEPA Family App" className="footer-logo" width={1881} height={836} />
            </Link>
            <p style={{ color: '#c7d0e3', maxWidth: '32ch' }}>Tu familia. Tu tiempo. Tu PEPA. 💚</p>
            <div className="footer-social">
              {/* Solo redes con perfil configurado: sin URL, no se muestra. */}
              {SOCIAL_LINKS.filter((link) => link.href).map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (se abre en otra pestaña)`}>
                  {SOCIAL_ICON[link.label] ?? link.label[0]}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>PEPA</h4>
            <Link to="/funciones">Funciones</Link>
            <Link to="/paco">La vida con Paco</Link>
            {SHOW_GUIDES_LINK && <a href="/guias/">Guías</a>}
            <Link to="/preguntas">Preguntas</Link>
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
