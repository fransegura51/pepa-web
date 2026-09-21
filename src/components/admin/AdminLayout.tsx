import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { checkIsAdmin, signOut, getSessionEmail } from '@/lib/admin/auth'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { excludeThisDeviceFromVisits } from '@/lib/visits'

const SECTIONS = [
  { to: '/admin', label: 'Inicio', end: true },
  { to: '/admin/videos', label: 'Vídeos de Paco' },
  { to: '/admin/promociones', label: 'Promociones' },
  { to: '/admin/novedades', label: 'Novedades' },
  { to: '/admin/pregunta', label: 'La pregunta de Paco' },
  { to: '/admin/textos', label: 'Textos' },
  { to: '/admin/imagenes', label: 'Imágenes' },
]

export function AdminLayout() {
  const [status, setStatus] = useState<'checking' | 'out' | 'denied' | 'in'>('checking')
  const [email, setEmail] = useState<string | null>(null)

  async function refresh() {
    setStatus('checking')
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      setStatus('out')
      return
    }
    const admin = await checkIsAdmin()
    setEmail(await getSessionEmail())
    // La administradora no se cuenta a sí misma en el contador de visitas de este navegador.
    if (admin) excludeThisDeviceFromVisits()
    setStatus(admin ? 'in' : 'denied')
  }

  useEffect(() => {
    refresh()
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh())
    return () => sub.subscription.unsubscribe()
  }, [])

  if (status === 'checking') return null

  if (status === 'out') return <AdminLogin onSignedIn={refresh} />

  if (status === 'denied') {
    return (
      <div className="admin-login-card">
        <p style={{ fontWeight: 700, color: 'var(--marino)' }}>Acceso denegado</p>
        <p style={{ color: 'var(--texto-suave)' }}>Esta cuenta no tiene permisos de administradora.</p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => signOut().then(refresh)}
        >
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <Link to="/admin">PEPA · Admin</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {email && <span style={{ fontSize: '0.82rem', opacity: 0.8 }}>{email}</span>}
          <button
            type="button"
            onClick={() => signOut().then(refresh)}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: 999, padding: '6px 12px', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="admin-body">
        <nav className="admin-nav">
          {SECTIONS.map((s) => (
            <NavLink key={s.to} to={s.to} end={s.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {s.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </div>
    </div>
  )
}
