import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WaitlistForm } from '@/components/WaitlistForm'
import { SurvivalQuiz } from '@/components/SurvivalQuiz'
import { Faq } from '@/components/Faq'
import { DAY_WITH_PEPA, type GuideSummary } from '@/config/home'
import { DEMO_URL } from '@/config/site'
import { useText } from '@/context/EditableTextsContext'
import { EDITABLE_TEXTS } from '@/lib/admin/texts'
import { listPublicVideos } from '@/lib/admin/videos'
import type { PacoVideoRow } from '@/lib/admin/types'
import pepaFace from '@/assets/brand/references/pepa-face-reference-official.jpg'
import pepaFullBody from '@/assets/brand/references/pepa-fullbody-reference-official.jpg'

// Secciones de la HOME (todas con el mismo esqueleto: section > container).
// Cada enlace o botón de aquí hace algo real; lo decorativo no lleva
// apariencia de botón.

// ---------------------------------------------------------------- Demo

export function DemoSection() {
  return (
    <section id="demo" className="hm-section hm-demo" aria-labelledby="hm-demo-title">
      <div className="container">
        <div className="hm-demo-card">
          <div className="hm-demo-copy">
            <h2 id="hm-demo-title" className="hm-h2 hm-h2--light">
              No te lo contamos. Pruébalo.
            </h2>
            <p className="hm-sub hm-sub--light">Hemos preparado una familia ficticia para que puedas descubrir PEPA sin usar tus datos reales.</p>
            <a href={DEMO_URL} className="btn btn-light btn-lg">
              Entrar en la demo
            </a>
          </div>
          <ul className="hm-demo-family" aria-hidden="true">
            {[
              ['E', '#12A594'],
              ['C', '#4C6EF5'],
              ['L', '#E91E63'],
              ['H', '#F4A11F'],
            ].map(([initial, color]) => (
              <li key={initial} style={{ background: color }}>
                {initial}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Test

export function QuizSection() {
  return (
    <section id="test" className="hm-section hm-quiz-section" aria-labelledby="hm-quiz-title">
      <div className="container">
        <header className="hm-section-head hm-center">
          <h2 id="hm-quiz-title" className="hm-h2">
            ¿Sobreviviría PEPA a tu familia?
          </h2>
          <p className="hm-sub">Cinco preguntas y te digo cuánto caos hay en casa.</p>
        </header>
        <SurvivalQuiz />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Conoce a PEPA

export function MeetPepa() {
  return (
    <section id="conoce-a-pepa" className="hm-section hm-meet" aria-labelledby="hm-meet-title">
      <div className="container hm-meet-grid">
        <div className="hm-meet-art">
          <img src={pepaFullBody} alt="PEPA, con su taza, su bolsa «Una vida más fácil» y una tableta" width={1024} height={1536} loading="lazy" decoding="async" />
        </div>
        <div className="hm-meet-copy">
          <p className="hm-eyebrow">Conoce a PEPA</p>
          <h2 id="hm-meet-title" className="hm-h2">
            Hola, soy PEPA.
          </h2>
          <p className="hm-meet-quote">Yo me acuerdo para que tú no tengas que hacerlo.</p>
          <p>
            Te ayudo a tener a mano el calendario, las compras, la economía, la cocina, los documentos y los eventos de toda la familia. Sin hojas de cálculo y sin grupos de mensajes infinitos.
          </p>
          <p className="hm-meet-joke">Paco todavía cree que es él quien se acuerda de todo. Yo no le llevo la contraria.</p>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- La vida con Paco

function platformOf(url: string): string | null {
  try {
    const host = new URL(url).hostname
    if (host.includes('tiktok')) return 'TikTok'
    if (host.includes('youtube') || host === 'youtu.be') return 'YouTube'
    if (host.includes('instagram')) return 'Instagram'
    if (host.includes('facebook')) return 'Facebook'
    return null
  } catch {
    return null
  }
}

export function VideoCard({ video, big }: { video: PacoVideoRow; big: boolean }) {
  const title = video.title.trim()
  const platform = video.platform?.trim() || platformOf(video.videoUrl)
  return (
    <a
      className={`hm-video${big ? ' hm-video--big' : ''}`}
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}${platform ? ` (se abre en ${platform}, en otra pestaña)` : ' (se abre en otra pestaña)'}`}
    >
      {video.thumbnailUrl ? (
        <img src={video.thumbnailUrl} alt="" width={1080} height={2400} loading="lazy" decoding="async" />
      ) : (
        <span className="hm-video-empty" aria-hidden="true" />
      )}
      <span className="hm-video-play" aria-hidden="true">
        ▶
      </span>
      <span className="hm-video-caption">
        <strong>{title}</strong>
        {platform && <small>Ver en {platform} ↗</small>}
      </span>
    </a>
  )
}

export function PacoSection() {
  const [videos, setVideos] = useState<PacoVideoRow[] | null>(null)

  useEffect(() => {
    listPublicVideos()
      .then(setVideos)
      .catch(() => setVideos([]))
  }, [])

  // El orden lo decide el panel (/admin → Vídeos): el primero es el destacado.
  const shown = (videos ?? []).slice(0, 3)

  return (
    <section id="paco" className="hm-section hm-paco" aria-labelledby="hm-paco-title">
      <div className="container">
        <header className="hm-section-head">
          <p className="hm-eyebrow hm-eyebrow--light">«Paco dice que PEPA es una chivata…»</p>
          <h2 id="hm-paco-title" className="hm-h2 hm-h2--light">
            La vida con Paco
          </h2>
          <p className="hm-sub hm-sub--light">Situaciones reales. Humor real. Una familia real.</p>
        </header>

        {videos !== null && shown.length === 0 && (
          <div className="hm-paco-empty">
            <p>
              <strong>Muy pronto, aquí 🎬</strong>
            </p>
            <p>Estamos grabando los primeros capítulos de «La vida con Paco».</p>
          </div>
        )}

        {shown.length > 0 && (
          <>
            <div className={`hm-videos hm-videos--${shown.length}`}>
              {shown.map((v, i) => (
                <VideoCard key={v.id} video={v} big={i === 0} />
              ))}
            </div>
            <div className="hm-center">
              <Link to="/paco" className="btn btn-light btn-lg">
                Ver todos los episodios
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Un día con PEPA

export function DayWithPepa() {
  return (
    <section id="un-dia-con-pepa" className="hm-section hm-day" aria-labelledby="hm-day-title">
      <div className="container">
        <header className="hm-section-head hm-center">
          <h2 id="hm-day-title" className="hm-h2">
            Un día con PEPA
          </h2>
          <p className="hm-sub">Pequeñas cosas de un día cualquiera, ya resueltas.</p>
        </header>
        <ol className="hm-timeline">
          {DAY_WITH_PEPA.map((m) => (
            <li key={m.time} className="hm-moment">
              <time className="hm-moment-time" dateTime={m.time}>
                {m.time}
              </time>
              <p>{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Acceso anticipado

export function EarlyAccess() {
  return (
    <section id="acceso-anticipado" className="hm-section hm-early" aria-labelledby="hm-early-title">
      <div className="container">
        <div className="hm-early-card">
          <div>
            <h2 id="hm-early-title" className="hm-h3 hm-early-title">
              PEPA está en acceso anticipado
            </h2>
            <p>
              La estamos probando con las primeras familias. Si quieres ser de las siguientes, deja tu email y te avisamos cuando puedas entrar. Solo lo usamos para eso (
              <Link to="/privacidad" className="hm-textlink">
                privacidad
              </Link>
              ).
            </p>
          </div>
          <WaitlistForm source="home_acceso_anticipado" />
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Preguntas

export function FaqSection() {
  return (
    <section id="preguntas" className="hm-section hm-faq" aria-labelledby="hm-faq-title">
      <div className="container">
        <header className="hm-section-head hm-center">
          <h2 id="hm-faq-title" className="hm-h2">
            Preguntas frecuentes
          </h2>
        </header>
        <Faq />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Guías

export function FeaturedGuides() {
  const [guides, setGuides] = useState<GuideSummary[]>([])

  useEffect(() => {
    // Lista generada al compilar (scripts/guias): solo guías publicadas.
    fetch(`${import.meta.env.BASE_URL}guias/guias.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: unknown) => setGuides(Array.isArray(list) ? (list as GuideSummary[]).slice(0, 3) : []))
      .catch(() => setGuides([]))
  }, [])

  if (guides.length === 0) return null

  return (
    <section id="guias" className="hm-section hm-guides" aria-labelledby="hm-guides-title">
      <div className="container">
        <header className="hm-section-head hm-center">
          <h2 id="hm-guides-title" className="hm-h2">
            Ideas para organizar tu familia
          </h2>
          <p className="hm-sub">Guías prácticas, con o sin PEPA.</p>
        </header>
        <ul className="hm-guide-list">
          {guides.map((g) => (
            <li key={g.slug}>
              <a className="hm-guide" href={`/guias/${g.slug}/`}>
                <span className="hm-guide-tag">{g.tema}</span>
                <strong>{g.titulo}</strong>
                <span className="hm-guide-text">{g.resumen}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="hm-center">
          <a href="/guias/" className="btn btn-ghost btn-lg">
            Ver todas las guías
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- CTA final

const FINAL_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'final_cta_title')!.fallback
const HERO_CTA_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'hero_cta')!.fallback

export function FinalCta() {
  const title = useText('final_cta_title', FINAL_DEFAULT)
  const cta = useText('hero_cta', HERO_CTA_DEFAULT)
  return (
    <section id="empezar" className="hm-section hm-final" aria-labelledby="hm-final-title">
      <div className="container hm-final-inner">
        <img className="hm-final-face" src={pepaFace} alt="PEPA" width={1254} height={1254} loading="lazy" decoding="async" />
        <h2 id="hm-final-title" className="hm-h2 hm-final-title">
          {title}
        </h2>
        <a href={DEMO_URL} className="btn btn-primary btn-lg">
          {cta}
        </a>
      </div>
    </section>
  )
}
