import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { describe, expect, it } from 'vitest'
import { Footer } from '../../src/components/Footer'
import { Header } from '../../src/components/Header'
import { chaosPercent } from '../../src/components/SurvivalQuiz'
import { CHAOS_TIERS, DAY_WITH_PEPA, HERO_NOTES, SHOWCASE, chaosTierFor } from '../../src/config/home'
import { SOCIAL_LINKS } from '../../src/config/site'
import { QUIZ_QUESTIONS } from '../../src/config/content'
import { Home } from '../../src/pages/Home'

const ROOT = resolve(__dirname, '../..')

function render(node: React.ReactElement): string {
  return renderToString(<StaticRouter location="/">{node}</StaticRouter>)
}

const homeHtml = render(<Home />)
const headerHtml = render(<Header />)
const footerHtml = render(<Footer />)

function textOf(html: string): string {
  return html
    .replace(/<!-- -->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim()
}

function all(html: string, re: RegExp): string[] {
  return [...html.matchAll(re)].map((m) => m[0])
}

describe('estructura de la HOME (de arriba abajo)', () => {
  it('tiene un único h1 con el mensaje de marca', () => {
    expect(all(homeHtml, /<h1[\s>]/g)).toHaveLength(1)
    expect(textOf(all(homeHtml, /<h1[\s\S]*?<\/h1>/g)[0])).toBe('Tu familia ya es bastante caos… PEPA lo organiza.')
  })

  it('las secciones salen en el orden narrativo acordado', () => {
    const h2 = all(homeHtml, /<h2[\s\S]*?<\/h2>/g).map(textOf)
    expect(h2.slice(0, 8)).toEqual([
      'Mira PEPA por dentro',
      'No te lo contamos. Pruébalo.',
      '¿Sobreviviría PEPA a tu familia?',
      'Hola, soy PEPA.',
      'La vida con Paco',
      'Un día con PEPA',
      'PEPA está en acceso anticipado',
      'Preguntas frecuentes',
    ])
    // Las guías solo aparecen cuando hay publicadas (se cargan en el navegador);
    // la última sección es siempre el cierre emocional.
    expect(h2.at(-1)).toContain('Tu familia seguirá siendo un caos.')
    expect(h2.at(-1)).toContain('Pero puede ser un caos organizado.')
  })

  it('no quedan restos de la HOME antigua', () => {
    for (const gone of ['Aún estamos afinando el precio', 'Ahorra tiempo', 'Más momentos de calidad', 'phone-carousel', 'La pregunta de Paco']) {
      expect(homeHtml, gone).not.toContain(gone)
    }
  })
})

describe('una sola galería de capturas', () => {
  it('hay un único selector de módulos (y ningún carrusel)', () => {
    expect(all(homeHtml, /role="tablist"/g)).toHaveLength(1)
    expect(homeHtml).not.toMatch(/carousel|slider|swiper/i)
  })

  it('enseña solo módulos con captura REAL: Documentos no sale mientras sea una ilustración', () => {
    const tabs = all(homeHtml, /<button[^>]*role="tab"[\s\S]*?<\/button>/g).map(textOf)
    expect(tabs).toEqual(['📅Calendario', '🛒Compras', '💶Economía', '🍳Cocina', '🎂Eventos'])
    expect(tabs.join('')).not.toContain('Documentos')
    // ...y todas las capturas mostradas son imágenes reales, nunca un .svg.
    const shown = all(homeHtml, /<img[^>]*src="[^"]*screenshots\/[^"]+"/g)
    expect(shown.length).toBeGreaterThan(0)
    for (const img of shown) expect(img).not.toMatch(/\.svg"/)
  })

  it('la captura se puede ampliar: hay un botón real con etiqueta y un visor <dialog>', () => {
    expect(homeHtml).toMatch(/aria-label="Ampliar la captura de Calendario"/)
    expect(homeHtml).toMatch(/<dialog[^>]*class="hm-dialog"/)
    expect(homeHtml).toMatch(/Cerrar<\/button>/)
  })

  it('cada módulo del visor tiene título, texto y alt descriptivos', () => {
    for (const m of SHOWCASE) {
      expect(m.title.length, m.key).toBeGreaterThan(10)
      expect(m.text.length, m.key).toBeGreaterThan(50)
      expect(m.alt.length, m.key).toBeGreaterThan(30)
    }
  })
})

describe('todo lo que parece clicable hace algo', () => {
  const allowedInternal = new Set(['#por-dentro', '/demo/', '/guias/', '/funciones', '/paco', '/historia', '/preguntas', '/privacidad', '/condiciones', '/contacto', '/'])
  const socialUrls = new Set(SOCIAL_LINKS.map((l) => l.href))

  it('cada enlace de la HOME, la cabecera y el pie tiene un destino que existe', () => {
    for (const html of [homeHtml, headerHtml, footerHtml]) {
      const anchors = all(html, /<a\s[^>]*>/g)
      expect(anchors.length).toBeGreaterThan(0)
      for (const a of anchors) {
        const href = a.match(/href="([^"]*)"/)?.[1]
        expect(href, `enlace sin href: ${a}`).toBeTruthy()
        if (href!.startsWith('http')) expect(socialUrls.has(href!) || href!.includes('fransegura51.github.io') || href!.includes('tiktok.com'), href).toBe(true)
        else expect(allowedInternal.has(href!), `destino no previsto: ${href}`).toBe(true)
      }
    }
  })

  it('cada <button> es un botón de verdad (tipo declarado) y ninguno es decorativo', () => {
    for (const html of [homeHtml, headerHtml]) {
      for (const b of all(html, /<button[^>]*>/g)) expect(b, b).toMatch(/type="(button|submit)"/)
    }
    // En el código: todo <button type="button"> de los componentes de la HOME lleva onClick.
    const files = ['ModuleViewer.tsx', 'ScreenshotDialog.tsx', 'SurvivalQuiz.tsx', 'HomeSections.tsx', 'Hero.tsx', 'Header.tsx']
    for (const f of files) {
      const src = readFileSync(resolve(ROOT, 'src/components', f), 'utf8')
      // (?:=>|[^>])* : el "=>" de una función dentro del botón no cierra la etiqueta
      // (se prueba "=>" antes que "cualquier carácter" para que no se corte en él).
      for (const m of src.matchAll(/<button\b(?:=>|[^>])*>/g)) {
        expect(m[0], `${f}: botón sin acción`).toMatch(/onClick=/)
      }
    }
  })

  it('las notas del hero son decoración: no son enlaces ni botones y se ocultan a los lectores de pantalla', () => {
    const notes = all(homeHtml, /<span class="hm-note[^"]*"[^>]*>[\s\S]*?<\/span>/g)
    expect(notes).toHaveLength(HERO_NOTES.length)
    expect(HERO_NOTES.length).toBeLessThanOrEqual(3)
    for (const n of notes) expect(n).toContain('aria-hidden="true"')
    const css = readFileSync(resolve(ROOT, 'src/styles/home.css'), 'utf8')
    const rule = css.slice(css.indexOf('.hm-note {'), css.indexOf('}', css.indexOf('.hm-note {')))
    expect(rule).toMatch(/pointer-events:\s*none/)
    expect(css).not.toMatch(/\.hm-note[^{]*:hover/)
  })

  it('el hero tiene dos acciones con destinos distintos', () => {
    const hero = all(homeHtml, /<section class="hm-hero"[\s\S]*?<\/section>/g)[0]
    const ctas = all(hero, /<a [^>]*class="btn [^"]*"[^>]*>[\s\S]*?<\/a>/g)
    expect(ctas.map((c) => [textOf(c), c.match(/href="([^"]*)"/)?.[1]])).toEqual([
      ['Probar PEPA gratis', '/demo/'],
      ['Ver PEPA por dentro', '#por-dentro'],
    ])
  })

  it('la demo y el cierre llevan a /demo/', () => {
    const demo = all(homeHtml, /<section id="demo"[\s\S]*?<\/section>/g)[0]
    expect(demo).toMatch(/href="\/demo\/"[^>]*>Entrar en la demo</)
    const final = all(homeHtml, /<section id="empezar"[\s\S]*?<\/section>/g)[0]
    expect(all(final, /<a\s/g)).toHaveLength(1)
    expect(final).toMatch(/href="\/demo\/"[^>]*>Probar PEPA gratis</)
  })
})

describe('cabecera y pie', () => {
  it('la cabecera: logo, 6 enlaces reales y un único botón "Probar PEPA"', () => {
    const nav = all(headerHtml, /<nav class="main-nav"[\s\S]*?<\/nav>/g)[0]
    expect(all(nav, /<a [^>]*>[\s\S]*?<\/a>/g).map(textOf)).toEqual(['Funciones', 'Demo', 'La vida con Paco', 'Historia', 'Guías', 'Preguntas'])
    expect(headerHtml).not.toContain('Precios')
    expect(all(headerHtml, /<a [^>]*class="btn btn-primary"[^>]*>[\s\S]*?<\/a>/g).map(textOf)).toEqual(['Probar PEPA'])
    expect(headerHtml).toMatch(/pepa-family-app-logo-master/)
  })

  it('el pie solo tiene los enlaces acordados y redes con perfil', () => {
    const links = all(footerHtml, /<a [^>]*href="(?!http)[^"]*"[^>]*>[\s\S]*?<\/a>/g).map(textOf).filter(Boolean)
    expect(links).toEqual(expect.arrayContaining(['Funciones', 'La vida con Paco', 'Guías', 'Preguntas', 'Privacidad', 'Condiciones', 'Escríbenos']))
    expect(footerHtml).not.toMatch(/>Precios<|>Novedades</)
    for (const s of SOCIAL_LINKS) expect(s.href.startsWith('https://')).toBe(true)
  })
})

describe('acceso anticipado y preguntas', () => {
  it('hay UN solo formulario de lista de espera en toda la HOME', () => {
    expect(all(homeHtml, /class="waitlist-form"/g)).toHaveLength(1)
    expect(all(homeHtml, /id="lista-de-espera"/g)).toHaveLength(1)
    expect(all(homeHtml, /<input[^>]*type="email"/g)).toHaveLength(1)
  })

  it('las preguntas frecuentes son 5 acordeones reales (details/summary)', () => {
    expect(all(homeHtml, /<details/g)).toHaveLength(5)
    expect(all(homeHtml, /<summary/g)).toHaveLength(5)
  })
})

describe('test de caos', () => {
  it('son 5 preguntas y muestra el progreso', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(5)
    expect(homeHtml).toContain('Pregunta 1 de 5')
  })

  it('el porcentaje va de 0 a 100 y cada nivel tiene su frase de PEPA', () => {
    const max = QUIZ_QUESTIONS.reduce((s, q) => s + Math.max(...q.options.map((o) => o.chaosPoints)), 0)
    expect(chaosPercent(0)).toBe(0)
    expect(chaosPercent(max)).toBe(100)
    expect(chaosTierFor(0).title).toBe(CHAOS_TIERS[0].title)
    expect(chaosTierFor(39).title).toBe(CHAOS_TIERS[0].title)
    expect(chaosTierFor(40).title).toBe(CHAOS_TIERS[1].title)
    expect(chaosTierFor(69).title).toBe(CHAOS_TIERS[1].title)
    expect(chaosTierFor(70).title).toBe(CHAOS_TIERS[2].title)
    expect(chaosTierFor(100).title).toBe(CHAOS_TIERS[2].title)
    for (const t of CHAOS_TIERS) {
      expect(t.text.length).toBeGreaterThan(20)
      for (const m of t.modules) expect(SHOWCASE.some((s) => s.key === m.key)).toBe(true)
    }
  })

  it('no guarda ni envía respuestas', () => {
    const src = readFileSync(resolve(ROOT, 'src/components/SurvivalQuiz.tsx'), 'utf8').replace(/\/\/.*$/gm, '')
    expect(src).not.toMatch(/localStorage|sessionStorage|fetch\(|supabase|cookie|sendBeacon/i)
  })
})

describe('"Un día con PEPA"', () => {
  it('son 5 momentos, con hora, y ninguno promete lo que PEPA no hace', () => {
    expect(DAY_WITH_PEPA).toHaveLength(5)
    expect(DAY_WITH_PEPA.map((m) => m.time)).toEqual(['08:15', '12:30', '17:00', '19:30', '21:00'])
    for (const m of DAY_WITH_PEPA) expect(m.text).not.toMatch(/inteligencia artificial|\bIA\b|automáticamente todo|garantiza/i)
    expect(all(homeHtml, /<li class="hm-moment"/g)).toHaveLength(5)
  })
})

describe('assets originales de PEPA', () => {
  it('las referencias oficiales siguen intactas en el proyecto y en la app', () => {
    const app = resolve(ROOT, '../family-app/src/assets/brand/references')
    let appFiles: string[] = []
    try {
      appFiles = readdirSync(app)
    } catch {
      return // sin la carpeta de la app (p. ej. en el CI) no se puede comparar
    }
    for (const f of ['pepa-face-reference-official.jpg', 'pepa-fullbody-reference-official.jpg']) {
      if (!appFiles.includes(f)) continue
      expect(readFileSync(resolve(ROOT, 'src/assets/brand/references', f)).equals(readFileSync(resolve(app, f))), f).toBe(true)
    }
  })

  it('el logotipo maestro no se ha tocado', () => {
    expect(readFileSync(resolve(ROOT, 'src/assets/brand/pepa-family-app-logo-master.png')).length).toBeGreaterThan(1_000_000)
  })
})
