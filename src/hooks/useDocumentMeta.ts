import { useEffect } from 'react'

// SEO por ruta sin dependencias nuevas: index.html ya trae los meta
// tags de la Home (y son el fallback para crawlers que no ejecutan JS);
// esto los actualiza en cliente para el resto de páginas.
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    const meta = document.querySelector('meta[name="description"]')
    const prevDescription = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', description)

    return () => {
      document.title = prevTitle
      meta?.setAttribute('content', prevDescription)
    }
  }, [title, description])
}
