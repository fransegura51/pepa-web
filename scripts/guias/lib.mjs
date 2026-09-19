// Sistema de guías (SEO): lee content/guias/*.md, las valida y genera
// páginas HTML completas (con el texto ya escrito en el HTML, sin
// depender de JavaScript), el índice /guias/, el sitemap y el RSS.
//
// Todo son funciones puras que devuelven texto: scripts/guias/build.mjs
// solo lee y escribe archivos, y tests/guias/ prueba estas funciones sin
// tocar el disco. Las guías NO son parte de la app React: son páginas
// estáticas propias (como la demo), así que el resto de la web no cambia.

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { Marked } from 'marked'

export const SITE_URL = 'https://pepafamilyapp.es'
export const SITE_NAME = 'PEPA Family App'
export const DEFAULT_OG_IMAGE = '/og/pepa-guias.png'

// Zonas de la demo a las que puede llevar una guía (mismas que las
// pestañas de src/demo/state.ts; hay una prueba que lo comprueba).
export const DEMO_ZONES = {
  inicio: 'Inicio',
  calendario: 'Calendario',
  compras: 'Compras',
  economia: 'Economía',
  cocina: 'Cocina',
  cumpleanos: 'Cumpleaños',
}

// Módulos de PEPA que una guía puede citar como relacionados.
export const MODULES = {
  calendario: 'Calendario',
  compras: 'Compras',
  economia: 'Economía',
  cocina: 'Cocina',
  eventos: 'Eventos',
  documentos: 'Documentos',
  tareas: 'Tareas y puntos',
}

const INTENTS = ['informacional', 'comparativa', 'transaccional', 'navegacional']
const STATES = ['borrador', 'publicado']
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
export const MIN_WORDS = 300

// ---------------------------------------------------------------- utilidades

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// JSON dentro de <script>: evita que un "</script>" en el texto cierre la etiqueta.
export function jsonLdScript(data) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  return `<script type="application/ld+json">${json}</script>`
}

export function countWords(markdown) {
  return markdown
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

export function formatDateEs(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)))
}

function rfc822(iso) {
  return new Date(`${iso}T09:00:00Z`).toUTCString()
}

export function guideUrl(slug) {
  return `${SITE_URL}/guias/${slug}/`
}

export function demoHref(zone, slug) {
  return `/demo/?zona=${encodeURIComponent(zone)}&desde=${encodeURIComponent(slug)}`
}

// ---------------------------------------------------------------- frontmatter

// Subconjunto sencillo de YAML (sin dependencias): "clave: valor",
// listas con "- item" o "[a, b]", y true/false. Suficiente para el
// frontmatter de las guías y fácil de leer para quien redacta.
export function parseFrontmatter(text) {
  const normalized = text.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) throw new Error('Falta el bloque de campos (frontmatter) entre líneas "---" al principio del archivo.')
  const data = {}
  let currentList = null
  for (const rawLine of match[1].split('\n')) {
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue
    const item = rawLine.match(/^\s+-\s+(.*)$/)
    if (item && currentList) {
      if (!Array.isArray(data[currentList])) data[currentList] = []
      data[currentList].push(unquote(item[1].trim()))
      continue
    }
    const kv = rawLine.match(/^([a-z_]+):\s*(.*)$/)
    if (!kv) throw new Error(`Línea no válida en los campos: "${rawLine}"`)
    const [, key, value] = kv
    currentList = null
    const v = value.trim()
    if (v === '') {
      // Vacío: texto vacío, salvo que debajo vengan líneas "- item" (entonces es una lista).
      data[key] = ''
      currentList = key
    } else if (v.startsWith('[') && v.endsWith(']')) {
      data[key] = v
        .slice(1, -1)
        .split(',')
        .map((s) => unquote(s.trim()))
        .filter(Boolean)
    } else if (v === 'true' || v === 'false') {
      data[key] = v === 'true'
    } else {
      data[key] = unquote(v)
    }
  }
  return { data, body: match[2].trim() }
}

function unquote(value) {
  if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
    return value.slice(1, -1)
  }
  return value
}

// ---------------------------------------------------------------- carga y validación

