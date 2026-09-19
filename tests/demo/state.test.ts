import { describe, expect, it } from 'vitest'
import { MENU } from '../../src/demo/data'
import {
  TOUR_STEPS,
  categoryRows,
  demoReducer,
  eventsOfDay,
  initialState,
  missingIngredients,
  pepaBudgetConclusion,
  shoppingPending,
  totalIncome,
  totalSpent,
  weekdayIndex,
  type DemoState,
} from '../../src/demo/state'

// Miércoles 16 de septiembre de 2026 (fecha fija → pruebas deterministas).
const TODAY = new Date(2026, 8, 16)

function fresh(): DemoState {
  return initialState(TODAY)
}

describe('estado inicial y reinicio', () => {
  it('empieza en Inicio con el día de hoy seleccionado y el recorrido sin decidir', () => {
    const s = fresh()
    expect(s.tab).toBe('inicio')
    expect(s.selectedDay).toBe(weekdayIndex(TODAY))
    expect(s.selectedDay).toBe(2)
    expect(s.tourStatus).toBe('ask')
  })

  it('weekdayIndex: lunes = 0 y domingo = 6', () => {
    expect(weekdayIndex(new Date(2026, 8, 14))).toBe(0)
    expect(weekdayIndex(new Date(2026, 8, 20))).toBe(6)
  })

  it('reiniciar devuelve exactamente el estado inicial, sin restos', () => {
    let s = fresh()
    s = demoReducer(s, { type: 'addShopping', name: 'Manzanas', store: 'Mercadona' })
    s = demoReducer(s, { type: 'addExpense', title: 'Zapatillas', category: 'ninos', amount: 300 })
    s = demoReducer(s, { type: 'toggleTask', id: 'b3' })
    s = demoReducer(s, { type: 'addEvent', title: 'Pediatra', day: 1, time: '10:00', memberIds: ['hugo'] })
    s = demoReducer(s, { type: 'tourStart' })
    expect(s).not.toEqual(fresh())
    expect(demoReducer(s, { type: 'reset', today: TODAY })).toEqual(fresh())
  })

  it('modificar el estado no altera los datos de partida (cada arranque es limpio)', () => {
    const a = fresh()
    a.shopping.push({ id: 'zz', name: 'Contaminación', store: 'X', done: false })
    a.events[0].title = 'CAMBIADO'
    const b = fresh()
    expect(b.shopping.some((s) => s.id === 'zz')).toBe(false)
    expect(b.events[0].title).not.toBe('CAMBIADO')
  })
})

describe('datos de ejemplo', () => {
  it('calendario semanal con varios miembros', () => {
    const s = fresh()
    const members = new Set(s.events.flatMap((e) => e.memberIds))
    expect(members.size).toBe(4)
    expect(new Set(s.events.map((e) => e.day)).size).toBe(7)
  })

  it('lista de la compra parcialmente completada', () => {
    const s = fresh()
    const done = s.shopping.filter((i) => i.done).length
    expect(done).toBeGreaterThan(0)
    expect(done).toBeLessThan(s.shopping.length)
  })

  it('presupuesto con ingresos, gastos y conclusión de Pepa', () => {
    const s = fresh()
    expect(totalIncome()).toBeGreaterThan(0)
    expect(totalSpent(s.expenses)).toBeGreaterThan(0)
    expect(pepaBudgetConclusion(s.expenses).length).toBeGreaterThan(20)
  })

  it('los eventos de un día salen ordenados por hora', () => {
    const times = eventsOfDay(fresh().events, 2).map((e) => e.time)
    expect(times).toEqual([...times].sort())
  })
})

