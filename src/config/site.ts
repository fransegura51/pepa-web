// Centralizado a propósito (Skill sección 9): el dominio todavía se
// compra aparte. Cuando llegue, cambiar SITE_URL aquí, `base` en
// vite.config.ts a '/', añadir public/CNAME y pathSegmentsToKeep a 0
// en public/404.html — nada más debería tocarse.
export const SITE_URL = 'https://fransegura51.github.io/pepa-web'

export const APP_URL = 'https://fransegura51.github.io/family-app/'

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
