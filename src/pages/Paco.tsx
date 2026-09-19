import { useEffect, useState } from 'react'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { listPublicVideos } from '@/lib/admin/videos'
import type { PacoVideoRow } from '@/lib/admin/types'

export function Paco() {
  useDocumentMeta(
    'La vida con Paco — PEPA Family App',
    'Situaciones reales, humor real: el catálogo de "La vida con Paco", el universo PEPA.',
  )

  const [videos, setVideos] = useState<PacoVideoRow[]>([])

  useEffect(() => {
    listPublicVideos()
      .then(setVideos)
      .catch(() => setVideos([]))
  }, [])

  return (
    <div className="simple-page">
      <div className="container">
        <p className="eyebrow">Situaciones reales. Humor real. Una familia real.</p>
        <h1>La vida con Paco</h1>

        {videos.length === 0 ? (
          <div className="empty-state">
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--marino)' }}>Muy pronto, aquí 🎬</p>
            <p style={{ margin: '6px 0 0' }}>Estamos grabando los primeros capítulos. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="paco-grid" style={{ marginTop: 32 }}>
            {videos.map((v) => (
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
    </div>
  )
}
