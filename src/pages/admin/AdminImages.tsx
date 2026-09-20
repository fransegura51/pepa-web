import { useEffect, useState } from 'react'
import { IMAGE_SLOTS } from '@/lib/admin/imageSlots'
import { getImageMap, setImage, clearImage } from '@/lib/admin/images'
import { uploadMedia } from '@/lib/admin/media'

export function AdminImages() {
  const [images, setImages] = useState<Record<string, string>>({})
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [error, setError] = useState('')

  function reload() {
    getImageMap().then(setImages).catch(() => setImages({}))
  }
  useEffect(reload, [])

  async function handleUpload(key: string, file: File | undefined) {
    if (!file) return
    setUploadingKey(key)
    setError('')
    try {
      const url = await uploadMedia(file)
      await setImage(key, url)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido subir la imagen.')
    } finally {
      setUploadingKey(null)
    }
  }

  async function handleReset(key: string) {
    await clearImage(key)
    reload()
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.3rem' }}>Imágenes</h1>
      <p style={{ color: 'var(--texto-suave)', fontSize: '0.9rem' }}>
        Sustituye las fotos de la web por capturas reales de la app. Cada foto se usa en todos los sitios donde
        aparece ese módulo (inicio, demo, etc.) — súbela una vez y se actualiza en todas partes.
      </p>

      {IMAGE_SLOTS.map((slot) => {
        const current = images[slot.key] ?? slot.fallback
        const isCustom = Boolean(images[slot.key])
        return (
          <div key={slot.key} className="admin-item">
            <div className="admin-item-head">
              <span className="admin-item-title">{slot.label}</span>
              <span className={`admin-badge ${isCustom ? 'admin-badge--published' : 'admin-badge--draft'}`}>
                {isCustom ? 'Foto subida por ti' : slot.fallback.endsWith('.svg') ? 'Ilustración de ejemplo' : 'Captura de la app (por defecto)'}
              </span>
            </div>
            <img src={current} alt={slot.fallbackAlt} style={{ width: 90, borderRadius: 10, marginTop: 8 }} />
            <div className="admin-item-actions" style={{ alignItems: 'center' }}>
              <label className="btn btn-ghost" style={{ margin: 0, cursor: 'pointer' }}>
                {uploadingKey === slot.key ? 'Subiendo…' : 'Subir foto'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleUpload(slot.key, e.target.files?.[0])}
                  disabled={uploadingKey === slot.key}
                />
              </label>
              {isCustom && (
                <button type="button" className="danger" onClick={() => handleReset(slot.key)}>
                  Volver a la imagen por defecto
                </button>
              )}
            </div>
          </div>
        )
      })}
      {error && <p className="form-message form-message--error">{error}</p>}
    </div>
  )
}
