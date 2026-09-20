import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  DEMO_ZONES,
  SITE_URL,
  buildRss,
  buildSitemap,
  demoHref,
  generateSite,
  loadGuides,
  parseFrontmatter,
  renderGuidePage,
  renderIndexPage,
  tuneFontLinks,
  validateGuides,
} from '../../scripts/guias/lib.mjs'
import { parseDemoEntry } from '../../src/demo/entry'
import { DEMO_TABS } from '../../src/demo/state'

const ROOT = resolve(__dirname, '../..')
const TODAY = '2026-09-19'
const CTX = { cssLinks: ['<link rel="stylesheet" href="/assets/global-x.css">'], fontLinks: [] }
const STATIC_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://pepafamilyapp.es/</loc></url>
  <url><loc>https://pepafamilyapp.es/funciones</loc></url>
</urlset>`

const BODY = Array.from({ length: 60 }, (_, i) => `Frase número ${i} con palabras suficientes para el texto.`).join(' ')

function mk(overrides: Record<string, unknown> = {}) {
  const slug = (overrides.slug as string) ?? 'guia-de-prueba'
  return {
    file: `${slug}.md`,
    titulo: 'Una guía de prueba para los tests',
    slug,
    resumen: 'Resumen de prueba suficientemente largo para pasar la validación de longitud mínima.',
    descripcion: 'Metadescripción de prueba con la longitud necesaria para que la validación de SEO no proteste por ser corta.',
    autor: 'Equipo PEPA',
    tema: 'Pruebas',
    intencion: 'informacional',
    estado: 'borrador',
    modulos: ['calendario'],
    demo: 'calendario',
    body: BODY,
    ...overrides,
  }
}

function published(overrides: Record<string, unknown> = {}) {
  return mk({ estado: 'publicado', publicado: '2026-09-10', actualizado: '2026-09-12', revisado_por: 'Ana Revisora', revisado_fecha: '2026-09-09', ...overrides })
}

describe('frontmatter', () => {
  it('lee textos, listas, listas en línea, booleanos y comillas', () => {
    const { data, body } = parseFrontmatter('---\ntitulo: "Hola: mundo"\nprincipal: true\nmodulos: [calendario, compras]\nrelacionadas:\n  - a\n  - b\nvacio:\n---\nTexto\n')
    expect(data).toEqual({ titulo: 'Hola: mundo', principal: true, modulos: ['calendario', 'compras'], relacionadas: ['a', 'b'], vacio: '' })
    expect(body).toBe('Texto')
  })

  it('un campo vacío es texto vacío, no una lista', () => {
    expect(parseFrontmatter('---\npublicado:\n---\nx').data.publicado).toBe('')
  })

  it('falla con un mensaje claro si falta el bloque o hay líneas raras', () => {
    expect(() => parseFrontmatter('sin campos')).toThrow(/frontmatter/)
    expect(() => parseFrontmatter('---\nesto no vale\n---\nx')).toThrow(/no válida/)
  })
})

describe('validación', () => {
  it('una guía correcta no da errores', () => {
    expect(validateGuides([mk(), published({ slug: 'otra-guia', titulo: 'Otra guía de prueba distinta' })], TODAY)).toEqual([])
  })

  const cases: [string, Record<string, unknown>, RegExp][] = [
    ['título corto', { titulo: 'Corto' }, /titulo/],
    ['slug con mayúsculas', { slug: 'Guia_Mala', file: 'Guia_Mala.md' }, /slug/],
    ['slug distinto del archivo', { file: 'otro.md' }, /coincidir/],
    ['metadescripción corta', { descripcion: 'corta' }, /descripcion/],
    ['intención desconocida', { intencion: 'rara' }, /intencion/],
    ['estado desconocido', { estado: 'pendiente' }, /estado/],
    ['zona de demo inexistente', { demo: 'ubicacion' }, /demo/],
    ['módulo desconocido', { modulos: ['nave-espacial'] }, /módulo desconocido/],
    ['sin módulos', { modulos: [] }, /modulos/],
    ['texto demasiado corto', { body: 'poco texto' }, /palabras/],
    ['título de nivel 1 en el texto', { body: `# Otro título\n\n${BODY}` }, /nivel 1/],
    ['enlace roto a otra guía', { body: `${BODY} [x](/guias/no-existe/)` }, /enlace roto/],
    ['relacionada inexistente', { relacionadas: ['fantasma'] }, /no existe/],
    ['relacionada consigo misma', { relacionadas: ['guia-de-prueba'] }, /propia guía/],
  ]
  for (const [name, overrides, re] of cases) {
    it(`rechaza: ${name}`, () => {
      expect(validateGuides([mk(overrides)], TODAY).join('\n')).toMatch(re)
    })
  }

  const publishCases: [string, Record<string, unknown>, RegExp][] = [
    ['sin revisor', { revisado_por: '' }, /revisado_por/],
    ['sin fecha de revisión', { revisado_fecha: '' }, /revisado_fecha/],
    ['sin fecha de publicación', { publicado: '' }, /publicado/],
    ['fecha de publicación inexistente', { publicado: '2026-02-31' }, /publicado/],
    ['publicada en el futuro', { publicado: '2030-01-01', actualizado: '' }, /futuro/],
    ['actualizada antes de publicarse', { actualizado: '2026-09-01' }, /anterior/],
    ['con marcas de trabajo pendiente', { body: `${BODY} TODO revisar esto` }, /pendiente/],
  ]
  for (const [name, overrides, re] of publishCases) {
    it(`no deja publicar: ${name}`, () => {
      expect(validateGuides([published(overrides)], TODAY).join('\n')).toMatch(re)
    })
  }

  it('la palabra española "todo" no se confunde con una marca TODO', () => {
    expect(validateGuides([published({ body: `${BODY} Todo el equipo lo hace todo junto, y todos lo ven.` })], TODAY)).toEqual([])
  })

  it('un borrador puede no tener fechas ni revisor', () => {
    expect(validateGuides([mk()], TODAY)).toEqual([])
  })

  it('slugs repetidos se detectan', () => {
    expect(validateGuides([mk(), mk({ file: 'guia-de-prueba.md' })], TODAY).join('\n')).toMatch(/repetido/)
  })
})

