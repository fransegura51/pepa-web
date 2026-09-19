import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  createPromotion,
  deletePromotion,
  listAdminPromotions,
  setPromotionPublished,
  updatePromotion,
  type PromotionInput,
} from '@/lib/admin/promotions'
import { uploadMedia } from '@/lib/admin/media'
import type { PromotionRow } from '@/lib/admin/types'

const EMPTY_FORM: PromotionInput = { title: '', body: '', imageUrl: '', buttonText: '', buttonUrl: '', startsAt: '', endsAt: '' }

function toLocalInput(iso: string | null): string {
  return iso ? iso.slice(0, 16) : ''
}

export function AdminPromotions() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState<PromotionRow[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PromotionInput>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const showForm = editingId !== null || params.get('nuevo') === '1'

  function reload() {
    listAdminPromotions().then(setItems).catch(() => setItems([]))
  }
  useEffect(reload, [])

  function startNew() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setParams({ nuevo: '1' })
  }

  function startEdit(p: PromotionRow) {
    setForm({
      title: p.title,
      body: p.body,
      imageUrl: p.imageUrl ?? '',
      buttonText: p.buttonText ?? '',
      buttonUrl: p.buttonUrl ?? '',
      startsAt: toLocalInput(p.startsAt),
      endsAt: toLocalInput(p.endsAt),
    })
    setEditingId(p.id)
  }

  function cancelForm() {
    setEditingId(null)
    setParams({})
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) await updatePromotion(editingId, form)
      else await createPromotion(form)
      cancelForm()
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido guardar.')
    }
  }

  async function handleImage(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadMedia(file)
      setForm((f) => ({ ...f, imageUrl: url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="admin-item-head" style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.3rem', margin: 0 }}>Promociones</h1>
        {!showForm && (
          <button type="button" className="btn btn-primary" onClick={startNew}>
            + Nueva promoción
          </button>
        )}
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Título
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Texto
            <textarea required rows={2} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </label>
          <div className="admin-form-row admin-form-row--2">
            <label>
              Texto del botón (opcional)
              <input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} />
            </label>
            <label>
              Enlace del botón (opcional)
              <input type="url" value={form.buttonUrl} onChange={(e) => setForm({ ...form, buttonUrl: e.target.value })} />
            </label>
          </div>
          <div className="admin-form-row admin-form-row--2">
            <label>
              Empieza (opcional)
              <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
            </label>
            <label>
              Termina (opcional)
              <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
            </label>
          </div>
          <label>
            Imagen (opcional)
          </label>
          <label className="btn btn-ghost" style={{ margin: 0, cursor: 'pointer', width: 'fit-content' }}>
            {uploading ? 'Subiendo…' : 'Elegir foto'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleImage(e.target.files?.[0])}
              disabled={uploading}
            />
          </label>
          {form.imageUrl && <img src={form.imageUrl} alt="" style={{ width: 100, borderRadius: 8 }} />}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button type="button" className="btn btn-ghost" onClick={cancelForm}>
              Cancelar
            </button>
          </div>
          {error && <p className="form-message form-message--error">{error}</p>}
        </form>
      )}

      {items.map((p) => (
        <div key={p.id} className="admin-item">
          <div className="admin-item-head">
            <span className="admin-item-title">{p.title}</span>
            <span className={`admin-badge ${p.published ? 'admin-badge--published' : 'admin-badge--draft'}`}>
              {p.published ? 'Publicada' : 'Borrador'}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--texto-suave)' }}>{p.body}</p>
          <div className="admin-item-actions">
            <button type="button" onClick={() => startEdit(p)}>
              Editar
            </button>
            <button type="button" onClick={() => setPromotionPublished(p.id, !p.published).then(reload)}>
              {p.published ? 'Despublicar' : 'Publicar'}
            </button>
            <button type="button" className="danger" onClick={() => deletePromotion(p.id).then(reload)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && !showForm && <p style={{ color: 'var(--texto-suave)' }}>Todavía no hay promociones.</p>}
    </div>
  )
}
