// Dominio propio ya comprado y configurado (pepafamilyapp.es).
export const SITE_URL = 'https://pepafamilyapp.es'

// La app en sí sigue en GitHub Pages por ahora — app.pepafamilyapp.es
// queda reservado (ver DNS pendiente) pero no está activo todavía:
// moverla de dominio de verdad afecta a la app real en producción
// (redirect de OAuth de Google Calendar, dominio dado de alta en
// Enable Banking...), así que es un paso aparte, no automático.
export const APP_URL = 'https://fransegura51.github.io/family-app/'

// Demo pública sin registro: página de entrada propia (demo/index.html),
// por eso los botones son enlaces normales (carga completa), no <Link>.
export const DEMO_URL = '/demo/'

// Enlace "Guías" en la cabecera y el pie. Se activa (true) al publicar la
// PRIMERA guía: mientras todas sean borradores, /guias/ no existe y el
// enlace daría un 404. Hay una prueba (tests/guias) que falla si esto no
// coincide con las guías publicadas. Ver docs/GUIAS.md.
export const SHOW_GUIDES_LINK = true

export const SOCIAL_LINKS = [
  { label: 'TikTok', href: 'https://vm.tiktok.com/ZN9SCoTPw5T4b-Psl03/' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1V4aXKnrKj/' },
  { label: 'Instagram', href: 'https://www.instagram.com/pepafamily8' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Pepa-r8h' },
] as const

// TODO: sin email de contacto público todavía — no publicamos un
// correo personal sin decisión explícita. La página /contacto usa el
// formulario (misma tabla pepa_web_leads) en vez de un mailto:.
export const CONTACT_EMAIL: string | null = null
