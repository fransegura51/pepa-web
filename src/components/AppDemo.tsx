import { useState } from 'react'
import { asset } from '@/lib/assetUrl'

// TODO: sustituir por capturas reales de la app cuando haya una cuenta
// de demostración con datos de ejemplo — no se usan capturas de familias
// reales en una web pública. Por ahora, ilustraciones placeholder
// (public/screenshots/*.svg) con el color/icono real de cada módulo.
const DEMO_TABS = [
  { key: 'calendario', label: 'Calendario', image: asset('screenshots/calendario.svg') },
  { key: 'compras', label: 'Compras', image: asset('screenshots/compras.svg') },
  { key: 'economia', label: 'Economía', image: asset('screenshots/economia.svg') },
  { key: 'cocina', label: 'Cocina', image: asset('screenshots/cocina.svg') },
  { key: 'eventos', label: 'Eventos', image: asset('screenshots/eventos.svg') },
  { key: 'documentos', label: 'Documentos', image: asset('screenshots/documentos.svg') },
]

export function AppDemo() {
  const [active, setActive] = useState(DEMO_TABS[0].key)
  const current = DEMO_TABS.find((t) => t.key === active) ?? DEMO_TABS[0]

  return (
    <div>
      <div className="demo-tabs" role="tablist" aria-label="Módulos de PEPA">
        {DEMO_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={tab.key === active}
            className="demo-tab"
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="demo-frame">
        <img src={current.image} alt={`Vista de ejemplo del módulo ${current.label} de PEPA`} loading="lazy" />
      </div>
    </div>
  )
}
