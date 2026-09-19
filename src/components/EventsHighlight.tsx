import { asset } from '@/lib/assetUrl'

export function EventsHighlight() {
  return (
    <div className="events-highlight">
      <div>
        <p className="eyebrow">Del "vamos a hacer algo pequeño"…</p>
        <h2>…a 47 invitados. PEPA organiza también tus eventos.</h2>
        <p style={{ color: 'var(--texto-suave)', maxWidth: '48ch' }}>
          Cumpleaños, comuniones, bautizos, aniversarios o cualquier celebración: cuenta atrás, invitados, tareas,
          presupuesto y menú, todo en un mismo sitio.
        </p>
        <div className="events-stats">
          <div className="events-stat">📅 Cuenta atrás</div>
          <div className="events-stat">👥 Invitados y RSVP</div>
          <div className="events-stat">✅ Tareas y preparativos</div>
          <div className="events-stat">💰 Presupuesto y menú</div>
        </div>
      </div>
      <div className="phone-mockup" style={{ margin: 0 }}>
        <img src={asset('screenshots/eventos.svg')} alt="Panel de un evento organizado con PEPA" loading="lazy" />
      </div>
    </div>
  )
}
