import { useEffect, useState } from 'react'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { listPublicNews } from '@/lib/admin/news'
import type { NewsRow } from '@/lib/admin/types'

export function Novedades() {
  useDocumentMeta('Novedades — PEPA Family App', 'Últimas funciones y noticias de PEPA.')
  const [items, setItems] = useState<NewsRow[]>([])

  useEffect(() => {
    listPublicNews()
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  return (
    <div className="simple-page">
      <div className="container">
        <h1>Novedades</h1>
        {items.length === 0 ? (
          <div className="empty-state">
            <p style={{ margin: 0 }}>Todavía no hay novedades publicadas.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {items.map((n) => (
              <div key={n.id} className="news-card">
                {n.imageUrl && <img src={n.imageUrl} alt="" style={{ borderRadius: 12, marginBottom: 12 }} />}
                {n.publishedAt && <p style={{ fontSize: 13, color: 'var(--texto-suave)', margin: '0 0 4px' }}>{n.publishedAt}</p>}
                <h2 style={{ fontSize: '1.15rem', marginBottom: 6 }}>{n.title}</h2>
                <p style={{ margin: 0 }}>{n.description}</p>
                {n.linkUrl && (
                  <a href={n.linkUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, fontWeight: 700 }}>
                    Saber más →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