describe('borradores y publicadas', () => {
  const drafts = [mk({ slug: 'guia-a', relacionadas: ['guia-b'] }), mk({ slug: 'guia-b', titulo: 'Segunda guía de prueba distinta' })]

  it('con todo en borrador NO se genera nada en producción (ni /guias/, ni RSS, ni sitemap)', () => {
    const { files, published: n } = generateSite({ guides: drafts, staticSitemapXml: STATIC_SITEMAP, ctx: CTX })
    expect(n).toBe(0)
    expect(files).toEqual({})
  })

  it('en modo revisión local se generan los borradores, pero sin sitemap ni RSS y con noindex', () => {
    const { files } = generateSite({ guides: drafts, staticSitemapXml: STATIC_SITEMAP, ctx: CTX, includeDrafts: true })
    expect(Object.keys(files).sort()).toEqual(['guias/guia-a/index.html', 'guias/guia-b/index.html', 'guias/index.html'])
    for (const html of Object.values(files)) expect(html).toContain('content="noindex, nofollow"')
    expect(files['guias/guia-a/index.html']).toContain('BORRADOR')
  })

  it('al publicar una, solo esa sale: páginas, RSS y sitemap; el borrador nunca', () => {
    const guides = [published({ slug: 'guia-a', relacionadas: ['guia-b'] }), mk({ slug: 'guia-b', titulo: 'Segunda guía de prueba distinta' })]
    const { files } = generateSite({ guides, staticSitemapXml: STATIC_SITEMAP, ctx: CTX })
    expect(Object.keys(files).sort()).toEqual(['guias/guia-a/index.html', 'guias/guias.json', 'guias/index.html', 'guias/rss.xml', 'sitemap.xml'])
    expect(files['sitemap.xml']).toContain(`${SITE_URL}/guias/guia-a/`)
    expect(files['sitemap.xml']).not.toContain('guia-b')
    expect(files['guias/rss.xml']).not.toContain('guia-b')
    expect(files['guias/index.html']).not.toContain('guia-b')
    // La guía publicada no enlaza a la relacionada que sigue en borrador.
    expect(files['guias/guia-a/index.html']).not.toContain('/guias/guia-b/')
    expect(files['guias/guia-a/index.html']).toContain('content="index, follow, max-image-preview:large"')
  })
})

