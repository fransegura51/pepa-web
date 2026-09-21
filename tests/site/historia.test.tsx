import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { describe, expect, it } from 'vitest'
import { Footer } from '../../src/components/Footer'
import { Header } from '../../src/components/Header'
import { ETAPAS, FOTOS, HISTORIA_DESCRIPTION, HISTORIA_TITLE } from '../../src/config/historia'
import { Historia } from '../../src/pages/Historia'
import { ROUTE_META, applyRouteMeta } from '../../scripts/route-meta.mjs'

const ROOT = resolve(__dirname, '../..')

// Imágenes definitivas ya colocadas en src/assets/historia/ (el resto son huecos reservados).
const REAL = readdirSync(resolve(ROOT, 'src/assets/historia')).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))

function render(node: React.ReactElement): string {
  return renderToString(<StaticRouter location="/historia">{node}</StaticRouter>)
}

function textOf(html: string): string {
  return html
    .replace(/<!-- -->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

const html = render(<Historia />)
const text = textOf(html)

describe('estructura de la página «Cómo empezó todo»', () => {
  it('tiene un único h1 con el nombre de la página', () => {
    const h1 = [...html.matchAll(/<h1[\s\S]*?<\/h1>/g)]
    expect(h1).toHaveLength(1)
    expect(textOf(h1[0][0])).toBe('Cómo empezó todo')
  })

  it('cuenta la historia en el orden acordado', () => {
    const h2 = [...html.matchAll(/<h2[\s\S]*?<\/h2>/g)].map((m) => textOf(m[0]))
    expect(h2).toEqual([
      'Somos una familia normal.',
      'Empezamos a buscar ayuda',
      'Era nuestra aplicación familiar',
      '¿Quién es PEPA realmente?',
      'No la diseñamos desde una teoría',
      'Una idea que define PEPA',
      'Diez etapas, de la familia a PEPA',
      'De nuestra casa a otras familias',
      'Qué queremos construir',
      'Y entonces apareció Paco…',
      '¿Quieres ver cómo es PEPA por dentro?',
    ])
  })

  it('las frases centrales de la historia salen tal cual', () => {
    for (const frase of [
      'PEPA no nació porque quisiéramos crear una app.',
      'Nació porque necesitábamos una.',
      'Trabajamos los dos, tenemos un niño de cuatro años y medio y acabábamos de recibir a un nuevo miembro en la familia.',
      'dormir cuando el bebé decide que dormir está sobrevalorado.',
      'media docena de aplicaciones diferentes.',
      'Y ninguna estaba hecha exactamente como nosotros necesitábamos.',
      '¿Y si construimos nosotros la aplicación que nos gustaría tener?',
      'Era nuestra aplicación familiar.',
      'Muchas veces.',
      'Muchas.',
      'Pepa es la abuela de la familia.',
      'PEPA nació inspirada en ella.',
      'eso todavía le queda bastante grande a la inteligencia artificial',
      'Por eso PEPA tiene nombre, tiene cara y tiene personalidad.',
      'Detrás del personaje de PEPA hay una persona real.',
      'La abuela de nuestra familia.',
      'Esto así no nos sirve.',
      '¿Por qué tenemos que hacer esto a mano?',
      'Que sea la tecnología la que se adapte a la familia,',
      'y no la familia la que tenga que adaptarse a la tecnología.',
      'PEPA dejaría de ser solamente nuestra.',
      'PEPA empezó intentando solucionar los problemas de una familia.',
      'La nuestra.',
      'Ahora queremos descubrir hasta dónde puede llegar ayudando a muchas más.',
      'Y entonces apareció Paco…',
      '«Eso me lo habías dicho tú.»',
      'una familia intentando organizar un poquito mejor su vida.',
    ]) {
      expect(text, frase).toContain(frase)
    }
  })

  it('las herramientas de IA se mencionan sin hacer publicidad (sin enlaces ni logotipos)', () => {
    for (const nombre of ['Claude Code', 'ChatGPT', 'Gemini']) expect(text).toContain(nombre)
    const seccion = html.slice(html.indexOf('hs-nace'), html.indexOf('hs-quien'))
    expect(seccion).not.toMatch(/<a[\s>]|<img/)
  })
})

describe('línea temporal', () => {
  it('tiene las 10 etapas, en orden, como lista ordenada', () => {
    expect(ETAPAS).toHaveLength(10)
    expect(ETAPAS.map((e) => e.title)).toEqual([
      'La familia crece',
      'El caos cotidiano',
      'Buscamos soluciones',
      'Una pregunta',
      'Nace PEPA',
      'PEPA recibe su nombre',
      'PEPA crece',
      'Descubrimos su potencial',
      'Decidimos compartirla',
      'El futuro',
    ])
    const ol = html.match(/<ol class="hs-timeline">[\s\S]*?<\/ol>/)![0]
    expect([...ol.matchAll(/<li /g)]).toHaveLength(10)
    expect(textOf(ol)).toContain('Etapa 1 ')
    expect(textOf(ol)).toContain('Etapa 10 ')
  })
})

describe('fotos reales: nada inventado', () => {
  it('los 7 huecos existen y, sin imagen definitiva, salen como hueco reservado (no como imagen)', () => {
    expect(Object.keys(FOTOS).sort()).toEqual([
      'historia-abuela-pepa',
      'historia-desarrollo',
      'historia-evolucion',
      'historia-familia',
      'historia-inicios',
      'historia-paco',
      'historia-primera-pepa',
    ])
    for (const slot of Object.keys(FOTOS)) {
      expect(html, slot).toContain(`data-slot="${slot}"`)
    }
    expect([...html.matchAll(/hs-photo--empty/g)].length).toBe(7 - REAL.length)
  })

  it('el único personaje que aparece es la referencia oficial de PEPA, con alt y tamaño', () => {
    const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0])
    expect(imgs).toHaveLength(1 + REAL.length)
    const face = imgs.find((i) => /pepa-face-reference-official/.test(i))!
    expect(face).toMatch(/alt="[^"]{20,}"/)
    expect(face).toMatch(/width="1254"/)
    expect(face).toMatch(/height="1254"/)
    expect(face).toMatch(/loading="lazy"/)
    // Toda imagen definitiva lleva un texto alternativo de verdad.
    for (const i of imgs) expect(i).toMatch(/alt="[^"]{20,}"/)
  })
})