describe('compras y cocina', () => {
  it('marcar y desmarcar un producto', () => {
    let s = fresh()
    const before = shoppingPending(s.shopping)
    s = demoReducer(s, { type: 'toggleShopping', id: 's3' })
    expect(shoppingPending(s.shopping)).toBe(before - 1)
    s = demoReducer(s, { type: 'toggleShopping', id: 's3' })
    expect(shoppingPending(s.shopping)).toBe(before)
  })

  it('no añade productos vacíos y recorta textos larguísimos', () => {
    const s = fresh()
    expect(demoReducer(s, { type: 'addShopping', name: '   ', store: 'X' })).toBe(s)
    const long = demoReducer(s, { type: 'addShopping', name: 'x'.repeat(500), store: 'Mercadona' })
    expect(long.shopping.at(-1)!.name.length).toBe(60)
  })

  it('convierte los ingredientes de un día en compras sin duplicar lo que ya está', () => {
    let s = fresh()
    const day = MENU.find((m) => m.id === 'm3')! // incluye "Carne picada", que ya está en la lista
    const missing = missingIngredients(s.shopping, day.ingredients)
    expect(missing.map((i) => i.name)).not.toContain('Carne picada')
    const before = s.shopping.length
    s = demoReducer(s, { type: 'addMenuToShopping', menuId: 'm3' })
    expect(s.shopping.length).toBe(before + missing.length)
    expect(s.notice).toMatch(/Añadidos/)
    // Repetirlo no añade nada.
    const again = demoReducer(s, { type: 'addMenuToShopping', menuId: 'm3' })
    expect(again.shopping.length).toBe(s.shopping.length)
    expect(again.notice).toMatch(/ya estaba/)
  })

  it('añadir la semana entera no repite ingredientes entre días', () => {
    const s = demoReducer(fresh(), { type: 'addWeekToShopping' })
    const names = s.shopping.map((i) => i.name.toLowerCase())
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('economía', () => {
  it('un gasto nuevo actualiza totales y la conclusión de Pepa', () => {
    let s = fresh()
    const before = totalSpent(s.expenses)
    const conclusionBefore = pepaBudgetConclusion(s.expenses)
    s = demoReducer(s, { type: 'addExpense', title: 'Cena fuera', category: 'ocio', amount: 200 })
    expect(totalSpent(s.expenses)).toBe(before + 200)
    const ocio = categoryRows(s.expenses).find((r) => r.id === 'ocio')!
    expect(ocio.ratio).toBeGreaterThan(1)
    expect(pepaBudgetConclusion(s.expenses)).not.toBe(conclusionBefore)
    expect(pepaBudgetConclusion(s.expenses)).toMatch(/Ocio/)
  })

  it('rechaza importes no válidos', () => {
    const s = fresh()
    for (const amount of [0, -5, Number.NaN, Infinity, 1e9]) {
      expect(demoReducer(s, { type: 'addExpense', title: 'X', category: 'comida', amount })).toBe(s)
    }
  })
})

describe('acciones externas bloqueadas', () => {
  it('solo muestran un aviso y no cambian ningún dato', () => {
    const s = fresh()
    const blocked = demoReducer(s, { type: 'blocked', what: 'enviar invitaciones' })
    expect(blocked.notice).toMatch(/demostración con datos ficticios/)
    expect({ ...blocked, notice: null }).toEqual({ ...s, notice: null })
  })
})

describe('recorrido guiado', () => {
  it('recorre todos los pasos cambiando de pestaña y termina en Inicio', () => {
    let s = demoReducer(fresh(), { type: 'tourStart' })
    expect(s.tourStatus).toBe('running')
    for (let i = 0; i < TOUR_STEPS.length; i++) {
      expect(s.tab).toBe(TOUR_STEPS[i].tab)
      s = demoReducer(s, { type: 'tourNext' })
    }
    expect(s.tourStatus).toBe('done')
    expect(s.tab).toBe('inicio')
  })

  it('cubre Inicio, Calendario, Compras, Economía, Cocina y Cumpleaños', () => {
    expect(TOUR_STEPS.map((t) => t.tab)).toEqual(['inicio', 'calendario', 'compras', 'economia', 'cocina', 'cumpleanos'])
  })

  it('se puede saltar en cualquier momento', () => {
    expect(demoReducer(demoReducer(fresh(), { type: 'tourStart' }), { type: 'tourSkip' }).tourStatus).toBe('done')
    expect(demoReducer(fresh(), { type: 'tourSkip' }).tourStatus).toBe('done')
  })
})
