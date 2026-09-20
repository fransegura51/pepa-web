import { describe, expect, it } from 'vitest'
import { buildGuidesJson } from '../../scripts/guias/lib.mjs'

// La lista que lee la HOME (/guias/guias.json): solo guías publicadas.
const base = { resumen: 'Resumen', body: 'Texto largo que no debe salir en la lista', tema: 'Tema' }

describe('lista de guías para la HOME', () => {
  const guides = [
    { ...base, slug: 'a-borrador', titulo: 'Borrador', estado: 'borrador' },
    { ...base, slug: 'b-vieja', titulo: 'Vieja', estado: 'publicado', publicado: '2026-08-01' },
    { ...base, slug: 'c-nueva', titulo: 'Nueva', estado: 'publicado', publicado: '2026-09-10' },
    { ...base, slug: 'd-principal', titulo: 'Principal', estado: 'publicado', publicado: '2026-07-01', principal: true },
  ]
  const list = JSON.parse(buildGuidesJson(guides))

  it('los borradores nunca salen', () => {
    expect(list.map((g: { slug: string }) => g.slug)).not.toContain('a-borrador')
    expect(list).toHaveLength(3)
  })

  it('primero la principal y después las más recientes', () => {
    expect(list.map((g: { slug: string }) => g.slug)).toEqual(['d-principal', 'c-nueva', 'b-vieja'])
  })

  it('solo lleva los datos mínimos (nada del texto completo)', () => {
    expect(Object.keys(list[0]).sort()).toEqual(['publicado', 'resumen', 'slug', 'tema', 'titulo'])
    expect(JSON.stringify(list)).not.toContain('Texto largo')
  })

  it('sin guías publicadas la lista es vacía', () => {
    expect(JSON.parse(buildGuidesJson([guides[0]]))).toEqual([])
  })
})
