import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { Funciones } from '@/pages/Funciones'
import { Paco } from '@/pages/Paco'
import { Precios } from '@/pages/Precios'
import { Preguntas } from '@/pages/Preguntas'
import { Privacidad } from '@/pages/Privacidad'
import { Condiciones } from '@/pages/Condiciones'
import { Contacto } from '@/pages/Contacto'
import { NotFound } from '@/pages/NotFound'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/funciones" element={<Funciones />} />
          <Route path="/paco" element={<Paco />} />
          <Route path="/precios" element={<Precios />} />
          <Route path="/preguntas" element={<Preguntas />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/condiciones" element={<Condiciones />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
