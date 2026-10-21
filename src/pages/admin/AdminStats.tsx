import { VisitStatsPanel } from '@/components/admin/VisitStats'
import { LeadStatsPanel } from '@/components/admin/LeadStats'
import { CloudflareStatsPanel } from '@/components/admin/CloudflareStats'

export function AdminStats() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem' }}>Estadísticas</h1>
      <VisitStatsPanel />
      <LeadStatsPanel />
      <CloudflareStatsPanel />
    </div>
  )
}
