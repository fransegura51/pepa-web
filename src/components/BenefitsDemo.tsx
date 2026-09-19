import { PhoneCarousel } from '@/components/PhoneCarousel'
import { asset } from '@/lib/assetUrl'

const BENEFITS = [
  { icon: '⏱️', label: 'Ahorra tiempo' },
  { icon: '🌿', label: 'Menos estrés' },
  { icon: '👨‍👩‍👧‍👦', label: 'Toda la familia conectada' },
  { icon: '⭐', label: 'Más momentos de calidad' },
]

const IMAGES = [
  { src: asset('screenshots/calendario.svg'), alt: 'Calendario compartido de la familia en PEPA' },
  { src: asset('screenshots/compras.svg'), alt: 'Lista de la compra de PEPA' },
  { src: asset('screenshots/cocina.svg'), alt: 'Menú semanal en PEPA' },
]

export function BenefitsDemo() {
  return (
    <div className="benefits-layout">
      <div className="phone-mockup" style={{ margin: 0 }}>
        <PhoneCarousel images={IMAGES} />
      </div>
      <div>
        <p className="eyebrow">Más organización. Más momentos juntos.</p>
        <h2>PEPA se encarga de las cosas. Tú disfrutas de lo importante.</h2>
        <p style={{ color: 'var(--texto-suave)', maxWidth: '48ch' }}>
          Nada de promesas vacías: PEPA reparte tareas, avisa de lo que toca y deja el resto del tiempo para vosotros.
        </p>
        <div className="benefit-list">
          {BENEFITS.map((b) => (
            <div key={b.label} className="benefit-item">
              <span className="icon">{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
