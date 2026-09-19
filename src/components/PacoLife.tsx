import { Link } from 'react-router-dom'
import { PACO_VIDEOS } from '@/config/content'

export function PacoLife() {
  return (
    <div>
      <div className="section-head">
        <div>
          <p className="eyebrow">"Paco dice que PEPA es una chivata..."</p>
          <h2>La vida con Paco</h2>
          <p>Situaciones reales. Humor real. Una familia real.</p>
        </div>
        {PACO_VIDEOS.length > 0 && (
          <Link to="/paco" className="btn btn-ghost">
            Ver todos los vídeos →
          </Link>
        )}
      </div>

      {PACO_VIDEOS.length === 0 ? (
        <div className="empty-state">
          <p style={{ margin: 0, fontWeight: 700, color: 'var(--marino)' }}>Muy pronto, aquí 🎬</p>
          <p style={{ margin: '6px 0 0' }}>Estamos grabando los primeros capítulos de "La vida con Paco".</p>
        </div>
      ) : (
        <div className="paco-grid">
          {PACO_VIDEOS.map((v) => (
            <a key={v.title} className="paco-card" href={v.url} target="_blank" rel="noreferrer">
              <img src={v.thumbnail} alt={v.title} loading="lazy" />
              <span className="paco-card-play" aria-hidden="true">
                ▶
              </span>
              <span className="paco-card-caption">{v.title}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
