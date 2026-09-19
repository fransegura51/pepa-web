import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listPublicVideos } from '@/lib/admin/videos'
import type { PacoVideoRow } from '@/lib/admin/types'

export function PacoLife() {
  const [videos, setVideos] = useState<PacoVideoRow[]>([])

  useEffect(() => {
    listPublicVideos()
      .then(setVideos)
      .catch(() => setVideos([]))
  }, [])

  return (
    <div>
      <div className="section-head">
        <div>
          <p className="eyebrow">"Paco dice que PEPA es una chivata..."</p>
          <h2>La vida con Paco</h2>
          <p>Situaciones reales. Humor real. Una familia real.</p>
        </div>
        {videos.length > 0 && (
          <Link to="/paco" className="btn btn-ghost">
            Ver todos los vídeos →
          </Link>
        )}
      </div>

      {videos.length === 0 ? (
        <div className="empty-state">
          <p style={{ margin: 0, fontWeight: 700, color: 'var(--marino)' }}>Muy pronto, aquí 🎬</p>
          <p style={{ margin: '6px 0 0' }}>Estamos grabando los primeros capítulos de "La vida con Paco".</p>
        </div>
      ) : (
        <div className="paco-grid">
          {videos.slice(0, 4).map((v) => (
            <a key={v.id} className="paco-card" href={v.videoUrl} target="_blank" rel="noreferrer">
              {v.thumbnailUrl && <img src={v.thumbnailUrl} alt={v.title} loading="lazy" />}
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
