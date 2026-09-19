import { useReducer, useState } from 'react'
import { parseDemoEntry } from '@/demo/entry'
import { SITE_HOME, buildSignupUrl } from '@/demo/links'
import { CalendarioScreen, CocinaScreen, ComprasScreen, CumpleanosScreen, EconomiaScreen, InicioScreen, type ScreenProps } from '@/demo/screens'
import { DEMO_TABS, TOUR_STEPS, demoReducer, initialState, weekdayIndex, type DemoTab } from '@/demo/state'
import '@/demo/demo.css'

const SCREENS: Record<DemoTab, (props: ScreenProps) => JSX.Element> = {
  inicio: InicioScreen,
  calendario: CalendarioScreen,
  compras: ComprasScreen,
  economia: EconomiaScreen,
  cocina: CocinaScreen,
  cumpleanos: CumpleanosScreen,
}

export function DemoPage() {
  const [today] = useState(() => new Date())
  // Entrada desde una guía (?zona=…&desde=…): ver src/demo/entry.ts.
  const [entry] = useState(() => parseDemoEntry(typeof window === 'undefined' ? '' : window.location.search))
  const [state, dispatch] = useReducer(demoReducer, entry.tab, (tab) => initialState(today, tab))
  const Screen = SCREENS[state.tab]
  const todayIndex = weekdayIndex(today)
  const signupUrl = buildSignupUrl(entry.guide)
  const step = TOUR_STEPS[state.tourStep]

  return (
    <div className="dm-root">
      <div className="dm-shell">
        <header className="dm-banner">
          <p className="dm-banner-text" role="note">
            <strong>Estás usando una demostración con datos ficticios.</strong> Nada de lo que hagas aquí se guarda.
          </p>
          <div className="dm-banner-actions">
            <a className="btn btn-primary dm-cta" href={signupUrl} rel="noopener">
              Crear mi familia
            </a>
            <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'reset', today: new Date() })}>
              Reiniciar demo
            </button>
            <a className="btn btn-ghost" href={SITE_HOME}>
              Salir de la demo
            </a>
          </div>
        </header>

        {state.tourStatus === 'ask' && (
          <section className="dm-tour" aria-label="Recorrido guiado">
            <p className="dm-pepa-line">
              <span aria-hidden="true">🐣</span> ¡Hola! Soy Pepa. ¿Te enseño PEPA en un minuto?
            </p>
            <div className="dm-row dm-row--buttons">
              <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'tourStart' })}>
                Sí, enséñame
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'tourSkip' })}>
                No, gracias
              </button>
            </div>
          </section>
        )}

        {state.tourStatus === 'running' && (
          <section className="dm-tour" aria-label="Recorrido guiado" aria-live="polite">
            <p className="dm-tour-count">
              Paso {state.tourStep + 1} de {TOUR_STEPS.length}
            </p>
            <p className="dm-pepa-line">
              <span aria-hidden="true">🐣</span> <strong>{step.title}.</strong> {step.text}
            </p>
            <div className="dm-row dm-row--buttons">
              {state.tourStep > 0 && (
                <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'tourPrev' })}>
                  Anterior
                </button>
              )}
              <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'tourNext' })}>
                {state.tourStep === TOUR_STEPS.length - 1 ? 'Terminar' : 'Siguiente'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'tourSkip' })}>
                Saltar
              </button>
            </div>
          </section>
        )}

        {state.notice && (
          <div className="dm-notice" role="status">
            <span>{state.notice}</span>
            <button type="button" className="dm-notice-close" aria-label="Cerrar aviso" onClick={() => dispatch({ type: 'dismissNotice' })}>
              ✕
            </button>
          </div>
        )}

        <main className="dm-main" id="dm-main">
          <Screen state={state} dispatch={dispatch} today={today} todayIndex={todayIndex} />

          {state.tourStatus === 'done' && (
            <section className="dm-card dm-card--cta">
              <h2 className="dm-h2">¿Te está gustando?</h2>
              <p>Esto es solo una muestra. Crea tu familia y organiza vuestro día a día de verdad.</p>
              <div className="dm-row dm-row--buttons">
                <a className="btn btn-primary" href={signupUrl} rel="noopener">
                  Crear mi familia
                </a>
                <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'tourStart' })}>
                  Repetir el recorrido
                </button>
              </div>
            </section>
          )}
        </main>

        <nav className="dm-nav" aria-label="Secciones de la demo">
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
