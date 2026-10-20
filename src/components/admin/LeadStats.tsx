import { useEffect, useState } from 'react'
import { errorMessage } from '@/lib/errorMessage'
import { getLeadRows, summarizeLeads, type LeadSummary } from '@/lib/admin/leads'

const nf = new Intl.NumberFormat('es-ES')

export function LeadStatsPanel() {
  const [summary, setSummary] = useState<LeadSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getLeadRows()
      .then((rows) => {
        if (!cancelled) setSummary(summarizeLeads(rows))
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, 'No se han podido cargar las altas'))
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <p style={{ color: '#b3261e' }}>{error}</p>
  if (!summary) return <p style={{ color: 'var(--texto-suave)' }}>Cargando altas…</p>
  return (
    <section className="visit-stats" aria-label="Altas en la lista de espera">
      <h2 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Altas en la lista de espera</h2>
      <p className="visit-note">Personas que han dejado su correo en la web, y por qué canal llegaron (enlaces con ?origen=).</p>
      <div className="visit-cards">
        <div className="visit-card">
          <span className="visit-card-label">Total</span>
          <strong className="visit-card-value">{nf.format(summary.total)}</strong>
        </div>
        <div className="visit-card">
          <span className="visit-card-label">Últimos 7 días</span>
          <strong className="visit-card-value">{nf.format(summary.last7)}</strong>
        </div>
      </div>
      <h3 style={{ fontSize: '1rem', margin: '18px 0 6px' }}>Por canal</h3>
      {summary.byChannel.length === 0 ? (
        <p className="visit-note">Todavía no hay altas.</p>
      ) : (
        <ul className="visit-top">
          {summary.byChannel.map((c) => (
            <li key={c.channel}>
              <span>{c.channel}</span>
              <strong>{nf.format(c.count)}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