describe('metadatos y datos estructurados', () => {
  const g = published({ slug: 'mi-guia', titulo: 'Guía con <b>HTML</b> & "comillas" en el título' })
  const html = renderGuidePage(g, [g], CTX)

  it('title, descripción, canonical y Open Graph usan el dominio oficial', () => {
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/guias/mi-guia/" />`)
    expect(html).toContain(`<meta property="og:url" content="${SITE_URL}/guias/mi-guia/" />`)
    expect(html).toContain(`<meta property="og:image" content="${SITE_URL}/og/pepa-guias.png" />`)
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
    expect(html).toContain('<meta property="og:locale" content="es_ES" />')
    expect(html).toContain('<meta property="article:published_time" content="2026-09-10" />')
    expect(html).not.toMatch(/localhost|github\.io/)
  })

  it('escapa el HTML del título (nada se inyecta)', () => {
    expect(html).not.toContain('<b>HTML</b>')
    expect(html).toContain('&lt;b&gt;HTML&lt;/b&gt;')
  })

  it('lleva Article y BreadcrumbList válidos', () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]))
    const article = blocks.find((b) => b['@type'] === 'Article')
    const crumbs = blocks.find((b) => b['@type'] === 'BreadcrumbList')
    expect(article.datePublished).toBe('2026-09-10')
    expect(article.dateModified).toBe('2026-09-12')
    expect(article.author).toEqual({ '@type': 'Organization', name: 'Equipo PEPA', url: SITE_URL })
    expect(article.mainEntityOfPage['@id']).toBe(`${SITE_URL}/guias/mi-guia/`)
    expect(crumbs.itemListElement.map((i: { position: number }) => i.position)).toEqual([1, 2, 3])
    expect(crumbs.itemListElement[2].item).toBe(`${SITE_URL}/guias/mi-guia/`)
  })

  it('un "</script>" en el título no rompe los datos estructurados', () => {
    const evil = published({ titulo: 'Título con </script><script>alert(1)</script>' })
    const out = renderGuidePage(evil, [evil], CTX)
    expect(out).not.toContain('<script>alert(1)</script>')
    for (const m of out.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) expect(() => JSON.parse(m[1])).not.toThrow()
  })

  it('una sola etiqueta h1 y fechas visibles con autoría y revisión', () => {
    expect(html.match(/<h1>/g)).toHaveLength(1)
    expect(html).toContain('Por Equipo PEPA')
    expect(html).toContain('Revisado por Ana Revisora')
    expect(html).toContain('<time datetime="2026-09-10">')
  })

  it('un aviso "en desarrollo" es visible cuando la guía lo declara', () => {
    const out = renderGuidePage(published({ en_desarrollo: ['las listas de deseos'] }), [], CTX)
    expect(out).toContain('En desarrollo:')
    expect(out).toContain('las listas de deseos')
  })

  it('el texto no admite HTML en crudo', () => {
    const out = renderGuidePage(published({ body: `${BODY}\n\n<script>alert(1)</script>` }), [], CTX)
    expect(out).not.toContain('<script>alert(1)</script>')
  })
})

