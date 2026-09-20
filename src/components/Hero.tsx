import { HERO_NOTES } from '@/config/home'
import { DEMO_URL } from '@/config/site'
import { useText } from '@/context/EditableTextsContext'
import { useModuleImage } from '@/context/ImagesContext'
import { EDITABLE_TEXTS } from '@/lib/admin/texts'

const HERO_TITLE_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'hero_title')!.fallback
const HERO_SUBTITLE_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'hero_subtitle')!.fallback
const HERO_CTA_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'hero_cta')!.fallback

// Hero: el mensaje manda, y el producto real (una captura de la app, grande)
// lo acompaña. Solo dos acciones y con destinos distintos: probar (demo) y
// bajar a ver la app por dentro. Las notas alrededor del móvil son
// decoración (situaciones reales de PEPA): no son botones.
export function Hero() {
  const title = useText('hero_title', HERO_TITLE_DEFAULT)
  const subtitle = useText('hero_subtitle', HERO_SUBTITLE_DEFAULT)
  const cta = useText('hero_cta', HERO_CTA_DEFAULT)
  const homeShot = useModuleImage('home')

  return (
    <section className="hm-hero" aria-labelledby="hm-hero-title">
      <div className="container hm-hero-grid">
        <div className="hm-hero-copy">
          <p className="hm-eyebrow">Una familia real. Una app de verdad.</p>
          <h1 id="hm-hero-title" className="hm-h1">
            {title === HERO_TITLE_DEFAULT ? (
              <>
                Tu familia ya es bastante caos… <span className="hm-accent">PEPA lo organiza.</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p className="hm-lead">{subtitle}</p>
          <div className="hm-cta-row">
            <a href={DEMO_URL} className="btn btn-primary btn-lg">
              {cta}
            </a>
            <a href="#por-dentro" className="btn btn-ghost btn-lg">
              Ver PEPA por dentro
            </a>
          </div>
        </div>

        <div className="hm-hero-visual">
          <div className="hm-phone hm-phone--hero">
            <img src={homeShot} alt="Pantalla de inicio de PEPA con la lista de la compra y los accesos a cada sección" width={750} height={1624} fetchPriority="high" decoding="async" />
          </div>
          {HERO_NOTES.map((note, i) => (
            <span key={note} className={`hm-note hm-note--${i + 1}`} aria-hidden="true">
              {note}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
