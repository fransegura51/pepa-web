import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { buildSignupUrl, DEMO_ORIGIN } from '../../src/demo/links'
import { CalendarioScreen, CocinaScreen, ComprasScreen, CumpleanosScreen, EconomiaScreen, InicioScreen } from '../../src/demo/screens'
import { DemoPage } from '../../src/demo/DemoPage'
import { initialState } from '../../src/demo/state'
import { DEMO_URL } from '../../src/config/site'

const ROOT = resolve(__dirname, '../..')
const TODAY = new Date(2026, 8, 16)

describe('la demo no se indexa', () => {
  const demoHtml = readFileSync(resolve(ROOT, 'demo/index.html'), 'utf8')

  it('su HTML estático lleva noindex (no depende de JavaScript)', () => {
    expect(demoHtml).toMatch(/<meta\s+name="robots"\s+content="[^"]*noindex/)
  })

  it('el resto de la web NO lleva noindex (no se ha contagiado)', () => {
    expect(readFileSync(resolve(ROOT, 'index.html'), 'utf8')).not.toMatch(/noindex/)
  })

  it('no está en el sitemap', () => {
    expect(readFileSync(resolve(ROOT, 'public/sitemap.xml'), 'utf8')).not.toMatch(/\/demo/)
  })

  it('robots.txt no bloquea /demo (si lo bloqueara, el buscador no vería el noindex)', () => {
    expect(readFileSync(resolve(ROOT, 'public/robots.txt'), 'utf8')).not.toMatch(/Disallow:\s*\/demo/)
  })

  it('está declarada como página de entrada propia en el build', () => {
    expect(readFileSync(resolve(ROOT, 'vite.config.ts'), 'utf8')).toContain("demo: 'demo/index.html'")
  })

  it('los botones de la web apuntan a la demo por su URL', () => {
    expect(DEMO_URL).toBe('/demo/')
    for (const file of ['src/components/Header.tsx', 'src/components/Hero.tsx']) {
      expect(readFileSync(resolve(ROOT, file), 'utf8'), file).toContain('href={DEMO_URL}')
    }
  })
})

describe('CTA "Crear mi familia"', () => {
  it('conserva el origen demo para medir la conversión', () => {
    const url = new URL(buildSignupUrl())
    expect(url.searchParams.get('origen')).toBe(DEMO_ORIGIN)
    expect(DEMO_ORIGIN).toBe('demo')
    expect(url.hostname).toBe('fransegura51.github.io')
  })
})

describe('render de la demo', () => {
  const props = { state: initialState(TODAY), dispatch: () => {}, today: TODAY, todayIndex: 2 }

  it('la página muestra el aviso de datos ficticios, la salida y el CTA', () => {
    const html = renderToString(<DemoPage />)
    expect(html).toContain('Estás usando una demostración con datos ficticios')
    expect(html).toContain('Crear mi familia')
    expect(html).toContain('Salir de la demo')
    expect(html).toContain('Reiniciar demo')
    expect(html).toContain('origen=demo')
    for (const label of ['Inicio', 'Calendario', 'Compras', 'Economía', 'Cocina', 'Cumpleaños']) {
      expect(html).toContain(label)
    }
  })

  it('cada pantalla se pinta sin errores con los datos de ejemplo', () => {
    const screens = {
      inicio: InicioScreen,
      calendario: CalendarioScreen,
      compras: ComprasScreen,
      economia: EconomiaScreen,
      cocina: CocinaScreen,
      cumpleanos: CumpleanosScreen,
    }
    for (const [name, Screen] of Object.entries(screens)) {
      const html = renderToString(<Screen {...props} />)
      expect(html.length, name).toBeGreaterThan(200)
    }
  })

  it('el calendario enseña los planes del día seleccionado', () => {
    const html = renderToString(<CalendarioScreen {...props} />)
    expect(html).toContain('Cena con los abuelos')
  })
})
