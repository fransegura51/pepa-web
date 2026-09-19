const BENEFITS = [
  { icon: '⏱️', label: 'Ahorra tiempo' },
  { icon: '🌿', label: 'Menos estrés' },
  { icon: '👨‍👩‍👧‍👦', label: 'Toda la familia conectada' },
  { icon: '⭐', label: 'Más momentos de calidad' },
]

export function BenefitsDemo() {
  return (
    <div className="benefits-layout">
      <div className="phone-mockup" style={{ margin: 0 }}>
        <img src="/screenshots/calendario.svg" alt="Calendario compartido de la familia en PEPA" loading="lazy" />
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
