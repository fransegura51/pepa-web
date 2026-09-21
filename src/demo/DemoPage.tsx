import { useEffect, useReducer, useRef, useState } from 'react'
import { parseDemoEntry } from '@/demo/entry'
import { SITE_HOME, buildSignupUrl } from '@/demo/links'
import { DEMO_MODULES, DEMO_SCREENS, demoReducer, globalIndex, initialState, moduleOf } from '@/demo/state'
import '@/demo/demo.css'

export function DemoPage() {
  // Entrada desde una guía (?zona=…&desde=…): ver src/demo/entry.ts.
  const [entry] = useState(() => parseDemoEntry(typeof window === 'undefined' ? '' : window.location.search))
  const [state, dispatch] = useReducer(demoReducer, entry.tab, initialState)
  const signupUrl = buildSignupUrl(entry.guide)
  const module = moduleOf(state.tab)
  const screen = module.screens[state.screen]
  const position = globalIndex(state)
  const isLast = position === DEMO_SCREENS.length - 1
  const navRef = useRef<HTMLElement>(null)

  // En móvil las secciones son una tira horizontal: la activa siempre a la vista.
  useEffect(() => {
    navRef.current?.querySelector('.is-active')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [state.tab])

  return (
    <div className="dm-root">
      <header className="dm-banner">
        <p className="dm-banner-text" role="note">
          <strong>Estás viendo una demostración con datos ficticios.</strong> Son capturas reales de PEPA con una familia de ejemplo.
        </p>
        <div className="dm-banner-actions">
          <a className="btn btn-primary dm-cta" href={signupUrl} rel="noopener">
            Crear mi familia
          </a>
          <a className="btn btn-ghost" href={SITE_HOME}>
            Salir de la demo
          </a>
        </div>
      </header>

      <div className="dm-layout">
        <nav className="dm-modules" aria-label="Secciones de PEPA" ref={navRef}>
          {DEMO_MODULES.map((m) => (
            <button
              key={m.tab}
              type="button"
              className={`dm-module-btn${state.tab === m.tab ? ' is-active' : ''}`}
              aria-current={state.tab === m.tab ? 'page' : undefined}
              onClick={() => dispatch({ type: 'goTab', tab: m.tab })}
            >
              <span aria-hidden="true">{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </nav>

        <main className="dm-main" id="dm-main">
          <div className="dm-stage">
            <p className="dm-step-count" aria-live="polite">
              {`Pantalla ${position + 1} de ${DEMO_SCREENS.length}`}
            </p>
            <figure className="dm-phone">
              <img key={screen.image} src={screen.image} alt={screen.alt} width={750} height={1624} decoding="async" />
            </figure>
          </div>

          <section className="dm-caption" aria-label="Explicación de Pepa">
            <h1 className="dm-module-title">
              <span aria-hidden="true">{module.emoji}</span> {module.label}
            </h1>

            {module.screens.length > 1 && (
              <div className="dm-screens" role="group" aria-label={`Pantallas de ${module.label}`}>
                {module.screens.map((s, i) => (
                  <button
                    key={s.image}
                    type="button"
                    className={`dm-screen-btn${i === state.screen ? ' is-active' : ''}`}
                    aria-current={i === state.screen ? 'true' : undefined}
                    onClick={() => dispatch({ type: 'goScreen', screen: i })}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <p className="dm-pepa-line">
              <span aria-hidden="true">🐣</span> <strong>{screen.title}.</strong> {screen.text}
            </p>

            <div className="dm-row">
              {position > 0 && (
                <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'prev' })}>
                  ← Anterior
                </button>
              )}
              {!isLast ? (
                <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'next' })}>
                  Siguiente →
                </button>
              ) : (
                <a className="btn btn-primary" href={signupUrl} rel="noopener">
                  Crear mi familia
                </a>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
