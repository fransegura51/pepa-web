import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HistoriaFoto } from '@/components/HistoriaFoto'
import { VideoCard } from '@/components/HomeSections'
import {
  AI_TOOLS,
  BUILD_VERBS,
  CHORES,
  ETAPAS,
  GROWTH,
  HISTORIA_DESCRIPTION,
  HISTORIA_TITLE,
  PACO_SITUATIONS,
  TOOLS_FOUND,
  USING_PHRASES,
} from '@/config/historia'
import { DEMO_URL } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { listPublicVideos } from '@/lib/admin/videos'
import type { PacoVideoRow } from '@/lib/admin/types'
import pepaFace from '@/assets/brand/references/pepa-face-reference-official.jpg'
import '@/styles/historia.css'

// Animaciones suaves al hacer scroll: solo si el navegador las permite
// (IntersectionObserver y sin «reducir movimiento»). Sin JavaScript, o con
// movimiento reducido, todo el contenido se ve desde el principio.
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = [...el.querySelectorAll<HTMLElement>('.hs-reveal')]
    el.classList.add('hs-anim')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('hs-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    targets.forEach((t) => observer.observe(t))
    return () => {
      observer.disconnect()
      el.classList.remove('hs-anim')
    }
  }, [root])
}

export function Historia() {
  useDocumentMeta(HISTORIA_TITLE, HISTORIA_DESCRIPTION)

  const page = useRef<HTMLDivElement>(null)
  useReveal(page)

  const [videos, setVideos] = useState<PacoVideoRow[] | null>(null)
  useEffect(() => {
    listPublicVideos()
      .then(setVideos)
      .catch(() => setVideos([]))
  }, [])
  const shownVideos = (videos ?? []).slice(0, 3)

  return (
    <div className="hs-page" ref={page}>
      {/* 1 · HERO */}
      <section className="hs-hero" aria-labelledby="hs-h1">
        <div className="container hs-hero-grid">
          <div className="hs-hero-copy">
            <p className="hs-eyebrow">Nuestra historia</p>
            <h1 id="hs-h1" className="hs-h1">
              Cómo empezó todo
            </h1>
            <p className="hs-hero-quote">
              PEPA no nació porque quisiéramos crear una app.
              <br />
              <strong>Nació porque necesitábamos una.</strong>
            </p>
          </div>
          <HistoriaFoto slot="historia-familia" className="hs-hero-photo" priority />
        </div>
      </section>

      {/* 2 · EL PRINCIPIO */}
      <section className="hs-section hs-principio" aria-labelledby="hs-principio">
        <div className="container hs-narrow">
          <p className="hs-eyebrow hs-reveal">El principio</p>
          <h2 id="hs-principio" className="hs-h2 hs-reveal">
            Somos una familia normal.
          </h2>
          <div className="hs-prose hs-reveal">
            <p>
              Trabajamos los dos, tenemos un niño de cuatro años y medio y acabábamos de recibir a un nuevo miembro en la familia.
            </p>
            <p>
              Durante nuestras bajas de maternidad y paternidad descubrimos algo que probablemente muchas familias conocen demasiado bien: aunque estés en casa, parece que nunca llegas a todo.
            </p>
          </div>

          <ul className="hs-chores hs-reveal" aria-label="Todo lo que había que recordar">
            {CHORES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <p className="hs-marker hs-reveal">
            Y, por supuesto, <mark>dormir cuando el bebé decide que dormir está sobrevalorado.</mark> 😴
          </p>
        </div>
      </section>

      {/* 3 · EL PROBLEMA */}
      <section className="hs-section hs-problema" aria-labelledby="hs-problema">
        <div className="container hs-narrow">
          <p className="hs-eyebrow hs-reveal">El problema</p>
          <h2 id="hs-problema" className="hs-h2 hs-reveal">
            Empezamos a buscar ayuda
          </h2>
          <p className="hs-reveal">Buscamos herramientas y aplicaciones que pudieran echarnos una mano. Encontrábamos:</p>
          <ul className="hs-tags hs-reveal" aria-label="Lo que encontrábamos">
            {TOOLS_FOUND.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="hs-reveal">Pero apareció un problema nuevo.</p>

          <blockquote className="hs-callout hs-reveal">
            Para organizar nuestra vida necesitábamos <strong>media docena de aplicaciones diferentes.</strong>
          </blockquote>
          <p className="hs-lead hs-reveal">Y ninguna estaba hecha exactamente como nosotros necesitábamos.</p>
        </div>

        <div className="container hs-turn hs-reveal">
          <p className="hs-turn-label">Y entonces…</p>
          <p className="hs-turn-question">
            ¿Y si construimos nosotros la aplicación que nos gustaría tener?
          </p>
        </div>
      </section>

      {/* 4 · NACE PEPA */}
      <section className="hs-section hs-nace" aria-labelledby="hs-nace">
        <div className="container hs-nace-grid">
          <div className="hs-nace-copy">
            <p className="hs-eyebrow hs-reveal">Nace PEPA</p>
            <h2 id="hs-nace" className="hs-h2 hs-reveal">
              Era nuestra aplicación familiar
            </h2>
            <p className="hs-reveal">Al principio PEPA no tenía ninguna intención de convertirse en un producto.</p>
            <p className="hs-big-line hs-reveal">Era nuestra aplicación familiar.</p>
            <p className="hs-reveal">
              Empezamos a construirla aprovechando una nueva generación de tecnologías de inteligencia artificial y desarrollo asistido. Hemos utilizado herramientas como:
            </p>
            <ul className="hs-tags hs-tags--soft hs-reveal" aria-label="Herramientas que hemos utilizado">
              {AI_TOOLS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="hs-reveal">Nos han permitido…</p>
            <p className="hs-verbs hs-reveal">
              {BUILD_VERBS.map((v, i) => (
                <span key={v}>
                  {v}
                  {i < BUILD_VERBS.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </p>
            <p className="hs-gag hs-reveal">
              Muchas veces.
              <br />
              <strong>Muchas.</strong>
            </p>
          </div>
          <div className="hs-nace-photos hs-reveal">
            <HistoriaFoto slot="historia-inicios" />
            <HistoriaFoto slot="historia-primera-pepa" />
          </div>
        </div>
      </section>

      {/* 5 · ¿QUIÉN ES PEPA REALMENTE? */}
      <section className="hs-quien" aria-labelledby="hs-quien">
        <div className="container">
          <header className="hs-quien-head">
            <p className="hs-eyebrow hs-eyebrow--rosa hs-reveal">De dónde viene su nombre</p>
            <h2 id="hs-quien" className="hs-h2 hs-reveal">
              ¿Quién es PEPA realmente?
            </h2>
          </header>

          <div className="hs-quien-art hs-reveal">
            <figure className="hs-person">
              <HistoriaFoto slot="historia-abuela-pepa" />
              <figcaption>La abuela de la familia</figcaption>
            </figure>
            <p className="hs-arrow" aria-hidden="true">
              <span>inspiración</span>
              <svg viewBox="0 0 120 24" width="120" height="24" focusable="false">
                <path d="M2 12h108m0 0-9-8m9 8-9 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
            <figure className="hs-person hs-person--pepa">
              <img
                src={pepaFace}
                alt="PEPA, el personaje oficial de la app, con su pelo gris, sus gafas de carey y su sonrisa cercana"
                width={1254}
                height={1254}
                loading="lazy"
                decoding="async"
              />
              <figcaption>PEPA</figcaption>
            </figure>
          </div>

          <div className="hs-quien-text hs-narrow">
            <div className="hs-prose hs-reveal">
              <p>PEPA no es un nombre elegido al azar.</p>
              <p>
                <strong>Pepa es la abuela de la familia.</strong>
              </p>
              <p>
                La persona que siempre intenta echar una mano. A sus hijos, a sus nietos y a cualquiera de la familia que lo necesite.
              </p>
              <p>
                La que está pendiente, la que recuerda cosas, la que ayuda cuando hay un problema y la que intenta hacer un poquito más fácil el día a día de todos.
              </p>
              <p>Cuando nuestra aplicación empezó a tomar forma, nos dimos cuenta de que eso era precisamente lo que queríamos que llegara a ser:</p>
            </div>
            <p className="hs-big-line hs-big-line--rosa hs-reveal">una ayuda que estuviera ahí cuando la familia la necesitara.</p>
            <div className="hs-prose hs-reveal">
              <p>Y entonces el nombre tuvo todo el sentido.</p>
              <p>
                <strong>PEPA nació inspirada en ella.</strong>
              </p>
              <p className="hs-aside">
                No pretendemos sustituir a una abuela —eso todavía le queda bastante grande a la inteligencia artificial—, sino trasladar a la aplicación esa idea de estar pendiente, ayudar, recordar y hacer más sencilla la vida de la familia.
              </p>
              <p>Por eso PEPA tiene nombre, tiene cara y tiene personalidad.</p>
            </div>

            <blockquote className="hs-real hs-reveal">
              <p>Detrás del personaje de PEPA hay una persona real.</p>
              <p>
                <strong>La abuela de nuestra familia.</strong>
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 6 · CONSTRUIR PEPA UTILIZÁNDOLA */}
      <section className="hs-section hs-usar" aria-labelledby="hs-usar">
        <div className="container">
          <header className="hs-narrow">
            <p className="hs-eyebrow hs-reveal">Construir PEPA utilizándola</p>
            <h2 id="hs-usar" className="hs-h2 hs-reveal">
              No la diseñamos desde una teoría
            </h2>
            <p className="hs-reveal">
              PEPA no se diseñó desde una teoría sobre cómo debería organizarse una familia. La construimos utilizándola nosotros mismos.
            </p>
          </header>

          <ul className="hs-notes hs-reveal" aria-label="Lo que nos íbamos diciendo mientras la usábamos">
            {USING_PHRASES.map((p, i) => (
              <li key={p} className={`hs-note hs-note--${i + 1}`}>
                {p}
              </li>
            ))}
          </ul>

          <p className="hs-grow-title hs-reveal">Y así fue creciendo:</p>
          <ul className="hs-grow hs-reveal" aria-label="Lo que fue incorporando PEPA">
            {GROWTH.map((g) => (
              <li key={g.label}>
                <span aria-hidden="true">{g.icon}</span>
                {g.label}
              </li>
            ))}
          </ul>

          <div className="hs-usar-photos hs-reveal">
            <HistoriaFoto slot="historia-desarrollo" />
            <HistoriaFoto slot="historia-evolucion" />
          </div>
        </div>
      </section>

      {/* 7 · UNA IDEA QUE DEFINE PEPA */}
      <section className="hs-idea" aria-labelledby="hs-idea">
        <div className="container hs-narrow">
          <h2 id="hs-idea" className="hs-idea-eyebrow hs-reveal">
            Una idea que define PEPA
          </h2>
          <blockquote className="hs-idea-quote hs-reveal">
            Que sea la tecnología la que se adapte a la familia,
            <br />
            <strong>y no la familia la que tenga que adaptarse a la tecnología.</strong>
          </blockquote>
        </div>
      </section>

      {/* 8 · LÍNEA TEMPORAL */}
      <section className="hs-section hs-linea" aria-labelledby="hs-linea">
        <div className="container">
          <header className="hs-center">
            <p className="hs-eyebrow hs-reveal">Paso a paso</p>
            <h2 id="hs-linea" className="hs-h2 hs-reveal">
              Diez etapas, de la familia a PEPA
            </h2>
          </header>

          <ol className="hs-timeline">
            {ETAPAS.map((e, i) => (
              <li key={e.title} className={`hs-step hs-step--${e.kind} hs-reveal`}>
                <span className="hs-step-dot" aria-hidden="true">
                  {e.icon}
                </span>
                <div className="hs-step-card">
                  <p className="hs-step-num">Etapa {i + 1}</p>
                  <h3 className="hs-step-title">{e.title}</h3>
                  <p className="hs-step-text">{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 9 · DE NUESTRA CASA A OTRAS FAMILIAS */}
      <section className="hs-section hs-otras" aria-labelledby="hs-otras">
        <div className="container hs-narrow">
          <p className="hs-eyebrow hs-reveal">Del salón de casa a otros salones</p>
          <h2 id="hs-otras" className="hs-h2 hs-reveal">
            De nuestra casa a otras familias
          </h2>
          <div className="hs-prose hs-reveal">
            <p>Entonces nos dimos cuenta de algo.</p>
            <p>Si nosotros teníamos este problema, seguramente no éramos los únicos.</p>
            <p>
              Hay miles de familias trabajando, criando, comprando, cocinando, pagando facturas, organizando cumpleaños, recordando citas y tratando de encontrar un poco de tiempo en mitad de todo aquello.
            </p>
          </div>
          <blockquote className="hs-callout hs-reveal">
            Por eso tomamos una decisión que nunca estuvo en el plan inicial:
            <br />
            <strong>PEPA dejaría de ser solamente nuestra.</strong>
          </blockquote>
          <p className="hs-lead hs-reveal">Decidimos convertirla en una aplicación que otras familias también pudieran utilizar.</p>
        </div>
      </section>

      {/* 10 · QUÉ QUEREMOS CONSTRUIR */}
      <section className="hs-construir" aria-labelledby="hs-construir">
        <div className="container hs-narrow">
          <p className="hs-eyebrow hs-eyebrow--light hs-reveal">Hacia dónde vamos</p>
          <h2 id="hs-construir" className="hs-h2 hs-h2--light hs-reveal">
            Qué queremos construir
          </h2>
          <div className="hs-prose hs-prose--light hs-reveal">
            <p>No queremos construir otra aplicación que simplemente acumule funciones.</p>
            <p>
              Queremos construir un asistente familiar que ayude de verdad en el día a día, que vaya aprendiendo, evolucionando y aprovechando las posibilidades que está abriendo la inteligencia artificial.
            </p>
          </div>
          <p className="hs-closing hs-reveal">
            PEPA empezó intentando solucionar los problemas de una familia.
            <br />
            <strong>La nuestra.</strong>
            <br />
            <span>Ahora queremos descubrir hasta dónde puede llegar ayudando a muchas más.</span>
          </p>
        </div>
      </section>

      {/* 11 · LOS VÍDEOS DE PACO */}
      <section className="hs-paco" aria-labelledby="hs-paco">
        <div className="container">
          <header className="hs-narrow">
            <p className="hs-eyebrow hs-eyebrow--light hs-reveal">Los vídeos de Paco</p>
            <h2 id="hs-paco" className="hs-h2 hs-h2--light hs-reveal">
              Y entonces apareció Paco…
            </h2>
            <div className="hs-prose hs-prose--light hs-reveal">
              <p>
                Mientras desarrollábamos PEPA vimos que muchas situaciones familiares cotidianas eran demasiado reconocibles y, algunas, demasiado absurdas como para no reírnos de ellas.
              </p>
              <p>De ahí nacieron los vídeos de Paco: pequeñas historias inspiradas en situaciones de todos los días.</p>
            </div>
            <ul className="hs-tags hs-tags--light hs-reveal" aria-label="De qué tratan los vídeos">
              {PACO_SITUATIONS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="hs-prose hs-prose--light hs-reveal">…y esos momentos en los que alguien está absolutamente convencido de que:</p>
            <p className="hs-paco-quote hs-reveal">«Eso me lo habías dicho tú.»</p>
            <p className="hs-prose hs-prose--light hs-reveal">
              Los vídeos comenzaron como una forma divertida de dar a conocer PEPA, pero también se han convertido en una forma de contar el mundo real del que nació la aplicación.
            </p>
          </header>

          {videos !== null && shownVideos.length > 0 ? (
            <div className={`hm-videos hm-videos--${shownVideos.length} hs-videos hs-reveal`}>
              {shownVideos.map((v, i) => (
                <VideoCard key={v.id} video={v} big={i === 0} />
              ))}
            </div>
          ) : (
            <div className="hs-paco-photo hs-reveal">
              <HistoriaFoto slot="historia-paco" />
            </div>
          )}

          <p className="hs-paco-close hs-reveal">
            Porque detrás de toda la tecnología, la inteligencia artificial y el código, PEPA sigue teniendo el mismo origen:
            <br />
            <strong>una familia intentando organizar un poquito mejor su vida.</strong>
          </p>
          <div className="hs-center hs-reveal">
            <Link to="/paco" className="btn btn-light btn-lg">
              Ver todos los vídeos de Paco
            </Link>
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="hs-section hs-final" aria-labelledby="hs-final">
        <div className="container hs-center hs-narrow">
          <h2 id="hs-final" className="hs-h2 hs-reveal">
            ¿Quieres ver cómo es PEPA por dentro?
          </h2>
          <p className="hs-lead hs-reveal">La hemos hecho para nosotros. Ahora puedes probarla tú, con una familia ficticia.</p>
          <div className="hs-cta hs-reveal">
            <a href={DEMO_URL} className="btn btn-primary btn-lg">
              Probar PEPA
            </a>
            <Link to="/funciones" className="btn btn-ghost btn-lg">
              Ver las funciones
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
