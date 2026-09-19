import { Link } from 'react-router-dom'
import { MODULES } from '@/config/content'
import { EDITABLE_TEXTS } from '@/lib/admin/texts'
import { useText } from '@/context/EditableTextsContext'

const HERO_TITLE_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'hero_title')!.fallback
const HERO_SUBTITLE_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'hero_subtitle')!.fallback
const HERO_CTA_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'hero_cta')!.fallback

export function Hero() {
  const title = useText('hero_title', HERO_TITLE_DEFAULT)
  const subtitle = useText('hero_subtitle', HERO_SUBTITLE_DEFAULT)
  const cta = useText('hero_cta', HERO_CTA_DEFAULT)

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-copy">
          <p className="eyebrow">Una familia real. Una app de verdad.</p>
          <h1>
            {title === HERO_TITLE_DEFAULT ? (
              <>
                Tu familia ya es bastante caos… <span className="accent">PEPA lo organiza.</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p>{subtitle}</p>

          <div className="hero-cta-row">
            <a href="#lista-de-espera" className="btn btn-primary">
              {cta}
            </a>
            <Link to="/funciones" className="btn btn-ghost">
              Ver todas las funciones
            </Link>
          </div>
          <p className="hero-microcopy">Sin complicaciones. Tu familia, más fácil. 💚</p>

          <div className="module-chip-row">
            {MODULES.map((m) => (
              <div key={m.key} className="module-chip">
                <span className="module-chip-icon" style={{ background: m.color }}>
                  {m.icon}
                </span>
                {m.name}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <span className="sticky-note">Menos estrés. Más tiempo juntos.</span>
          <div className="phone-mockup">
            <img src="/screenshots/home.svg" alt="Pantalla de inicio de PEPA con el resumen del día de la familia" loading="eager" />
          </div>
          <span className="sticky-note sticky-note--corner sticky-note--alt">Tu familia. Tu tiempo. Tu PEPA.</span>
        </div>
      </div>
    </section>
  )
}
