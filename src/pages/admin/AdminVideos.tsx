import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  createVideo,
  deleteVideo,
  listAdminVideos,
  setVideoPublished,
  updateVideo,
} from '@/lib/admin/videos'
import { uploadMedia } from '@/lib/admin/media'
import type { PacoVideoRow } from '@/lib/admin/types'

const EMPTY_FORM = { title: '', description: '', videoUrl: '', thumbnailUrl: '', platform: '', featured: false }

export function AdminVideos() {
  const [params, setParams] = useSearchParams()
  const [videos, setVideos] = useState<PacoVideoRow[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const showForm = editingId !== null || params.get('nuevo') === '1'

  function reload() {
    listAdminVideos().then(setVideos).catch(() => setVideos([]))
  }

  useEffect(reload, [])

  function startNew() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setParams({ nuevo: '1' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startEdit(v: PacoVideoRow) {
    setForm({
      title: v.title,
      description: v.description ?? '',
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl ?? '',
      platform: v.platform ?? '',
      featured: v.featured,
    })
    setEditingId(v.id)
    // El formulario aparece arriba del todo — si se edita un elemento
    // más abajo en una lista larga, sin esto parece que "no pasa nada"
    // porque el formulario se abre fuera de la pantalla (bug real).
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelForm() {
    setEditingId(null)
    setParams({})
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateVideo(editingId, form)
      } else {
        await createVideo(form)
      }
      cancelForm()
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido guardar.')
    }
  }

  async function handleThumbnail(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadMedia(file)
      setForm((f) => ({ ...f, thumbnailUrl: url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="admin-item-head" style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.3rem', margin: 0 }}>Vídeos de Paco</h1>
        {!showForm && (
          <button type="button" className="btn btn-primary" onClick={startNew}>
            + Añadir vídeo
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
            Descripción (opcional)
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label>
            Enlace del vídeo (TikTok, Instagram, YouTube o Facebook)
            <input
              type="url"
              required
              placeholder="https://..."
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            />
          </label>
          <div className="admin-form-row admin-form-row--2">
            <label>
              Red social (opcional)
              <input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="TikTok" />
            </label>
            <label>
              Destacado
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                style={{ width: 20, height: 20 }}
              />
            </label>
          </div>
          <label>
            Miniatura (opcional)
          </label>
          <label className="btn btn-ghost" style={{ margin: 0, cursor: 'pointer', width: 'fit-content' }}>
            {uploading ? 'Subiendo…' : 'Elegir foto'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleThumbnail(e.target.files?.[0])}
              disabled={uploading}
            />
          </label>
          {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="" style={{ width: 100, borderRadius: 8 }} />}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              Guardar
            </button>
            <button type="button" className="btn btn-ghost" onClick={cancelForm}>
              Cancelar
            </button>
          </div>
          {error && <p className="form-message form-message--error">{error}</p>}
        </form>
      )}

      {videos.map((v) => (
        <div key={v.id} className="admin-item">
          <div className="admin-item-head">
            <span className="admin-item-title">{v.title}</span>
            <span className={`admin-badge ${v.published ? 'admin-badge--published' : 'admin-badge--draft'}`}>
              {v.published ? 'Publicado' : 'Borrador'}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--texto-suave)' }}>{v.videoUrl}</p>
          <div className="admin-item-actions">
            <button type="button" onClick={() => startEdit(v)}>
              Editar
            </button>
            <a href={v.videoUrl} target="_blank" rel="noreferrer">
              Vista previa
            </a>
            <button type="button" onClick={() => setVideoPublished(v.id, !v.published).then(reload)}>
              {v.published ? 'Despublicar' : 'Publicar'}
            </button>
            <button type="button" className="danger" onClick={() => deleteVideo(v.id).then(reload)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
      {videos.length === 0 && !showForm && <p style={{ color: 'var(--texto-suave)' }}>Todavía no hay vídeos.</p>}
    </div>
  )
}
