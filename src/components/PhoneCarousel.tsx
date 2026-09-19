import { useEffect, useState } from 'react'

export interface CarouselImage {
  src: string
  alt: string
}

// Carrusel simple para el mockup de móvil: va cambiando de foto sola
// cada pocos segundos. Con "prefers-reduced-motion" se queda fija en
// la primera, sin animación automática.
export function PhoneCarousel({ images, intervalMs = 3500 }: { images: CarouselImage[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs)
    return () => clearInterval(id)
  }, [images.length, intervalMs])

  return (
    <div className="phone-carousel">
      {images.map((img, i) => (
        <img key={img.src} src={img.src} alt={img.alt} className={i === index ? 'is-active' : ''} loading={i === 0 ? 'eager' : 'lazy'} />
      ))}
      {images.length > 1 && (
        <div className="phone-carousel-dots" aria-hidden="true">
          {images.map((img, i) => (
            <span key={img.src} className={i === index ? 'is-active' : ''} />
          ))}
        </div>
      )}
    </div>
  )
}
