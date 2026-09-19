import { useEffect, useState } from 'react'
import { EDITABLE_TEXTS, getAllTexts, setText } from '@/lib/admin/texts'

export function AdminTexts() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllTexts()
      .then((t) => setValues(Object.fromEntries(EDITABLE_TEXTS.map((d) => [d.key, t[d.key] ?? d.fallback]))))
      .catch(() => {})
  }, [])

  async function save(key: string) {
    setError('')
    setSaved(null)
    try {
      await setText(key, values[key] ?? '')
      setSaved(key)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido guardar.')
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.3rem' }}>Textos editables</h1>
      <p style={{ color: 'var(--texto-suave)', fontSize: '0.9rem' }}>
        Solo estos textos concretos de la web — no hace falta tocar código para cambiarlos.
      </p>
      {EDITABLE_TEXTS.map((def) => (
        <div key={def.key} className="admin-form">
          <label>
            {def.label}
            <textarea
              rows={2}
              value={values[def.key] ?? ''}
              onChange={(e) => setValues({ ...values, [def.key]: e.target.value })}
            />
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={() => save(def.key)}>
              Guardar
            </button>
            {saved === def.key && <span style={{ color: 'var(--turquesa-dark)', fontSize: '0.85rem' }}>Guardado ✓</span>}
          </div>
        </div>
      ))}
      {error && <p className="form-message form-message--error">{error}</p>}
    </div>
  )
}
