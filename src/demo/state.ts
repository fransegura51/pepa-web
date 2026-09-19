import {
  BIRTHDAY,
  CATEGORIES,
  INCOMES,
  MENU,
  cloneFixtures,
  type BirthdayGuest,
  type BirthdayTask,
  type BudgetLine,
  type CategoryId,
  type DemoEvent,
  type Expense,
  type Ingredient,
  type MemberId,
  type ShoppingItem,
} from '@/demo/data'

// Estado de la demo: vive solo en memoria (useReducer). No se guarda en
// localStorage, cookies ni servidor — recargar la página o pulsar
// "Reiniciar demo" devuelve exactamente el estado inicial.

export type DemoTab = 'inicio' | 'calendario' | 'compras' | 'economia' | 'cocina' | 'cumpleanos'

export const DEMO_TABS: readonly { id: DemoTab; label: string; emoji: string }[] = [
  { id: 'inicio', label: 'Inicio', emoji: '🏠' },
  { id: 'calendario', label: 'Calendario', emoji: '📅' },
  { id: 'compras', label: 'Compras', emoji: '🛒' },
  { id: 'economia', label: 'Economía', emoji: '💶' },
  { id: 'cocina', label: 'Cocina', emoji: '🍳' },
  { id: 'cumpleanos', label: 'Cumpleaños', emoji: '🎂' },
]

export type TourStatus = 'ask' | 'running' | 'done'

export interface DemoState {
  tab: DemoTab
  // Día de la semana seleccionado en el calendario: 0 = lunes … 6 = domingo.
  selectedDay: number
  events: DemoEvent[]
  shopping: ShoppingItem[]
  expenses: Expense[]
  birthdayTasks: BirthdayTask[]
  birthdayGuests: BirthdayGuest[]
  birthdayBudget: BudgetLine[]
  tourStatus: TourStatus
  tourStep: number
  // Aviso breve tras una acción (p. ej. "Añadidos 3 ingredientes").
  notice: string | null
  nextId: number
}

// 0 = lunes … 6 = domingo, a partir de Date.getDay() (0 = domingo).
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7
}

// Fecha real de un día de la semana actual (0 = lunes) — solo para
// pintar el número del día en el calendario.
export function dayDate(today: Date, day: number): Date {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - weekdayIndex(today))
  return new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + day)
}

// Con una zona (entrada desde una guía) se abre directamente en esa
// pestaña y no se ofrece el recorrido guiado.
export function initialState(today: Date, tab: DemoTab | null = null): DemoState {
  const f = cloneFixtures()
  return {
    tab: tab ?? 'inicio',
    selectedDay: weekdayIndex(today),
    events: f.events,
    shopping: f.shopping,
    expenses: f.expenses,
    birthdayTasks: f.birthdayTasks,
    birthdayGuests: f.birthdayGuests,
    birthdayBudget: f.birthdayBudget,
    tourStatus: tab ? 'done' : 'ask',
    tourStep: 0,
    notice: null,
    nextId: 1,
  }
}

export type DemoAction =
  | { type: 'goTab'; tab: DemoTab }
  | { type: 'selectDay'; day: number }
  | { type: 'addEvent'; title: string; day: number; time: string; memberIds: MemberId[] }
  | { type: 'toggleShopping'; id: string }
  | { type: 'addShopping'; name: string; store: string }
  | { type: 'addExpense'; title: string; category: CategoryId; amount: number }
  | { type: 'addMenuToShopping'; menuId: string }
  | { type: 'addWeekToShopping' }
  | { type: 'toggleTask'; id: string }
  | { type: 'toggleGuest'; id: string }
  | { type: 'tourStart' }
  | { type: 'tourNext' }
  | { type: 'tourPrev' }
  | { type: 'tourSkip' }
  | { type: 'dismissNotice' }
  | { type: 'blocked'; what: string }
  | { type: 'reset'; today: Date }

const MAX_TEXT = 60
const MAX_AMOUNT = 100000

function cleanText(text: string): string {
  return text.trim().slice(0, MAX_TEXT)
}

function norm(text: string): string {
  return text.trim().toLowerCase()
}

