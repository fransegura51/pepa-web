import { useState } from 'react'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { MODULES } from '@/config/content'
import { WaitlistForm } from '@/components/WaitlistForm'

// Vídeos explicativos (public/ayuda/<clave>.mp4 + .jpg). El <video> no se crea hasta que se pulsa «Ver vídeo»: no se descarga nada antes.
const MODULE_VIDEOS: Record<string, string> = { calendario: 'calendario' }

function ModuleVideo({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  if (!open) {
    return (
      <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setOpen(true)}>
        ▶ Ver cómo funciona (vídeo, 1 min 27 s)
      </button>
    )
  }
  return (
    <video
      controls
      autoPlay
      playsInline
      preload="metadata"
      poster={`/ayuda/${name}.jpg`}
      src={`/ayuda/${name}.mp4`}
      style={{ display: 'block', width: '100%', maxWidth: 320, marginTop: 12, borderRadius: 14, background: '#000' }}
    >
      Tu navegador no puede reproducir este vídeo.
    </video>
  )
}

export function Funciones() {
  useDocumentMeta(
    'Funciones de PEPA — todo lo que organiza tu familia',
    'Calendario, compras, economía, cocina, eventos y documentos: repasa todo lo que PEPA hace por tu familia.',
  )

  return (
    <div className="simple-page">
      <div className="container">
        <p className="eyebrow">Una PEPA para cada momento</p>
        <h1>Todas las herramientas que tu familia necesita, en un solo lugar</h1>

        <div style={{ display: 'grid', gap: 24, marginTop: 40 }}>
          {MODULES.map((m) => (
            <div key={m.key} className="module-card" style={{ background: m.color, textAlign: 'left', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div className="module-card-icon" style={{ margin: 0, flexShrink: 0 }}>
                {m.icon}
              </div>
              <div>
                <h3 style={{ marginBottom: 6 }}>{m.name}</h3>
                <p style={{ margin: 0 }}>{m.tagline}</p>
                {MODULE_VIDEOS[m.key] && <ModuleVideo name={MODULE_VIDEOS[m.key]} />}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <h2>¿Lista para probarlo?</h2>
          <WaitlistForm source="funciones_page" />
        </div>
      </div>
    </div>
  )
}
