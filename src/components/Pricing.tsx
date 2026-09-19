import { WaitlistForm } from '@/components/WaitlistForm'

// Sin tarifa cerrada todavía (Skill: "no inventar tarifas definitivas").
export function Pricing() {
  return (
    <div className="pricing-card">
      <span className="pricing-badge">Próximamente</span>
      <h2>Aún estamos afinando el precio</h2>
      <p style={{ color: 'var(--texto-suave)' }}>
        PEPA está en fase de acceso anticipado. Apúntate a la lista de espera y serás de las primeras familias en
        probarla y en saber cuánto costará.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <WaitlistForm source="precios_page" />
      </div>
    </div>
  )
}
