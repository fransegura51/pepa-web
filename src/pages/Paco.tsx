import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { PACO_VIDEOS } from '@/config/content'

export function Paco() {
  useDocumentMeta(
    'La vida con Paco — PEPA Family App',
    'Situaciones reales, humor real: el catálogo de "La vida con Paco", el universo PEPA.',
  )

  return (
    <div className="simple-page">
      <div className="container">
        <p className="eyebrow">Situaciones reales. Humor real. Una familia real.</p>
        <h1>La vida con Paco</h1>

        {PACO_VIDEOS.length === 0 ? (
          <div className="empty-state">
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--marino)' }}>Muy pronto, aquí 🎬</p>
            <p style={{ margin: '6px 0 0' }}>Estamos grabando los primeros capítulos. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="paco-grid" style={{ marginTop: 32 }}>
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
    </div>
  )
}
