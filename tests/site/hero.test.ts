import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Regresión: la nota adhesiva de la esquina del hero se estiraba hasta
// tapar el móvil porque heredaba top y right de ".hero-visual .sticky-note"
// además de sus propios bottom y left (caja absoluta con los 4 lados fijos).
const css = readFileSync(resolve(__dirname, '../../src/styles/global.css'), 'utf8')

function rule(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  expect(start, `no existe la regla ${selector}`).toBeGreaterThanOrEqual(0)
  return css.slice(start, css.indexOf('}', start))
}

describe('notas adhesivas del hero', () => {
  it('la nota de la esquina anula top y right heredados (no se estira sobre el móvil)', () => {
    const corner = rule('.hero-visual .sticky-note--corner')
    expect(corner).toMatch(/top:\s*auto/)
    expect(corner).toMatch(/right:\s*auto/)
    expect(corner).toMatch(/bottom:\s*10px/)
    expect(corner).toMatch(/left:\s*-14px/)
  })

  it('la nota de arriba sigue anclada arriba a la derecha', () => {
    const top = rule('.hero-visual .sticky-note')
    expect(top).toMatch(/top:\s*-18px/)
    expect(top).toMatch(/right:\s*4px/)
  })

  it('en móvil estrecho el botón de la cabecera no se parte en varias líneas', () => {
    const start = css.indexOf('.site-header .header-actions .btn {')
    expect(start, 'falta la regla móvil de la cabecera').toBeGreaterThanOrEqual(0)
    // Debe estar dentro de un @media (max-width: 480px) y llevar nowrap.
    expect(css.lastIndexOf('@media (max-width: 480px)', start)).toBeGreaterThanOrEqual(0)
    expect(css.slice(start, css.indexOf('}', start))).toMatch(/white-space:\s*nowrap/)
  })
})
