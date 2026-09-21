import { useEffect, useState } from 'react'
import { errorMessage } from '@/lib/errorMessage'
import { getVisitRows, getVisitTotals, pageLabel, summarizeVisits, type VisitSummary, type VisitTotals } from '@/lib/admin/visits'
import { isThisDeviceExcluded, madridDay } from '@/lib/visits'

const nf = new Intl.NumberFormat('es-ES')

function shortDay(day: string): string {
  const [, m, d] = day.split('-')
  return `${Number(d)}/${Number(m)}`
}

export function VisitStatsView({ summary, totals, excludedDevice }: { summary: VisitSummary; totals: VisitTotals | null; excludedDevice: boolean }) {
  const max = Math.max(1, ...summary.series.map((s) => s.views))
  const cards: { label: string; views: number; visitors: number }[] = [
    { label: 'Hoy', ...summary.today },
    { label: 'Ayer', ...summary.yesterday },
    { label: 'Últimos 7 días', ...summary.last7 },
    { label: 'Últimos 30 días', ...summary.last30 },
  ]
  return (
    <section className="visit-stats" aria-label="Visitas a la web">
      <h2 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Visitas a la web</h2>
      <p className="visit-note">
        Páginas vistas y visitantes aproximados (un visitante = un navegador, una vez al día). Sin cookies ni datos personales.
      </p>
      <div className="visit-cards">
        {cards.map((c) => (
          <div key={c.label} className="visit-card">
            <span className="visit-card-label">{c.label}</span>
            <strong className="visit-card-value">{nf.format(c.views)}</strong>
            <span className="visit-card-sub">
              {nf.format(c.visitors)} {c.visitors === 1 ? 'visitante' : 'visitantes'}
            </span>
          </div>
        ))}
      </div>
      {totals && totals.since && (
        <p className="visit-note">
          Desde el {shortDay(totals.since)} (cuando se empezó a contar): <strong>{nf.format(totals.totalViews)}</strong> páginas vistas y{' '}
          <strong>{nf.format(totals.totalVisitors)}</strong> visitantes.
        </p>
      )}

      <div className="visit-bars" role="img" aria-label="Páginas vistas por día, últimos 30 días">
        {summary.series.map((s) => (
          <div key={s.day} className="visit-bar-col" title={`${shortDay(s.day)}: ${s.views} páginas vistas, ${s.visitors} visitantes`}>
            <div className="visit-bar" style={{ height: `${Math.max(s.views > 0 ? 4 : 0, (s.views / max) * 100)}%` }} />
          </div>
        ))}
      </div>
      <div className="visit-bars-axis">
        <span>{shortDay(summary.series[0].day)}</span>
        <span>{shortDay(summary.series[summary.series.length - 1].day)}</span>
      </div>

      <h3 style={{ fontSize: '1rem', margin: '18px 0 6px' }}>Páginas más vistas (30 días)</h3>
      {summary.topPages.length === 0 ? (
        <p className="visit-note">Todavía no hay visitas registradas.</p>
      ) : (
        <ul className="visit-top">
          {summary.topPages.map((p) => (
            <li key={p.path}>
              <span>{pageLabel(p.path)}</span>
              <strong>{nf.format(p.views)}</strong>
            </li>
          ))}
        </ul>
      )}
      {excludedDevice && <p className="visit-note">Este navegador no cuenta tus propias visitas (has entrado como administradora).</p>}
    </section>
  )
}

export function VisitStatsPanel() {
  const [state, setState] = useState<{ summary: VisitSummary; totals: VisitTotals | null } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([getVisitRows(30), getVisitTotals().catch(() => null)])
      .then(([rows, totals]) => {
        if (!cancelled) setState({ summary: summarizeVisits(rows, madridDay()), totals })
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, 'No se han podido cargar las visitas'))
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <p style={{ color: '#b3261e' }}>{error}</p>
  if (!state) return <p style={{ color: 'var(--texto-suave)' }}>Cargando visitas…</p>
  return <VisitStatsView summary={state.summary} totals={state.totals} excludedDevice={isThisDeviceExcluded()} />
}