describe('accesibilidad y enlaces', () => {
  it('no hay botones decorativos y todos los enlaces llevan a una página real', () => {
    expect(html).not.toMatch(/<button/)
    const hrefs = [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1])
    expect(hrefs.sort()).toEqual(['/demo/', '/funciones', '/paco'])
  })

  it('los adornos y huecos vacíos no molestan a los lectores de pantalla', () => {
    for (const m of html.matchAll(/hs-photo--empty[^>]*/g)) expect(m[0]).toContain('aria-hidden="true"')
  })
})

describe('navegación', () => {
  it('«Historia» está en la cabecera (escritorio y menú móvil comparten lista) y en el pie', () => {
    const header = renderToString(
      <StaticRouter location="/">
        <Header />
      </StaticRouter>,
    )
    expect(header).toContain('href="/historia"')
    expect(textOf(header)).toContain('Historia')
    for (const otro of ['/funciones', '/demo/', '/paco', '/guias/', '/preguntas']) expect(header).toContain(`href="${otro}"`)

    const footer = renderToString(
      <StaticRouter location="/">
        <Footer />
      </StaticRouter>,
    )
    expect(footer).toContain('href="/historia"')
  })

  it('está en el sitemap y declarada como ruta', () => {
    expect(readFileSync(resolve(ROOT, 'public/sitemap.xml'), 'utf8')).toContain('<loc>https://pepafamilyapp.es/historia</loc>')
    expect(readFileSync(resolve(ROOT, 'src/App.tsx'), 'utf8')).toContain('path="/historia"')
  })
})

describe('SEO de /historia', () => {
  const indexHtml = readFileSync(resolve(ROOT, 'index.html'), 'utf8')
  const out = applyRouteMeta(indexHtml, '/historia')

  it('el título y la descripción del script coinciden con los de la página', () => {
    expect(ROUTE_META['/historia'].title).toBe(HISTORIA_TITLE)
    expect(ROUTE_META['/historia'].description).toBe(HISTORIA_DESCRIPTION)
  })

  it('el HTML estático lleva su propio title, description, canonical y Open Graph', () => {
    expect(out).toContain(`<title>${HISTORIA_TITLE}</title>`)
    expect(out).toContain(`<meta name="description" content="${HISTORIA_DESCRIPTION}" />`)
    expect(out).toContain('<link rel="canonical" href="https://pepafamilyapp.es/historia" />')
    expect(out).toContain('<meta property="og:url" content="https://pepafamilyapp.es/historia" />')
    expect(out).toContain(`<meta property="og:title" content="${HISTORIA_TITLE}" />`)
    expect(out).toContain(`<meta name="twitter:title" content="${HISTORIA_TITLE}" />`)
    expect(out.match(/<title>/g)).toHaveLength(1)
    expect(out.match(/rel="canonical"/g)).toHaveLength(1)
  })

  it('lleva datos estructurados válidos de tipo AboutPage', () => {
    const json = out.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]
    const data = JSON.parse(json)
    expect(data['@type']).toBe('AboutPage')
    expect(data.url).toBe('https://pepafamilyapp.es/historia')
    expect(data.isPartOf.url).toBe('https://pepafamilyapp.es/')
  })

  it('el resto de rutas queda exactamente igual', () => {
    for (const ruta of ['/funciones', '/paco', '/precios', '/preguntas', '/contacto']) {
      expect(applyRouteMeta(indexHtml, ruta)).toBe(indexHtml)
    }
  })
})
