import { useState } from 'react'
import { useModuleImages } from '@/context/ImagesContext'

const TAB_ORDER = ['calendario', 'compras', 'economia', 'cocina', 'eventos', 'documentos']
const TAB_LABELS: Record<string, string> = {
  calendario: 'Calendario',
  compras: 'Compras',
  economia: 'Economía',
  cocina: 'Cocina',
  eventos: 'Eventos',
  documentos: 'Documentos',
}

export function AppDemo() {
  const images = useModuleImages()
  const tabs = TAB_ORDER.map((key) => images.find((img) => img.key === key)).filter((img): img is NonNullable<typeof img> => !!img)
  const [active, setActive] = useState(TAB_ORDER[0])
  const current = tabs.find((t) => t.key === active) ?? tabs[0]

  return (
    <div>
      <div className="demo-tabs" role="tablist" aria-label="Módulos de PEPA">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={tab.key === active}
            className="demo-tab"
            onClick={() => setActive(tab.key)}
          >
            {TAB_LABELS[tab.key]}
          </button>
        ))}
      </div>
      {current && (
        <div className="demo-frame">
          <img src={current.src} alt={`Vista de ejemplo del módulo ${TAB_LABELS[current.key]} de PEPA`} loading="lazy" />
        </div>
      )}
    </div>
  )
}
