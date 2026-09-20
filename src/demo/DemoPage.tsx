import { useReducer, useState } from 'react'
import { parseDemoEntry } from '@/demo/entry'
import { SITE_HOME, buildSignupUrl } from '@/demo/links'
import { DEMO_STEPS, DEMO_TABS, demoReducer, initialState, stepIndex } from '@/demo/state'
import '@/demo/demo.css'

export function DemoPage() {
  // Entrada desde una guía (?zona=…&desde=…): ver src/demo/entry.ts.
  const [entry] = useState(() => parseDemoEntry(typeof window === 'undefined' ? '' : window.location.search))
  const [state, dispatch] = useReducer(demoReducer, entry.tab, initialState)
  const signupUrl = buildSignupUrl(entry.guide)
  const index = stepIndex(state.tab)
  const step = DEMO_STEPS[index]
  const isLast = index === DEMO_STEPS.length - 1

  return (
    <div className="dm-root">
      <div className="dm-shell">
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

        <main className="dm-main" id="dm-main">
          <p className="dm-step-count" aria-live="polite">
            {`Pantalla ${index + 1} de ${DEMO_STEPS.length}`}
          </p>

          <figure className="dm-phone">
            <img key={step.tab} src={step.image} alt={step.alt} width={750} height={1624} decoding="async" />
          </figure>

          <section className="dm-caption" aria-label="Explicación de Pepa">
            <p className="dm-pepa-line">
              <span aria-hidden="true">🐣</span> <strong>{step.title}.</strong> {step.text}
            </p>
            <div className="dm-row">
              {index > 0 && (
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

        <nav className="dm-nav" aria-label="Pantallas de la demo">
          {DEMO_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`dm-nav-btn${state.tab === t.id ? ' is-active' : ''}`}
              aria-current={state.tab === t.id ? 'page' : undefined}
              onClick={() => dispatch({ type: 'goTab', tab: t.id })}
            >
              <span aria-hidden="true">{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
