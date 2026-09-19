import { Link } from 'react-router-dom'
import { Hero } from '@/components/Hero'
import { ModulesGrid } from '@/components/ModulesGrid'
import { BenefitsDemo } from '@/components/BenefitsDemo'
import { PacoLife } from '@/components/PacoLife'
import { SurvivalQuiz } from '@/components/SurvivalQuiz'
import { AppDemo } from '@/components/AppDemo'
import { EventsHighlight } from '@/components/EventsHighlight'
import { PacoQuestionWidget } from '@/components/PacoQuestionWidget'
import { Pricing } from '@/components/Pricing'
import { Faq } from '@/components/Faq'
import { FinalCta } from '@/components/FinalCta'
import { Reveal } from '@/components/Reveal'

// Sección "Familias / prueba social" del content-map NO se construye
// todavía: la Skill pide ocultarla mientras no haya testimonios reales
// autorizados, en vez de rellenarla con contenido de ejemplo.
export function Home() {
  return (
    <>
      <Hero />

      <section className="section section--pastel-turquesa">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Descubre todo lo que PEPA puede hacer por tu familia</h2>
              <p>Herramientas reales para el día a día. Sencillas, prácticas y pensadas para familias.</p>
            </div>
            <Link to="/funciones" className="btn btn-ghost">
              Ver todas las funciones →
            </Link>
          </div>
          <Reveal>
            <ModulesGrid />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <BenefitsDemo />
          </Reveal>
        </div>
      </section>

      <section className="section section--pastel-crema">
        <div className="container">
          <Reveal>
            <PacoLife />
          </Reveal>
        </div>
      </section>

      <section className="section section--pastel-turquesa">
        <div className="container">
          <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ margin: '0 auto' }}>
              <h2>¿Sobreviviría PEPA a tu familia?</h2>
              <p style={{ margin: '0 auto' }}>Responde 5 preguntas y descubre vuestro nivel de caos (y cómo PEPA puede ayudar).</p>
            </div>
          </div>
          <Reveal>
            <SurvivalQuiz />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Menos promesas. Mira cómo funciona.</h2>
              <p>Capturas reales de la app, módulo a módulo.</p>
            </div>
          </div>
          <Reveal>
            <AppDemo />
          </Reveal>
        </div>
      </section>

      <section className="section section--pastel-crema">
        <div className="container">
          <Reveal>
            <EventsHighlight />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <PacoQuestionWidget />
          </Reveal>
        </div>
      </section>

      <section className="section section--pastel-turquesa" id="precios">
        <div className="container">
          <Reveal>
            <Pricing />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ margin: '0 auto' }}>
              <h2>Preguntas frecuentes</h2>
            </div>
          </div>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

      <section className="section section--pastel-crema">
        <div className="container">
          <Reveal>
            <FinalCta />
          </Reveal>
        </div>
      </section>
    </>
  )
}
