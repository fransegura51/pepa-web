import { FOTOS, type FotoSlot } from '@/config/historia'

// Imágenes reales de la historia: cualquier archivo src/assets/historia/<hueco>.(jpg|jpeg|png|webp|avif)
// sustituye al hueco reservado sin tocar nada más. Si la carpeta está vacía,
// el resultado es un objeto vacío y se ven los huecos.
const REAL_IMAGES = import.meta.glob('../assets/historia/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function imageFor(slot: FotoSlot): string | null {
  for (const [path, url] of Object.entries(REAL_IMAGES)) {
    const name = path.split('/').pop()!.replace(/\.[^.]+$/, '')
    if (name === slot) return url
  }
  return null
}

// ¿Hay ya una imagen definitiva para este hueco? Sirve para ocultar piezas enteras
// (p. ej. la foto de la abuela) mientras no exista, en vez de enseñar un marco vacío.
export function hasHistoriaImage(slot: FotoSlot): boolean {
  return imageFor(slot) !== null
}

// Marco de foto de la historia. Nunca se inventa ninguna imagen: o es la real
// o es un hueco reservado, con las mismas proporciones para que el diseño no
// cambie al sustituirla.
export function HistoriaFoto({ slot, className = '', priority = false }: { slot: FotoSlot; className?: string; priority?: boolean }) {
  const info = FOTOS[slot]
  const src = imageFor(slot)
  const style = { aspectRatio: info.ratio }
  const shape = info.round ? ' hs-photo--round' : ''

  if (src) {
    return (
      <figure className={`hs-photo${shape} ${className}`} style={style} data-slot={slot}>
        <img src={src} alt={info.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
        {info.caption && <figcaption>{info.caption}</figcaption>}
      </figure>
    )
  }

  return (
    <div className={`hs-photo hs-photo--empty${shape} ${className}`} style={style} data-slot={slot} aria-hidden="true">
      <span className="hs-photo-icon">{info.icon}</span>
      <span className="hs-photo-note">{info.placeholder}</span>
    </div>
  )
}
