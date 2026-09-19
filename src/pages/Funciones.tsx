import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { MODULES } from '@/config/content'
import { WaitlistForm } from '@/components/WaitlistForm'

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
