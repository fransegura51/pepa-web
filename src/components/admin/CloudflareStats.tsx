import { useEffect, useState } from 'react'
import { errorMessage } from '@/lib/errorMessage'
import { getCloudflareStats, totalsOf, type CloudflareStats } from '@/lib/admin/cloudflare'

const nf = new Intl.NumberFormat('es-ES')

function List({ title, rows }: { title: string; rows: { name: string; views: number }[] | undefined }) {
  if (!rows || rows.length === 0) return null
  return (
    <>
      <h3 style={{ fontSize: '1rem', margin: '18px 0 6px' }}>{title}</h3>
      <ul className="visit-top">
        {rows.map((r) => (
          <li key={r.name}>
            <span>{r.name}</span>
            <strong>{nf.format(r.views)}</strong>
          </li>
        ))}
      </ul>
    </>
  )
}

export function CloudflareStatsPanel() {
  const [stats, setStats] = useState<CloudflareStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getCloudflareStats()
      .then((s) => {
        if (!cancelled) setStats(s)
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, 'No se han podido cargar las estadísticas de Cloudflare'))
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <p style={{ color: '#b3261e' }}>{error}</p>
  if (!stats) return <p style={{ color: 'var(--texto-suave)' }}>Cargando Cloudflare…</p>
  if (!stats.configured) {
    return (
      <section className="visit-stats" aria-label="Cloudflare">
        <h2 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Cloudflare (países, orígenes, dispositivos)</h2>
        <p className="visit-note">Todavía no está conectado: faltan los tres secretos de la función en Supabase.</p>
      </section>
    )
  }
  if (stats.error) {
    return (
      <section className="visit-stats" aria-label="Cloudflare">
        <h2 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Cloudflare</h2>
        <p style={{ color: '#b3261e' }}>Cloudflare ha respondido con un error: {stats.error}</p>
      </section>
    )
  }
  const t = totalsOf(stats)
  return (
    <section className="visit-stats" aria-label="Cloudflare">
      <h2 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Cloudflare (últimos 30 días)</h2>
      <p className="visit-note">Cuenta aparte del contador propio. Incluye visitas hechas desde dispositivos aún no marcados como tuyos.</p>
      <div className="visit-cards">
        <div className="visit-card">
          <span className="visit-card-label">Páginas vistas</span>
          <strong className="visit-card-value">{nf.format(t.views)}</strong>
        </div>
        <div className="visit-card">
          <span className="visit-card-label">Visitas</span>
          <strong className="visit-card-value">{nf.format(t.visits)}</strong>
        </div>
      </div>
      <List title="Países" rows={stats.countries} />
      <List title="De dónde llegan" rows={stats.referrers} />
      <List title="Páginas más vistas" rows={stats.paths} />
    </section>
  )
}
