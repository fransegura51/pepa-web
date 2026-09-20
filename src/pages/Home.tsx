import { Hero } from '@/components/Hero'
import { ModuleViewer } from '@/components/ModuleViewer'
import { DayWithPepa, DemoSection, EarlyAccess, FaqSection, FeaturedGuides, FinalCta, MeetPepa, PacoSection, QuizSection } from '@/components/HomeSections'
import '@/styles/home.css'

// HOME: una narrativa de arriba abajo, una sola galería de capturas
// ("Mira PEPA por dentro") y ningún botón decorativo.
//   1 Hero → 2 Mira PEPA por dentro → 3 Demo → 4 Test → 5 Conoce a PEPA →
//   6 La vida con Paco → 7 Un día con PEPA → 8 Acceso anticipado →
//   9 Preguntas → 10 Guías → 11 CTA final.
// El <title>, la descripción, el canonical y Open Graph de la HOME viven en
// index.html (HTML inicial, visible sin JavaScript).
export function Home() {
  return (
    <div className="hm-page">
      <Hero />
      <ModuleViewer />
      <DemoSection />
      <QuizSection />
      <MeetPepa />
      <PacoSection />
      <DayWithPepa />
      <EarlyAccess />
      <FaqSection />
      <FeaturedGuides />
      <FinalCta />
    </div>
  )
}
