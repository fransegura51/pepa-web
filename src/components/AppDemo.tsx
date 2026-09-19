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

// Explicación breve por módulo, la misma real que ya usa la app — se
// enseña solo debajo de la captura de la pestaña que se toque.
const TAB_DESCRIPTIONS: Record<string, string> = {
  calendario: 'Todos los eventos de la familia en un mismo calendario. Dile a Pepa que apunte una cita y lo hace por ti, por voz o texto.',
  compras: 'Lista de la compra compartida en tiempo real. Pepa entiende tus tiendas al dictar — di "Mercadona, patatas" y lo añade bien clasificado.',
  economia: 'Apunta gastos a mano o haz una foto al ticket: Pepa lee los productos y los categoriza sola, y avisa si algo se sale del presupuesto.',
  cocina: 'Planifica el menú semanal y Pepa genera la lista de la compra que falta, sin tener que apuntar nada dos veces.',
  eventos: 'Cumpleaños, comuniones o cualquier celebración: cuenta atrás, invitados, presupuesto y menú, organizado en un solo sitio.',
  documentos: 'Guarda DNI, seguros o carnets con foto. Pepa detecta la fecha de caducidad y avisa antes de que venza.',
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
          <p className="demo-frame-caption">{TAB_DESCRIPTIONS[current.key]}</p>
        </div>
      )}
    </div>
  )
}
