// SEO propio de las páginas que lo necesitan.
//
// La web es 100 % renderizada en el navegador: todas las rutas comparten el
// mismo index.html (ver generate-static-routes.mjs) y el título/descripción de
// cada página se cambian después, con JavaScript. Los buscadores y las redes
// sociales que no ejecutan JavaScript solo ven el <head> de la portada.
//
// Para las páginas listadas aquí, el HTML estático de su ruta lleva ya su
// propio título, descripción, canonical, Open Graph y datos estructurados.
// El resto de rutas NO se toca. Los textos se repiten a propósito respecto a
// src/config/historia.ts (este script corre en Node sin compilar TypeScript);
// tests/site/historia.test.ts comprueba que coinciden.

export const SITE_URL = 'https://pepafamilyapp.es'

export const ROUTE_META = {
  '/historia': {
    title: 'Cómo empezó todo — La historia de PEPA, la app familiar',
    description:
      'PEPA no nació porque quisiéramos crear una app: nació porque una familia necesitaba una. Así empezó, quién inspiró su nombre y por qué queremos compartirla con otras familias.',
    schema: 'AboutPage',
  },
}

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

function replaceOnce(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`route-meta: no encuentro ${what} en index.html`)
  return html.replace(pattern, () => replacement)
}

export function applyRouteMeta(html, path) {
  const meta = ROUTE_META[path]
  if (!meta) return html
  const url = `${SITE_URL}${path}`
  const title = escapeAttr(meta.title)
  const description = escapeAttr(meta.description)

  let out = html
  out = replaceOnce(out, /<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`, '<title>')
  out = replaceOnce(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`, 'meta description')
  out = replaceOnce(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, 'canonical')
  out = replaceOnce(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`, 'og:title')
  out = replaceOnce(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${description}" />`, 'og:description')
  out = replaceOnce(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  out = replaceOnce(out, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`, 'twitter:title')
  out = replaceOnce(out, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${description}" />`, 'twitter:description')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': meta.schema,
    name: meta.title,
    description: meta.description,
    url,
    inLanguage: 'es',
    isPartOf: { '@type': 'WebSite', name: 'PEPA Family App', url: `${SITE_URL}/` },
  }
  const script = `    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`
  return replaceOnce(out, /<\/head>/, script, '</head>')
}
