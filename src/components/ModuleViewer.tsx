import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { SHOWCASE, SHOWCASE_EVENT, type ShowcaseKey } from '@/config/home'
import { useModuleImages } from '@/context/ImagesContext'
import { ScreenshotDialog } from '@/components/ScreenshotDialog'

// "Mira PEPA por dentro": ÚNICA galería de capturas de la HOME. Un selector
// de módulos, una captura real grande y una descripción corta. Pulsar la
// captura la abre a tamaño completo. Solo aparecen módulos con captura REAL
// (nunca una ilustración inventada): al subir una foto desde /admin →
// Imágenes, el módulo se muestra solo.
export function ModuleViewer() {
  const images = useModuleImages()
  const modules = useMemo(
    () =>
      SHOWCASE.map((m) => ({ ...m, src: images.find((i) => i.key === m.key)?.src ?? '' })).filter((m) => m.src !== '' && !m.src.endsWith('.svg')),
    [images],
  )
  const [active, setActive] = useState<ShowcaseKey>('calendario')
  const [zoom, setZoom] = useState(false)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // El test de caos puede pedir que se abra un módulo concreto.
  useEffect(() => {
    function onPick(e: Event) {
      const key = (e as CustomEvent<ShowcaseKey>).detail
      if (SHOWCASE.some((m) => m.key === key)) setActive(key)
    }
    window.addEventListener(SHOWCASE_EVENT, onPick)
    return () => window.removeEventListener(SHOWCASE_EVENT, onPick)
  }, [])

  if (modules.length === 0) return null
  const current = modules.find((m) => m.key === active) ?? modules[0]

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = modules.length - 1
    let next = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    else return
    e.preventDefault()
    setActive(modules[next].key)
    tabRefs.current[modules[next].key]?.focus()
  }

  return (
    <section id="por-dentro" className="hm-section hm-viewer" aria-labelledby="hm-viewer-title">
      <div className="container">
        <header className="hm-section-head hm-center">
          <h2 id="hm-viewer-title" className="hm-h2">
            Mira PEPA por dentro
          </h2>
          <p className="hm-sub">Menos promesas. Así funciona de verdad.</p>
        </header>

        <div className="hm-viewer-grid">
          <div className="hm-tabs" role="tablist" aria-label="Módulos de PEPA">
            {modules.map((m, i) => (
              <button
                key={m.key}
                ref={(el) => {
                  tabRefs.current[m.key] = el
                }}
                type="button"
                role="tab"
                id={`hm-tab-${m.key}`}
                aria-selected={m.key === current.key}
                aria-controls="hm-viewer-panel"
                tabIndex={m.key === current.key ? 0 : -1}
                className="hm-tab"
                onClick={() => setActive(m.key)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span className="hm-tab-icon" aria-hidden="true">
                  {m.icon}
                </span>
                {m.name}
              </button>
            ))}
          </div>

          <div id="hm-viewer-panel" className="hm-panel" role="tabpanel" aria-labelledby={`hm-tab-${current.key}`}>
            <div className="hm-panel-copy">
              <h3 className="hm-h3">{current.title}</h3>
              <p>{current.text}</p>
              <p className="hm-hint">Pulsa la captura para verla completa.</p>
            </div>
            <button type="button" className="hm-shot" onClick={() => setZoom(true)} aria-label={`Ampliar la captura de ${current.name}`}>
              <img key={current.key} src={current.src} alt={current.alt} width={750} height={1624} loading="lazy" decoding="async" />
            </button>
          </div>
        </div>
      </div>

      <ScreenshotDialog open={zoom} src={current.src} alt={current.alt} title={current.name} onClose={() => setZoom(false)} />
    </section>
  )
}
