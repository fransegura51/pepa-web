import { MODULES } from '@/config/content'

export function ModulesGrid() {
  return (
    <div className="modules-grid">
      {MODULES.map((m) => (
        <div key={m.key} className="module-card" style={{ background: m.color }}>
          <div className="module-card-icon">{m.icon}</div>
          <h3>{m.name}</h3>
          <p>{m.tagline}</p>
        </div>
      ))}
    </div>
  )
}