export function loadGuides(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort()
    .map((file) => {
      const { data, body } = parseFrontmatter(readFileSync(join(dir, file), 'utf8'))
      return { file, ...data, body }
    })
}

function isRealDate(iso) {
  if (!DATE_RE.test(iso)) return false
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
}

// Devuelve la lista de errores (vacía si todo está bien). "today" es
// ISO (AAAA-MM-DD) y se inyecta para poder probar con fechas fijas.
export function validateGuides(guides, today) {
  const errors = []
  const slugs = new Set()
  const bySlug = new Map(guides.map((g) => [g.slug, g]))

  for (const g of guides) {
    const at = (msg) => errors.push(`${g.file}: ${msg}`)

    if (typeof g.titulo !== 'string' || g.titulo.length < 10 || g.titulo.length > 70) at('"titulo" obligatorio, entre 10 y 70 caracteres.')
    if (typeof g.slug !== 'string' || !SLUG_RE.test(g.slug) || g.slug.length > 60) at('"slug" obligatorio: minúsculas, números y guiones (máx. 60).')
    else {
      if (`${g.slug}.md` !== g.file) at(`el "slug" (${g.slug}) debe coincidir con el nombre del archivo (${g.file}).`)
      if (slugs.has(g.slug)) at(`"slug" repetido: ${g.slug}.`)
      slugs.add(g.slug)
    }
    if (typeof g.resumen !== 'string' || g.resumen.length < 60 || g.resumen.length > 300) at('"resumen" obligatorio, entre 60 y 300 caracteres.')
    if (typeof g.descripcion !== 'string' || g.descripcion.length < 70 || g.descripcion.length > 160)
      at('"descripcion" (metadescripción) obligatoria, entre 70 y 160 caracteres.')
    if (typeof g.autor !== 'string' || !g.autor.trim()) at('"autor" obligatorio (p. ej. "Equipo PEPA").')
    if (typeof g.tema !== 'string' || !g.tema.trim()) at('"tema" obligatorio.')
    if (!INTENTS.includes(g.intencion)) at(`"intencion" debe ser una de: ${INTENTS.join(', ')}.`)
    if (!STATES.includes(g.estado)) at('"estado" debe ser "borrador" o "publicado".')
    if (!Object.hasOwn(DEMO_ZONES, g.demo)) at(`"demo" debe ser una zona de la demo: ${Object.keys(DEMO_ZONES).join(', ')}.`)
    if (g.imagen && (typeof g.imagen !== 'string' || !g.imagen.startsWith('/'))) at('"imagen" debe ser una ruta que empiece por "/" (p. ej. /og/mi-imagen.png).')

    const modulos = Array.isArray(g.modulos) ? g.modulos : []
    if (modulos.length === 0) at('"modulos" obligatorio: al menos un módulo de PEPA relacionado.')
    for (const m of modulos) if (!Object.hasOwn(MODULES, m)) at(`módulo desconocido "${m}". Válidos: ${Object.keys(MODULES).join(', ')}.`)

    const related = Array.isArray(g.relacionadas) ? g.relacionadas : []
    for (const r of related) {
      if (r === g.slug) at('"relacionadas" no puede incluir la propia guía.')
      else if (!bySlug.has(r)) at(`"relacionadas" apunta a una guía que no existe: ${r}.`)
    }

    const words = countWords(g.body ?? '')
    if (words < MIN_WORDS) at(`el texto tiene ${words} palabras; mínimo ${MIN_WORDS} (sin relleno, pero con contenido de verdad).`)
    if (/^# /m.test(g.body ?? '')) at('el texto no debe tener un título de nivel 1 ("# "): el título sale de "titulo". Usa "## " para los apartados.')
    for (const m of (g.body ?? '').matchAll(/\]\((\/[^)\s]*)\)/g)) {
      const href = m[1]
      const guideMatch = href.match(/^\/guias\/([^/#?]+)\/?(?:[#?].*)?$/)
      if (guideMatch && guideMatch[1] !== 'rss.xml' && !bySlug.has(guideMatch[1])) at(`enlace roto a una guía que no existe: ${href}`)
    }

    if (g.estado === 'publicado') {
      if (!isRealDate(g.publicado ?? '')) at('para publicar hace falta "publicado" con una fecha real (AAAA-MM-DD).')
      else if (g.publicado > today) at(`"publicado" (${g.publicado}) está en el futuro.`)
      if (g.actualizado) {
        if (!isRealDate(g.actualizado)) at('"actualizado" debe ser una fecha real (AAAA-MM-DD).')
        else if (g.actualizado > today) at(`"actualizado" (${g.actualizado}) está en el futuro.`)
        else if (isRealDate(g.publicado ?? '') && g.actualizado < g.publicado) at('"actualizado" no puede ser anterior a "publicado".')
      }
      if (typeof g.revisado_por !== 'string' || !g.revisado_por.trim()) at('para publicar hace falta "revisado_por": una persona debe revisar la guía.')
      if (!isRealDate(g.revisado_fecha ?? '')) at('para publicar hace falta "revisado_fecha" con una fecha real (AAAA-MM-DD).')
      if (/\b(TODO|LOREM|XXX)\b|\[\[/i.test(g.body ?? '')) at('el texto todavía contiene marcas de trabajo pendiente (TODO, XXX, [[...]]).')
      // Una guía "relacionada" que aún es borrador no es un error: al
      // publicar, ese enlace simplemente no aparece (ver linkableRelated).
    }
  }
  return errors
}

// ---------------------------------------------------------------- Markdown

const markdown = new Marked({ gfm: true, breaks: false })
markdown.use({
  renderer: {
    // Nada de HTML en crudo dentro de las guías: se muestra como texto.
    html(token) {
      return escapeHtml(typeof token === 'string' ? token : token.text)
    },
  },
})

export function renderBody(body) {
  return markdown.parse(body)
}

// ---------------------------------------------------------------- páginas

// Rendimiento (desplazamiento de diseño): la fuente del TEXTO se pide con
// font-display=optional (si no llega a tiempo, se queda la del sistema y
// nada salta); los títulos y la letra manuscrita mantienen swap. Recibe los
// <link> de Google Fonts del index.html de la web y devuelve los ajustados.
export function tuneFontLinks(links) {
  return links.flatMap((link) => {
    if (!link.includes('fonts.googleapis.com/css2') || !link.includes('Plus+Jakarta+Sans')) return [link]
    const heads = link.replace(/family=Plus\+Jakarta\+Sans[^&"]*&/, '')
    const body = link.replace(/href="[^"]*"/, 'href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=optional"')
    return [heads, body]
  })
}

const STYLE_HREF = '/guias.css'

function head({ title, description, canonical, robots, ogType, image, extra = '', ctx }) {
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#12A594" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta name="robots" content="${robots}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="alternate" type="application/rss+xml" title="Guías de PEPA" href="/guias/rss.xml" />

    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
${extra}
${(ctx.fontLinks ?? []).map((l) => `    ${l}`).join('\n')}
${(ctx.cssLinks ?? []).map((l) => `    ${l}`).join('\n')}
    <link rel="stylesheet" href="${STYLE_HREF}" />
  </head>`
}

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/funciones', label: 'Funciones' },
  { href: '/guias/', label: 'Guías' },
  { href: '/precios', label: 'Precios' },
  { href: '/preguntas', label: 'Preguntas' },
]

function siteHeader() {
  const links = NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')
  const mobile = NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')
  return `<header class="site-header">
      <div class="container">
        <a href="/" class="brand"><span class="brand-mark" aria-hidden="true">🏠</span>PEPA <span class="g-brand-sub">Family App</span></a>
        <nav class="main-nav" aria-label="Principal">${links}</nav>
        <div class="header-actions">
          <a href="/demo/" class="btn btn-primary" rel="nofollow">Probar PEPA ahora</a>
          <details class="g-menu">
            <summary aria-label="Abrir menú">☰</summary>
            <nav class="g-menu-list" aria-label="Menú móvil">${mobile}</nav>
          </details>
        </div>
      </div>
    </header>`
}

function siteFooter() {
  return `<footer class="site-footer section--marino">
      <div class="container">
        <div class="footer-top">
          <div class="footer-col">
            <a href="/" class="g-footer-brand">PEPA Family App</a>
            <p class="g-footer-tag">Tu familia. Tu tiempo. Tu PEPA. 💚</p>
          </div>
          <div class="footer-col">
            <p class="g-footer-h">PEPA</p>
            <a href="/funciones">Funciones</a>
            <a href="/guias/">Guías</a>
            <a href="/precios">Precios</a>
            <a href="/preguntas">Preguntas</a>
          </div>
          <div class="footer-col">
            <p class="g-footer-h">Legal</p>
            <a href="/privacidad">Privacidad</a>
            <a href="/condiciones">Condiciones</a>
          </div>
          <div class="footer-col">
            <p class="g-footer-h">Contacto</p>
            <a href="/contacto">Escríbenos</a>
          </div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${SITE_NAME}. Hecha para familias reales.</span></div>
      </div>
    </footer>`
}

function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function crumbsHtml(items) {
  return `<nav class="g-crumbs" aria-label="Migas de pan"><ol>${items
    .map((item, i) => (i === items.length - 1 ? `<li aria-current="page">${escapeHtml(item.name)}</li>` : `<li><a href="${item.href}">${escapeHtml(item.name)}</a></li>`))
    .join('')}</ol></nav>`
}

function articleLd(g, image) {
  const isTeam = /^equipo/i.test(g.autor)
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.titulo,
    description: g.descripcion,
    inLanguage: 'es-ES',
    mainEntityOfPage: { '@type': 'WebPage', '@id': guideUrl(g.slug) },
    image: [image.startsWith('http') ? image : `${SITE_URL}${image}`],
    author: isTeam ? { '@type': 'Organization', name: g.autor, url: SITE_URL } : { '@type': 'Person', name: g.autor },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/apple-touch-icon.png` },
    },
    articleSection: g.tema,
  }
  if (g.publicado) ld.datePublished = g.publicado
  if (g.actualizado || g.publicado) ld.dateModified = g.actualizado || g.publicado
  return ld
}

// Guías relacionadas que se pueden enlazar: solo publicadas (en modo
// borradores también las borradores, para poder revisarlas juntas).
function linkableRelated(g, all, includeDrafts) {
  return (g.relacionadas ?? []).map((slug) => all.find((x) => x.slug === slug)).filter((x) => x && (includeDrafts || x.estado === 'publicado'))
}

export function renderGuidePage(g, all, ctx = {}, { includeDrafts = false } = {}) {
  const isDraft = g.estado !== 'publicado'
  const image = g.imagen || DEFAULT_OG_IMAGE
  const canonical = guideUrl(g.slug)
  const title = `${g.titulo} | ${SITE_NAME}`
  const crumbs = [
    { name: 'Inicio', href: '/', url: `${SITE_URL}/` },
    { name: 'Guías', href: '/guias/', url: `${SITE_URL}/guias/` },
    { name: g.titulo, href: `/guias/${g.slug}/`, url: canonical },
  ]
  const related = linkableRelated(g, all, includeDrafts)
  const modules = (g.modulos ?? []).map((m) => `<li><a href="/funciones">${escapeHtml(MODULES[m])}</a></li>`).join('')
  const devNote =
    Array.isArray(g.en_desarrollo) && g.en_desarrollo.length > 0
      ? `<aside class="g-notice" role="note"><strong>En desarrollo:</strong> ${g.en_desarrollo.map(escapeHtml).join('; ')}. Todavía no está disponible en PEPA.</aside>`
      : ''
  const zoneName = DEMO_ZONES[g.demo]
  const dates = g.publicado
    ? `<p class="g-meta">Por ${escapeHtml(g.autor)} · Publicado el <time datetime="${g.publicado}">${formatDateEs(g.publicado)}</time>${
        g.actualizado && g.actualizado !== g.publicado ? ` · Actualizado el <time datetime="${g.actualizado}">${formatDateEs(g.actualizado)}</time>` : ''
      }${g.revisado_por ? ` · Revisado por ${escapeHtml(g.revisado_por)}${g.revisado_fecha ? ` el ${formatDateEs(g.revisado_fecha)}` : ''}` : ''}</p>`
    : `<p class="g-meta">Por ${escapeHtml(g.autor)}</p>`

  const extra = [jsonLdScript(articleLd(g, image)), jsonLdScript(breadcrumbLd(crumbs))].map((s) => `    ${s}`).join('\n')

  return `${head({
    title,
    description: g.descripcion,
    canonical,
    robots: isDraft ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    ogType: 'article',
    image,
    extra: `${extra}${g.publicado ? `\n    <meta property="article:published_time" content="${g.publicado}" />\n    <meta property="article:modified_time" content="${g.actualizado || g.publicado}" />` : ''}`,
    ctx,
  })}
  <body>
    ${siteHeader()}
    ${isDraft ? '<div class="g-draft-banner" role="note"><strong>BORRADOR</strong> — esta guía no está publicada; solo se ve en local para revisarla.</div>' : ''}
    <main>
      <article class="g-article container">
        ${crumbsHtml(crumbs)}
        <h1>${escapeHtml(g.titulo)}</h1>
        ${dates}
        <p class="g-lead">${escapeHtml(g.resumen)}</p>
        ${devNote}
        <div class="g-body">
${renderBody(g.body)}
        </div>
        <aside class="g-cta" aria-labelledby="g-cta-title">
          <h2 id="g-cta-title">Míralo funcionando</h2>
          <p>Prueba en la demo cómo queda esto en PEPA, con una familia de ejemplo. Sin registro y sin guardar nada.</p>
          <a class="btn btn-primary" href="${escapeHtml(demoHref(g.demo, g.slug))}" rel="nofollow">Ver el ejemplo de ${escapeHtml(zoneName)}</a>
        </aside>
        <section class="g-modules" aria-labelledby="g-modules-title">
          <h2 id="g-modules-title">Módulos de PEPA relacionados</h2>
          <ul>${modules}</ul>
        </section>
${
  related.length > 0
    ? `        <section class="g-related" aria-labelledby="g-related-title">
          <h2 id="g-related-title">Guías relacionadas</h2>
          <ul>${related.map((r) => `<li><a href="/guias/${r.slug}/">${escapeHtml(r.titulo)}</a></li>`).join('')}</ul>
        </section>`
    : ''
}
        <p class="g-back"><a href="/guias/">← Todas las guías</a></p>
      </article>
    </main>
    ${siteFooter()}
  </body>
</html>
`
}

export function renderIndexPage(guides, ctx = {}, { includeDrafts = false } = {}) {
  // Publicadas primero (la más reciente arriba); después los borradores, por título.
  const list = guides
    .filter((g) => includeDrafts || g.estado === 'publicado')
    .sort((a, b) => {
      const pa = a.estado === 'publicado'
      const pb = b.estado === 'publicado'
      if (pa !== pb) return pa ? -1 : 1
      if (pa) return (b.publicado > a.publicado ? 1 : b.publicado < a.publicado ? -1 : 0) || a.titulo.localeCompare(b.titulo, 'es')
      return a.titulo.localeCompare(b.titulo, 'es')
    })
  const crumbs = [
    { name: 'Inicio', href: '/', url: `${SITE_URL}/` },
    { name: 'Guías', href: '/guias/', url: `${SITE_URL}/guias/` },
  ]
  const title = `Guías para organizar tu familia | ${SITE_NAME}`
  const description = 'Guías prácticas y sin relleno para organizar el calendario, las tareas, las compras y el presupuesto de tu familia.'
  const cards = list
    .map(
      (g) => `<li class="g-card">
          <h2><a href="/guias/${g.slug}/">${escapeHtml(g.titulo)}</a>${g.estado === 'publicado' ? '' : ' <span class="g-tag">Borrador</span>'}</h2>
          <p>${escapeHtml(g.resumen)}</p>
          <p class="g-card-meta">${escapeHtml(g.tema)}${g.publicado ? ` · <time datetime="${g.publicado}">${formatDateEs(g.publicado)}</time>` : ''}</p>
        </li>`,
    )
    .join('\n        ')

  return `${head({
    title,
    description,
    canonical: `${SITE_URL}/guias/`,
    robots: includeDrafts && list.some((g) => g.estado !== 'publicado') ? 'noindex, nofollow' : 'index, follow',
    ogType: 'website',
    image: DEFAULT_OG_IMAGE,
    extra: `    ${jsonLdScript(breadcrumbLd(crumbs))}`,
    ctx,
  })}
  <body>
    ${siteHeader()}
    <main>
      <div class="g-article container">
        ${crumbsHtml(crumbs)}
        <h1>Guías para organizar tu familia</h1>
        <p class="g-lead">Ideas y plantillas que puedes aplicar hoy, con o sin PEPA.</p>
        <ul class="g-cards">
        ${cards}
        </ul>
        <p class="g-back"><a href="/guias/rss.xml">Suscribirse por RSS</a></p>
      </div>
    </main>
    ${siteFooter()}
  </body>
</html>
`
}

// ---------------------------------------------------------------- sitemap y RSS

// Añade las guías publicadas al sitemap existente (las páginas fijas de
// la web se mantienen tal cual). Los borradores nunca entran.
export function buildSitemap(staticSitemapXml, guides) {
  const published = guides.filter((g) => g.estado === 'publicado')
  if (published.length === 0) return staticSitemapXml
  const lastmodOf = (g) => g.actualizado || g.publicado
  const newest = published.map(lastmodOf).sort().at(-1)
  const entries = [
    `  <url><loc>${SITE_URL}/guias/</loc><lastmod>${newest}</lastmod></url>`,
    ...published.map((g) => `  <url><loc>${guideUrl(g.slug)}</loc><lastmod>${lastmodOf(g)}</lastmod></url>`),
  ]
  const cleaned = staticSitemapXml.replace(/\s*<url><loc>[^<]*\/guias\/[^<]*<\/loc>[^]*?<\/url>/g, '')
  return cleaned.replace('</urlset>', `${entries.join('\n')}\n</urlset>`)
}

export function buildRss(guides) {
  const published = guides
    .filter((g) => g.estado === 'publicado')
    .sort((a, b) => (b.publicado > a.publicado ? 1 : b.publicado < a.publicado ? -1 : 0))
  const items = published
    .map(
      (g) => `    <item>
      <title>${escapeHtml(g.titulo)}</title>
      <link>${guideUrl(g.slug)}</link>
      <guid isPermaLink="true">${guideUrl(g.slug)}</guid>
      <pubDate>${rfc822(g.publicado)}</pubDate>
      <description>${escapeHtml(g.resumen)}</description>
    </item>`,
    )
    .join('\n')
  const last = published.length ? rfc822(published.map((g) => g.actualizado || g.publicado).sort().at(-1)) : rfc822('2026-01-01')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Guías de ${SITE_NAME}</title>
    <link>${SITE_URL}/guias/</link>
    <description>Guías prácticas para organizar tu familia.</description>
    <language>es-es</language>
    <lastBuildDate>${last}</lastBuildDate>
    <atom:link href="${SITE_URL}/guias/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

// ---------------------------------------------------------------- orquestación

// Devuelve { files: { "ruta/relativa/a/dist": contenido }, published }.
// - Producción (includeDrafts=false): solo guías publicadas. Si no hay
//   ninguna, no se genera NADA (ni /guias/, ni RSS, ni sitemap nuevo).
// - Revisión local (includeDrafts=true): añade también las páginas de los
//   borradores (noindex) sin tocar sitemap ni RSS.
export function generateSite({ guides, staticSitemapXml, ctx, includeDrafts = false }) {
  const files = {}
  const published = guides.filter((g) => g.estado === 'publicado')
  const visible = guides.filter((g) => includeDrafts || g.estado === 'publicado')

  if (visible.length > 0) {
    files['guias/index.html'] = renderIndexPage(guides, ctx, { includeDrafts })
    for (const g of visible) files[`guias/${g.slug}/index.html`] = renderGuidePage(g, guides, ctx, { includeDrafts })
  }
  if (published.length > 0) {
    files['guias/rss.xml'] = buildRss(guides)
    files['sitemap.xml'] = buildSitemap(staticSitemapXml, guides)
  }
  return { files, published: published.length }
}