// Ingredientes del menú que todavía no están en la lista de la compra
// (misma comparación por nombre, sin distinguir mayúsculas).
export function missingIngredients(shopping: ShoppingItem[], ingredients: Ingredient[]): Ingredient[] {
  const have = new Set(shopping.map((s) => norm(s.name)))
  const seen = new Set<string>()
  return ingredients.filter((i) => {
    const key = norm(i.name)
    if (have.has(key) || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function appendIngredients(state: DemoState, ingredients: Ingredient[]): DemoState {
  const toAdd = missingIngredients(state.shopping, ingredients)
  if (toAdd.length === 0) return { ...state, notice: 'Todo eso ya estaba en tu lista de la compra.' }
  let id = state.nextId
  const added: ShoppingItem[] = toAdd.map((i) => ({ id: `n${id++}`, name: i.name, store: i.store, done: false }))
  return {
    ...state,
    shopping: [...state.shopping, ...added],
    nextId: id,
    notice: `Añadidos ${added.length} ingrediente${added.length === 1 ? '' : 's'} a la lista de la compra.`,
  }
}

export function tourLength(): number {
  return TOUR_STEPS.length
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'goTab':
      return { ...state, tab: action.tab, notice: null }
    case 'selectDay':
      return { ...state, selectedDay: Math.min(6, Math.max(0, action.day)) }
    case 'addEvent': {
      const title = cleanText(action.title)
      if (!title) return state
      const event: DemoEvent = {
        id: `n${state.nextId}`,
        day: Math.min(6, Math.max(0, action.day)),
        time: action.time || 'Todo el día',
        title,
        memberIds: action.memberIds,
      }
      return { ...state, events: [...state.events, event], nextId: state.nextId + 1, notice: 'Evento añadido al calendario.' }
    }
    case 'toggleShopping':
      return { ...state, shopping: state.shopping.map((s) => (s.id === action.id ? { ...s, done: !s.done } : s)) }
    case 'addShopping': {
      const name = cleanText(action.name)
      if (!name) return state
      const item: ShoppingItem = { id: `n${state.nextId}`, name, store: cleanText(action.store) || 'Otras', done: false }
      return { ...state, shopping: [...state.shopping, item], nextId: state.nextId + 1 }
    }
    case 'addExpense': {
      const title = cleanText(action.title)
      const amount = Math.round(action.amount * 100) / 100
      if (!title || !Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) return state
      const expense: Expense = { id: `n${state.nextId}`, title, category: action.category, amount }
      return { ...state, expenses: [...state.expenses, expense], nextId: state.nextId + 1, notice: 'Gasto apuntado.' }
    }
    case 'addMenuToShopping': {
      const day = MENU.find((m) => m.id === action.menuId)
      return day ? appendIngredients(state, day.ingredients) : state
    }
    case 'addWeekToShopping':
      return appendIngredients(
        state,
        MENU.flatMap((m) => m.ingredients),
      )
    case 'toggleTask':
      return { ...state, birthdayTasks: state.birthdayTasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)) }
    case 'toggleGuest':
      return { ...state, birthdayGuests: state.birthdayGuests.map((g) => (g.id === action.id ? { ...g, confirmed: !g.confirmed } : g)) }
    case 'tourStart':
      return { ...state, tourStatus: 'running', tourStep: 0, tab: TOUR_STEPS[0].tab, notice: null }
    case 'tourNext': {
      const next = state.tourStep + 1
      if (next >= TOUR_STEPS.length) return { ...state, tourStatus: 'done', tab: 'inicio' }
      return { ...state, tourStep: next, tab: TOUR_STEPS[next].tab, notice: null }
    }
    case 'tourPrev': {
      const prev = Math.max(0, state.tourStep - 1)
      return { ...state, tourStep: prev, tab: TOUR_STEPS[prev].tab, notice: null }
    }
    case 'tourSkip':
      return { ...state, tourStatus: 'done' }
    case 'dismissNotice':
      return { ...state, notice: null }
    case 'blocked':
      // Acciones externas (subir archivos, invitar, correo, pagos…) no hacen
      // nada real en la demo: solo explican por qué.
      return { ...state, notice: `En la demo no se puede ${action.what}: es solo una demostración con datos ficticios.` }
    case 'reset':
      return initialState(action.today)
  }
}

// ---- Recorrido guiado: mensajes breves de Pepa (guion fijo, sin IA). ----

export interface TourStep {
  tab: DemoTab
  title: string
  text: string
}

export const TOUR_STEPS: readonly TourStep[] = [
  {
    tab: 'inicio',
    title: 'Aquí empieza el día',
    text: 'En Inicio ves de un vistazo lo que toca hoy: citas, compra pendiente, dinero y el próximo cumpleaños.',
  },
  {
    tab: 'calendario',
    title: 'Un calendario para todos',
    text: 'Cada miembro tiene su color. Toca un día para ver sus planes, o apunta un evento nuevo.',
  },
  {
    tab: 'compras',
    title: 'Una lista, todos a la vez',
    text: 'Marca lo que ya está en el carrito. En la app real, la lista se comparte en tiempo real con toda la familia.',
  },
  {
    tab: 'economia',
    title: 'Las cuentas, sin hojas de cálculo',
    text: 'Apunta un gasto y mira cómo cambia el presupuesto del mes. Yo te resumo cómo vais.',
  },
  {
    tab: 'cocina',
    title: 'Del menú a la compra',
    text: 'Elige el menú de la semana y pulsa "Añadir a la compra": solo se añade lo que aún no tienes apuntado.',
  },
  {
    tab: 'cumpleanos',
    title: 'Cumpleaños sin estrés',
    text: 'Cuenta atrás, tareas, invitados y presupuesto en un solo sitio. Prueba a marcar una tarea como hecha.',
  },
]

// ---- Cálculos de Economía ----

export interface CategoryRow {
  id: CategoryId
  name: string
  emoji: string
  budget: number
  spent: number
  ratio: number
}

export function totalIncome(): number {
  return INCOMES.reduce((sum, i) => sum + i.amount, 0)
}

export function totalSpent(expenses: Expense[]): number {
  return round2(expenses.reduce((sum, x) => sum + x.amount, 0))
}

export function categoryRows(expenses: Expense[]): CategoryRow[] {
  return CATEGORIES.map((c) => {
    const spent = round2(expenses.filter((x) => x.category === c.id).reduce((sum, x) => sum + x.amount, 0))
    return { id: c.id, name: c.name, emoji: c.emoji, budget: c.budget, spent, ratio: c.budget > 0 ? spent / c.budget : 0 }
  })
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// Conclusión de Pepa sobre el mes: se recalcula con cada gasto nuevo.
export function pepaBudgetConclusion(expenses: Expense[]): string {
  const rows = categoryRows(expenses)
  const over = rows.filter((r) => r.ratio > 1).sort((a, b) => b.ratio - a.ratio)
  const close = rows.filter((r) => r.ratio > 0.85 && r.ratio <= 1).sort((a, b) => b.ratio - a.ratio)
  const left = round2(totalIncome() - totalSpent(expenses))

  if (over.length > 0) {
    const worst = over[0]
    const extra = round2(worst.spent - worst.budget)
    return `Ojo: en ${worst.name} os habéis pasado ${formatEuros(extra)} del presupuesto. Si recortáis algo esta semana, aún llegáis con ${formatEuros(Math.max(left, 0))} de margen a fin de mes.`
  }
  if (close.length > 0) {
    const c = close[0]
    return `Vais bien, pero ${c.name} ya está al ${Math.round(c.ratio * 100)}% de su presupuesto. Os quedan ${formatEuros(left)} libres este mes.`
  }
  return `Buen mes: ningún gasto se sale de su presupuesto y os quedan ${formatEuros(left)} libres. 💚`
}

export function formatEuros(amount: number): string {
  return `${amount.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`
}

// ---- Resúmenes para Inicio ----

export function shoppingPending(shopping: ShoppingItem[]): number {
  return shopping.filter((s) => !s.done).length
}

export function eventsOfDay(events: DemoEvent[], day: number): DemoEvent[] {
  return events
    .filter((e) => e.day === day)
    .sort((a, b) => sortKey(a.time).localeCompare(sortKey(b.time)))
}

function sortKey(time: string): string {
  return /^\d/.test(time) ? time : '00:00'
}

export function birthdayBudgetSpent(lines: BudgetLine[]): number {
  return round2(lines.reduce((sum, l) => sum + l.amount, 0))
}

export function birthdayCountdownText(): string {
  return `${BIRTHDAY.daysAhead} días`
}
