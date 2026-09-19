import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createNews, deleteNews, listAdminNews, setNewsPublished, updateNews, type NewsInput } from '@/lib/admin/news'
import { uploadMedia } from '@/lib/admin/media'
import type { NewsRow } from '@/lib/admin/types'

const EMPTY_FORM: NewsInput = { title: '', description: '', imageUrl: '', linkUrl: '', publishedAt: '' }

export function AdminNews() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState<NewsRow[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<NewsInput>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const showForm = editingId !== null || params.get('nuevo') === '1'

  function reload() {
    listAdminNews().then(setItems).catch(() => setItems([]))
  }
  useEffect(reload, [])

  function startNew() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setParams({ nuevo: '1' })
  }

  function startEdit(n: NewsRow) {
    setForm({
      title: n.title,
      description: n.description,
      imageUrl: n.imageUrl ?? '',
      linkUrl: n.linkUrl ?? '',
      publishedAt: n.publishedAt ?? '',
    })
    setEditingId(n.id)
  }

  function cancelForm() {
    setEditingId(null)
    setParams({})
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) await updateNews(editingId, form)
      else await createNews(form)
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
        <h1 style={{ fontSize: '1.3rem', margin: 0 }}>Novedades</h1>
        {!showForm && (
          <button type="button" className="btn btn-primary" onClick={startNew}>
            + Nueva novedad
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
            Descripción
            <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="admin-form-row admin-form-row--2">
            <label>
              Fecha (opcional)
              <input type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
            </label>
            <label>
              Enlace (opcional)
              <input type="url" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
            </label>
          </div>
          <label>
            Imagen/captura (opcional)
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

      {items.map((n) => (
        <div key={n.id} className="admin-item">
          <div className="admin-item-head">
            <span className="admin-item-title">{n.title}</span>
            <span className={`admin-badge ${n.published ? 'admin-badge--published' : 'admin-badge--draft'}`}>
              {n.published ? 'Publicada' : 'Borrador'}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--texto-suave)' }}>{n.description}</p>
          <div className="admin-item-actions">
            <button type="button" onClick={() => startEdit(n)}>
              Editar
            </button>
            <button type="button" onClick={() => setNewsPublished(n.id, !n.published).then(reload)}>
              {n.published ? 'Despublicar' : 'Publicar'}
            </button>
            <button type="button" className="danger" onClick={() => deleteNews(n.id).then(reload)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && !showForm && <p style={{ color: 'var(--texto-suave)' }}>Todavía no hay novedades.</p>}
    </div>
  )
}
