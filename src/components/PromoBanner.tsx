import { useEffect, useState } from 'react'
import { getActivePromotion } from '@/lib/admin/promotions'
import type { PromotionRow } from '@/lib/admin/types'

// Franja fina bajo el header, solo visible si hay una promoción
// publicada y dentro de fecha — no reordena ni toca ninguna de las
// secciones ya aprobadas del diseño.
export function PromoBanner() {
  const [promo, setPromo] = useState<PromotionRow | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    getActivePromotion()
      .then(setPromo)
      .catch(() => setPromo(null))
  }, [])

  if (!promo || dismissed) return null

  return (
    <div style={{ background: 'var(--turquesa)', color: '#fff' }}>
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '10px 20px', flexWrap: 'wrap', textAlign: 'center' }}
      >
        <span>
          <strong>{promo.title}</strong> — {promo.body}
        </span>
        {promo.buttonText && promo.buttonUrl && (
          <a href={promo.buttonUrl} style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline' }}>
            {promo.buttonText}
          </a>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Cerrar aviso"
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem', opacity: 0.8 }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
