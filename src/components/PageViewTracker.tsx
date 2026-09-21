import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '@/lib/visits'

// Cuenta cada página que ve el visitante (también al navegar dentro de la web). No pinta nada.
export function PageViewTracker() {
  const { pathname } = useLocation()
  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])
  return null
}
