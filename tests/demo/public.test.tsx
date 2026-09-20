import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { buildSignupUrl, DEMO_ORIGIN } from '../../src/demo/links'
import { DemoPage } from '../../src/demo/DemoPage'
import { DEMO_URL } from '../../src/config/site'

const ROOT = resolve(__dirname, '../..')

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
  it('la página muestra el aviso de datos ficticios, la salida y el CTA', () => {
    const html = renderToString(<DemoPage />)
    expect(html).toContain('Estás viendo una demostración con datos ficticios')
    expect(html).toContain('Son capturas reales de PEPA')
    expect(html).toContain('Crear mi familia')
    expect(html).toContain('Salir de la demo')
    expect(html).toContain('origen=demo')
    for (const label of ['Inicio', 'Calendario', 'Compras', 'Economía', 'Cocina', 'Cumpleaños']) {
      expect(html).toContain(label)
    }
  })

  it('abre en la primera pantalla con su captura real y la explicación de Pepa', () => {
    const html = renderToString(<DemoPage />)
    expect(html).toContain('Pantalla 1 de 6')
    expect(html).toContain('/screenshots/home.webp')
    expect(html).toMatch(/width="750"/)
    expect(html).toContain('Aquí empieza el día')
    expect(html).toContain('Siguiente')
  })

  it('ya no ofrece nada que dependa de datos o de guardar cosas', () => {
    const html = renderToString(<DemoPage />)
    expect(html).not.toMatch(/Reiniciar demo|<form|<input/)
  })
})
