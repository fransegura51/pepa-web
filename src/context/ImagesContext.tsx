import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getImageMap } from '@/lib/admin/images'
import { IMAGE_SLOTS } from '@/lib/admin/imageSlots'

const ImagesContext = createContext<Record<string, string>>({})

// Una sola consulta para toda la web (igual que EditableTextsContext) —
// si una clave no se ha sustituido todavía desde /admin, se usa la
// ilustración de ejemplo de siempre.
export function ImagesProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<Record<string, string>>({})

  useEffect(() => {
    getImageMap()
      .then(setImages)
      .catch(() => {})
  }, [])

  return <ImagesContext.Provider value={images}>{children}</ImagesContext.Provider>
}

export function useModuleImage(key: string): string {
  const images = useContext(ImagesContext)
  const slot = IMAGE_SLOTS.find((s) => s.key === key)
  return images[key] ?? slot?.fallback ?? ''
}

// Devuelve TODOS los slots ya resueltos (real o respaldo) de una vez —
// para listas/carruseles, evita llamar a un hook dentro de un bucle.
export function useModuleImages(): { key: string; src: string; alt: string }[] {
  const images = useContext(ImagesContext)
  return useMemo(
    () => IMAGE_SLOTS.map((slot) => ({ key: slot.key, src: images[slot.key] ?? slot.fallback, alt: slot.fallbackAlt })),
    [images],
  )
}