describe('sitemap y RSS', () => {
  const guides = [published({ slug: 'a-guia', publicado: '2026-09-01', actualizado: '2026-09-05' }), published({ slug: 'b-guia', publicado: '2026-09-10', actualizado: '' }), mk({ slug: 'c-borrador' })]

  it('mantiene las páginas fijas y añade las publicadas con fecha de última modificación', () => {
    const xml = buildSitemap(STATIC_SITEMAP, guides)
    expect(xml).toContain('<loc>https://pepafamilyapp.es/funciones</loc>')
    expect(xml).toContain('<loc>https://pepafamilyapp.es/guias/a-guia/</loc><lastmod>2026-09-05</lastmod>')
    expect(xml).toContain('<loc>https://pepafamilyapp.es/guias/b-guia/</loc><lastmod>2026-09-10</lastmod>')
    expect(xml).toContain('<loc>https://pepafamilyapp.es/guias/</loc><lastmod>2026-09-10</lastmod>')
    expect(xml).not.toContain('c-borrador')
    expect(xml).not.toContain('/demo')
  })

  it('no duplica entradas si se ejecuta dos veces', () => {
    const once = buildSitemap(STATIC_SITEMAP, guides)
    expect(buildSitemap(once, guides).match(/guias\/a-guia\//g)).toHaveLength(1)
  })

  it('sin publicadas, el sitemap queda exactamente igual', () => {
    expect(buildSitemap(STATIC_SITEMAP, [mk()])).toBe(STATIC_SITEMAP)
  })

  it('RSS con solo las publicadas, la más reciente primero', () => {
    const rss = buildRss(guides)
    expect(rss).toContain('<rss version="2.0"')
    expect(rss).not.toContain('c-borrador')
    expect(rss.indexOf('b-guia')).toBeLessThan(rss.indexOf('a-guia'))
    expect(rss).toMatch(/<pubDate>\w{3}, 10 Sep 2026 09:00:00 GMT<\/pubDate>/)
  })
})

describe('enlace a la demo', () => {
  it('lleva a la zona indicada con la guía de origen, y la demo lo entiende', () => {
    const href = demoHref('cumpleanos', 'cumpleanos-infantil-paso-a-paso')
    expect(href).toBe('/demo/?zona=cumpleanos&desde=cumpleanos-infantil-paso-a-paso')
    expect(parseDemoEntry(href.split('?')[1])).toEqual({ tab: 'cumpleanos', guide: 'cumpleanos-infantil-paso-a-paso' })
  })

  it('las zonas de las guías son exactamente las pestañas de la demo', () => {
    expect(Object.keys(DEMO_ZONES).sort()).toEqual(DEMO_TABS.map((t) => t.id).sort())
  })
})

// Las 8 guías reales (borradores) del primer grupo.
describe('primer grupo de guías (contenido real)', () => {
  const guides = loadGuides(resolve(ROOT, 'content/guias'))

  it('son las 8 previstas y pasan la validación', () => {
    expect(guides).toHaveLength(8)
    // Con la fecha real de hoy: las guías reales tienen fechas reales (no futuras).
    expect(validateGuides(guides, new Date().toISOString().slice(0, 10))).toEqual([])
  })

  it('están publicadas, cada una con fecha real y revisión anotada', () => {
    // Si añades o retiras guías, actualiza este número (ver docs/GUIAS.md).
    const publicadas = guides.filter((g) => g.estado === 'publicado')
    expect(publicadas).toHaveLength(8)
    for (const g of publicadas) {
      expect(g.publicado, g.slug).toBe('2026-09-19')
      expect(g.revisado_por, g.slug).toBeTruthy()
      expect(g.revisado_fecha, g.slug).toBe('2026-09-19')
    }
  })

  it('el enlace "Guías" de la web coincide con si hay guías publicadas', () => {
    const site = readFileSync(resolve(ROOT, 'src/config/site.ts'), 'utf8')
    const shown = /SHOW_GUIDES_LINK\s*=\s*true/.test(site)
    expect(shown).toBe(guides.some((g) => g.estado === 'publicado'))
  })

  it('títulos y metadescripciones únicos (sin contenido duplicado)', () => {
    expect(new Set(guides.map((g) => g.titulo)).size).toBe(guides.length)
    expect(new Set(guides.map((g) => g.descripcion)).size).toBe(guides.length)
    expect(new Set(guides.map((g) => g.resumen)).size).toBe(guides.length)
  })

  it('ninguna guía queda huérfana: todas tienen enlaces de salida y de entrada', () => {
    const inbound = new Map(guides.map((g) => [g.slug, 0]))
    for (const g of guides) {
      expect((g.relacionadas ?? []).length, `${g.slug} sin relacionadas`).toBeGreaterThanOrEqual(2)
      for (const r of g.relacionadas ?? []) inbound.set(r, (inbound.get(r) ?? 0) + 1)
    }
    for (const [slug, n] of inbound) expect(n, `${slug} no está enlazada desde ninguna otra`).toBeGreaterThan(0)
  })

  it('cada guía ofrece un siguiente paso concreto en la demo (no solo la portada)', () => {
    for (const g of guides) {
      expect(Object.hasOwn(DEMO_ZONES, g.demo)).toBe(true)
      expect(renderGuidePage(g, guides, CTX, { includeDrafts: true })).toContain(`href="${demoHref(g.demo, g.slug).replace(/&/g, '&amp;')}"`)
    }
  })

  it('los enlaces internos de todas las páginas generadas apuntan a algo que existe', () => {
    const { files } = generateSite({ guides, staticSitemapXml: STATIC_SITEMAP, ctx: CTX, includeDrafts: true })
    const fixed = new Set(['/', '/funciones', '/precios', '/preguntas', '/privacidad', '/condiciones', '/contacto', '/paco', '/novedades'])
    for (const [path, html] of Object.entries(files)) {
      if (!path.endsWith('.html')) continue
      for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
        const href = m[1]
        if (fixed.has(href)) continue
        if (href.startsWith('/guias/')) {
          const target = href === '/guias/rss.xml' ? null : `${href.slice(1)}index.html`
          if (target) expect(files[target], `${path} enlaza a ${href}`).toBeDefined()
          continue
        }
        if (href === '/demo/') {
          expect(existsSync(resolve(ROOT, 'demo/index.html'))).toBe(true)
          continue
        }
        // Recursos estáticos: deben existir en public/ o en dist (los genera Vite).
        const inPublic = existsSync(resolve(ROOT, 'public', href.slice(1)))
        expect(inPublic || href.startsWith('/assets/'), `${path} enlaza a ${href}, que no existe`).toBe(true)
      }
      expect(html, path).not.toMatch(/href="\/admin/)
    }
  })

  it('la imagen social por defecto existe', () => {
    expect(existsSync(resolve(ROOT, 'public/og/pepa-guias.png'))).toBe(true)
    expect(existsSync(resolve(ROOT, 'public/guias.css'))).toBe(true)
  })

  it('no hay estadísticas ni testimonios inventados en el texto', () => {
    for (const g of guides) {
      expect(g.body, g.slug).not.toMatch(/\b\d{1,3}\s?%/)
      expect(g.body, g.slug).not.toMatch(/según (un )?estudio|premiad|testimonio/i)
    }
  })
})

describe('rendimiento y accesibilidad', () => {
  it('la fuente del texto se pide con font-display=optional y los títulos siguen con swap', () => {
    const src = '<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap" rel="stylesheet" />'
    const out = tuneFontLinks([src, '<link rel="preconnect" href="https://fonts.googleapis.com" />'])
    expect(out).toHaveLength(3)
    expect(out[0]).toContain('family=Baloo+2')
    expect(out[0]).toContain('display=swap')
    expect(out[0]).not.toContain('Plus+Jakarta')
    expect(out[1]).toContain('family=Plus+Jakarta+Sans')
    expect(out[1]).toContain('display=optional')
    expect(out[2]).toContain('preconnect')
  })

  it('el pie no salta niveles de título (h1 → h2 → h3, sin h4 sueltos)', () => {
    const g = published()
    for (const html of [renderGuidePage(g, [g], CTX), renderIndexPage([g], CTX)]) {
      expect(html).not.toMatch(/<h4/)
      expect(html.match(/<h1>/g)).toHaveLength(1)
    }
  })

  it('el índice ordena las publicadas de más nueva a más antigua y deja los borradores al final', () => {
    const list = [mk({ slug: 'z-borrador', titulo: 'Borrador que va al final del todo' }), published({ slug: 'a-vieja', titulo: 'Guía publicada más antigua aquí', publicado: '2026-08-01', actualizado: '' }), published({ slug: 'b-nueva', titulo: 'Guía publicada más reciente aquí', publicado: '2026-09-10', actualizado: '' })]
    const html = renderIndexPage(list, CTX, { includeDrafts: true })
    expect(html.indexOf('b-nueva')).toBeLessThan(html.indexOf('a-vieja'))
    expect(html.indexOf('a-vieja')).toBeLessThan(html.indexOf('z-borrador'))
  })
})
