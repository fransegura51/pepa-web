import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { PageViewTracker } from '@/components/PageViewTracker'
import { Footer } from '@/components/Footer'
import { PromoBanner } from '@/components/PromoBanner'
import { Home } from '@/pages/Home'
import { Funciones } from '@/pages/Funciones'
import { Paco } from '@/pages/Paco'
import { Historia } from '@/pages/Historia'
import { Precios } from '@/pages/Precios'
import { Preguntas } from '@/pages/Preguntas'
import { Novedades } from '@/pages/Novedades'
import { Privacidad } from '@/pages/Privacidad'
import { Condiciones } from '@/pages/Condiciones'
import { Contacto } from '@/pages/Contacto'
import { NotFound } from '@/pages/NotFound'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminHome } from '@/pages/admin/AdminHome'
import { AdminVideos } from '@/pages/admin/AdminVideos'
import { AdminPromotions } from '@/pages/admin/AdminPromotions'
import { AdminNews } from '@/pages/admin/AdminNews'
import { AdminPoll } from '@/pages/admin/AdminPoll'
import { AdminTexts } from '@/pages/admin/AdminTexts'
import { AdminImages } from '@/pages/admin/AdminImages'
import { AdminResetPassword } from '@/pages/admin/AdminResetPassword'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function PublicLayout() {
  return (
    <>
      <Header />
      <PromoBanner />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Enlace de "¿Olvidaste tu contraseña?" (AdminLogin) — Supabase vuelve
// aquí con #access_token=...&type=recovery en el hash. Se reconoce
// ANTES que las rutas normales, sin pasar por AdminLayout (que
// intentaría redirigir a /admin ya "dentro" antes de dejar elegir la
// contraseña nueva).
function isPasswordRecoveryLink(): boolean {
  return window.location.hash.includes('type=recovery')
}

export function App() {
  if (isPasswordRecoveryLink()) {
    return <AdminResetPassword />
  }
  return (
    <>
      <ScrollToTop />
      <PageViewTracker />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="promociones" element={<AdminPromotions />} />
          <Route path="novedades" element={<AdminNews />} />
          <Route path="pregunta" element={<AdminPoll />} />
          <Route path="textos" element={<AdminTexts />} />
          <Route path="imagenes" element={<AdminImages />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/funciones" element={<Funciones />} />
          <Route path="/paco" element={<Paco />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/precios" element={<Precios />} />
          <Route path="/preguntas" element={<Preguntas />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/condiciones" element={<Condiciones />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
