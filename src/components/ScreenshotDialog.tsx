import { useEffect, useRef } from 'react'

// Visor grande de una captura: <dialog> nativo (foco atrapado, Esc cierra y
// el foco vuelve al botón que lo abrió). En escritorio la captura completa
// cabe en pantalla; en móvil ocupa todo el ancho y, si es más larga que la
// pantalla, se desplaza dentro del visor.
export function ScreenshotDialog({ open, src, alt, title, onClose }: { open: boolean; src: string; alt: string; title: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Sin scroll de fondo mientras el visor está abierto.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className="hm-dialog"
      aria-label={`Captura de ${title}`}
      onClose={onClose}
      onKeyDown={(e) => {
        // Esc ya cierra el <dialog> por sí solo; esto lo asegura en navegadores que no lo hacen.
        if (e.key === 'Escape') ref.current?.close()
      }}
    >
      <div
        className="hm-dialog-scroll"
        onClick={(e) => {
          // Un clic fuera de la imagen (en el fondo) también cierra.
          if (e.target === e.currentTarget) ref.current?.close()
        }}
      >
        <button type="button" className="hm-dialog-close" onClick={() => ref.current?.close()}>
          <span aria-hidden="true">✕</span> Cerrar
        </button>
        {open && <img className="hm-dialog-img" src={src} alt={alt} width={750} height={1624} decoding="async" />}
      </div>
    </dialog>
  )
}
