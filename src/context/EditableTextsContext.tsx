import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getAllTexts } from '@/lib/admin/texts'

const EditableTextsContext = createContext<Record<string, string>>({})

// Una sola consulta para toda la web en vez de una por texto — el
// panel /admin puede cambiar el titular del hero, el CTA, etc. sin
// tocar código; si una clave no existe todavía en la tabla, cada
// useText() sigue mostrando su valor de siempre (fallback).
export function EditableTextsProvider({ children }: { children: ReactNode }) {
  const [texts, setTexts] = useState<Record<string, string>>({})

  useEffect(() => {
    getAllTexts()
      .then(setTexts)
      .catch(() => {})
  }, [])

  return <EditableTextsContext.Provider value={texts}>{children}</EditableTextsContext.Provider>
}

export function useText(key: string, fallback: string): string {
  const texts = useContext(EditableTextsContext)
  return texts[key] ?? fallback
}
