import { WaitlistForm } from '@/components/WaitlistForm'

export function FinalCta() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>¿Lista para más tiempo de lo que realmente importa?</h2>
      <p style={{ color: 'var(--texto-suave)', maxWidth: '48ch', margin: '0 auto 24px' }}>
        Únete a las familias que ya están probando PEPA.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <WaitlistForm source="final_cta" />
      </div>
    </div>
  )
}
