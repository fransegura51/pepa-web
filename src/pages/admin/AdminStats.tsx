import { VisitStatsPanel } from '@/components/admin/VisitStats'
import { LeadStatsPanel } from '@/components/admin/LeadStats'

// Martes 15 de diciembre de 2026: apertura de la prueba (medianoche en Madrid, en UTC+1).
const LAUNCH = new Date('2026-12-15T00:00:00+01:00')

function daysToLaunch(now: Date = new Date()): number {
  return Math.ceil((LAUNCH.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
}

export function AdminStats() {
  const days = daysToLaunch()
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem' }}>Estadísticas</h1>
      <p style={{ color: 'var(--texto-suave)' }}>
        {days > 0 ? `Faltan ${days} ${days === 1 ? 'día' : 'días'} para abrir la prueba (martes 15 de diciembre).` : 'La prueba ya está abierta.'}
      </p>
      <VisitStatsPanel />
      <LeadStatsPanel />
    </div>
  )
}
