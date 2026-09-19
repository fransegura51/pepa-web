// Datos 100% ficticios de la demo pública ("Probar PEPA ahora").
// Familia inventada: ningún nombre, foto ni dato viene de una familia
// real. Nada de este módulo habla con Supabase ni con ningún servidor.

export type MemberId = 'elena' | 'carlos' | 'lucia' | 'hugo'

export interface Member {
  id: MemberId
  name: string
  role: 'adulto' | 'niño'
  color: string
  emoji: string
}

export const FAMILY_NAME = 'Los Navarro'

export const MEMBERS: readonly Member[] = [
  { id: 'elena', name: 'Elena', role: 'adulto', color: '#12a594', emoji: '👩' },
  { id: 'carlos', name: 'Carlos', role: 'adulto', color: '#3b6fd4', emoji: '👨' },
  { id: 'lucia', name: 'Lucía', role: 'niño', color: '#e0679a', emoji: '👧' },
  { id: 'hugo', name: 'Hugo', role: 'niño', color: '#f0a020', emoji: '👦' },
]

export function memberById(id: MemberId): Member {
  return MEMBERS.find((m) => m.id === id)!
}

// ---- Calendario ----

export interface DemoEvent {
  id: string
  // 0 = lunes de la semana actual … 6 = domingo
  day: number
  time: string
  title: string
  memberIds: MemberId[]
  place?: string
}

export const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const
export const WEEK_DAYS_LONG = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const

const EVENTS: readonly DemoEvent[] = [
  { id: 'e1', day: 0, time: '08:30', title: 'Colegio: llevar a Hugo y Lucía', memberIds: ['carlos', 'lucia', 'hugo'] },
  { id: 'e2', day: 0, time: '17:30', title: 'Natación de Lucía', memberIds: ['lucia', 'elena'], place: 'Polideportivo' },
  { id: 'e3', day: 1, time: '09:00', title: 'Reunión de trabajo', memberIds: ['elena'] },
  { id: 'e4', day: 1, time: '16:45', title: 'Dentista de Hugo', memberIds: ['hugo', 'carlos'], place: 'Clínica Sonrisa' },
  { id: 'e5', day: 2, time: '18:00', title: 'Inglés de Lucía', memberIds: ['lucia'], place: 'Academia' },
  { id: 'e6', day: 2, time: '20:30', title: 'Cena con los abuelos', memberIds: ['elena', 'carlos', 'lucia', 'hugo'] },
  { id: 'e7', day: 3, time: '17:30', title: 'Natación de Lucía', memberIds: ['lucia', 'elena'], place: 'Polideportivo' },
  { id: 'e8', day: 3, time: '19:00', title: 'Reunión de padres', memberIds: ['elena', 'carlos'], place: 'Colegio' },
  { id: 'e9', day: 4, time: '18:30', title: 'Revisión del coche', memberIds: ['carlos'], place: 'Taller Ruiz' },
  { id: 'e10', day: 5, time: '11:00', title: 'Partido de fútbol de Hugo', memberIds: ['hugo', 'carlos'], place: 'Campo municipal' },
  { id: 'e11', day: 5, time: '14:30', title: 'Comida en casa de los tíos', memberIds: ['elena', 'carlos', 'lucia', 'hugo'] },
  { id: 'e12', day: 6, time: 'Todo el día', title: 'Excursión a la sierra', memberIds: ['elena', 'carlos', 'lucia', 'hugo'] },
]

// ---- Compras ----

export interface ShoppingItem {
  id: string
  name: string
  store: string
  done: boolean
}

const SHOPPING: readonly ShoppingItem[] = [
  { id: 's1', name: 'Leche', store: 'Mercadona', done: true },
  { id: 's2', name: 'Pan de molde', store: 'Mercadona', done: true },
  { id: 's3', name: 'Yogures', store: 'Mercadona', done: false },
  { id: 's4', name: 'Plátanos', store: 'Mercadona', done: false },
  { id: 's5', name: 'Pechuga de pollo', store: 'Carnicería', done: true },
  { id: 's6', name: 'Carne picada', store: 'Carnicería', done: false },
  { id: 's7', name: 'Champú infantil', store: 'Farmacia', done: false },
  { id: 's8', name: 'Tiritas', store: 'Farmacia', done: true },
]

// ---- Economía ----

export type CategoryId = 'vivienda' | 'comida' | 'transporte' | 'ocio' | 'ninos' | 'salud'

export interface Category {
  id: CategoryId
  name: string
  emoji: string
  budget: number
}

export const CATEGORIES: readonly Category[] = [
  { id: 'vivienda', name: 'Vivienda', emoji: '🏠', budget: 900 },
  { id: 'comida', name: 'Comida', emoji: '🛒', budget: 520 },
  { id: 'transporte', name: 'Transporte', emoji: '🚗', budget: 180 },
  { id: 'ocio', name: 'Ocio', emoji: '🎈', budget: 150 },
  { id: 'ninos', name: 'Niños', emoji: '🧸', budget: 200 },
  { id: 'salud', name: 'Salud', emoji: '💊', budget: 80 },
]

export interface Expense {
  id: string
  title: string
  category: CategoryId
  amount: number
}

export interface Income {
  id: string
  title: string
  amount: number
}

export const INCOMES: readonly Income[] = [
  { id: 'i1', title: 'Nómina de Elena', amount: 1650 },
  { id: 'i2', title: 'Nómina de Carlos', amount: 1200 },
]

const EXPENSES: readonly Expense[] = [
  { id: 'x1', title: 'Alquiler', category: 'vivienda', amount: 720 },
  { id: 'x2', title: 'Luz y agua', category: 'vivienda', amount: 96 },
  { id: 'x3', title: 'Internet', category: 'vivienda', amount: 35 },
  { id: 'x4', title: 'Compra semanal', category: 'comida', amount: 118 },
  { id: 'x5', title: 'Compra semanal', category: 'comida', amount: 104 },
  { id: 'x6', title: 'Compra semanal', category: 'comida', amount: 127 },
  { id: 'x7', title: 'Carnicería y pescadería', category: 'comida', amount: 64 },
  { id: 'x8', title: 'Gasolina', category: 'transporte', amount: 72 },
  { id: 'x9', title: 'Parking', category: 'transporte', amount: 24 },
  { id: 'x10', title: 'Cine en familia', category: 'ocio', amount: 38 },
  { id: 'x11', title: 'Natación de Lucía', category: 'ninos', amount: 42 },
  { id: 'x12', title: 'Material del colegio', category: 'ninos', amount: 57 },
  { id: 'x13', title: 'Farmacia', category: 'salud', amount: 21 },
]

// ---- Cocina ----

export interface Ingredient {
  name: string
  store: string
}

export interface MenuDay {
  id: string
  day: number
  lunch: string
  dinner: string
  ingredients: Ingredient[]
}

export const MENU: readonly MenuDay[] = [
  {
    id: 'm0',
    day: 0,
    lunch: 'Lentejas con verduras',
    dinner: 'Tortilla de patata y ensalada',
    ingredients: [
      { name: 'Lentejas', store: 'Mercadona' },
      { name: 'Zanahorias', store: 'Mercadona' },
      { name: 'Huevos', store: 'Mercadona' },
      { name: 'Patatas', store: 'Mercadona' },
    ],
  },
  {
    id: 'm1',
    day: 1,
    lunch: 'Pasta con tomate y atún',
    dinner: 'Crema de calabacín',
    ingredients: [
      { name: 'Pasta', store: 'Mercadona' },
      { name: 'Tomate frito', store: 'Mercadona' },
      { name: 'Atún en lata', store: 'Mercadona' },
      { name: 'Calabacines', store: 'Mercadona' },
    ],
  },
  {
    id: 'm2',
    day: 2,
    lunch: 'Pollo al horno con patatas',
    dinner: 'Cena en casa de los abuelos',
    ingredients: [
      { name: 'Muslos de pollo', store: 'Carnicería' },
      { name: 'Patatas', store: 'Mercadona' },
    ],
  },
  {
    id: 'm3',
    day: 3,
    lunch: 'Arroz con verduras',
    dinner: 'Hamburguesas caseras',
    ingredients: [
      { name: 'Arroz', store: 'Mercadona' },
      { name: 'Pimientos', store: 'Mercadona' },
      { name: 'Carne picada', store: 'Carnicería' },
      { name: 'Pan de hamburguesa', store: 'Mercadona' },
    ],
  },
  {
    id: 'm4',
    day: 4,
    lunch: 'Merluza con ensalada',
    dinner: 'Pizza casera',
    ingredients: [
      { name: 'Merluza', store: 'Pescadería' },
      { name: 'Lechuga', store: 'Mercadona' },
      { name: 'Masa de pizza', store: 'Mercadona' },
      { name: 'Queso rallado', store: 'Mercadona' },
    ],
  },
]

// ---- Cumpleaños ----

export interface BirthdayTask {
  id: string
  title: string
  done: boolean
}

export interface BirthdayGuest {
  id: string
  name: string
  confirmed: boolean
}

export interface BudgetLine {
  id: string
  title: string
  amount: number
}

export const BIRTHDAY = {
  who: 'Hugo',
  turns: 6,
  daysAhead: 12,
  place: 'Parque de bolas Diverlandia',
  budget: 180,
}

const BIRTHDAY_TASKS: readonly BirthdayTask[] = [
  { id: 'b1', title: 'Reservar el parque de bolas', done: true },
  { id: 'b2', title: 'Enviar las invitaciones', done: true },
  { id: 'b3', title: 'Encargar la tarta', done: false },
  { id: 'b4', title: 'Comprar globos y piñata', done: false },
  { id: 'b5', title: 'Preparar las bolsitas de regalo', done: false },
  { id: 'b6', title: 'Confirmar alergias con las familias', done: false },
]

const BIRTHDAY_GUESTS: readonly BirthdayGuest[] = [
  { id: 'g1', name: 'Mateo', confirmed: true },
  { id: 'g2', name: 'Sofía', confirmed: true },
  { id: 'g3', name: 'Daniel', confirmed: true },
  { id: 'g4', name: 'Valeria', confirmed: false },
  { id: 'g5', name: 'Pablo', confirmed: true },
  { id: 'g6', name: 'Martina', confirmed: false },
  { id: 'g7', name: 'Álvaro', confirmed: true },
  { id: 'g8', name: 'Noa', confirmed: false },
]

const BIRTHDAY_BUDGET: readonly BudgetLine[] = [
  { id: 'l1', title: 'Parque de bolas (reserva)', amount: 60 },
  { id: 'l2', title: 'Tarta', amount: 35 },
  { id: 'l3', title: 'Globos y piñata', amount: 28 },
]

// ---- Fixtures clonables ----
// Cada arranque/reinicio de la demo recibe copias nuevas: modificar el
// estado jamás altera estas constantes, así "recargar" o "reiniciar"
// devuelve siempre exactamente lo mismo.

export interface Fixtures {
  events: DemoEvent[]
  shopping: ShoppingItem[]
  expenses: Expense[]
  birthdayTasks: BirthdayTask[]
  birthdayGuests: BirthdayGuest[]
  birthdayBudget: BudgetLine[]
}

export function cloneFixtures(): Fixtures {
  return {
    events: EVENTS.map((e) => ({ ...e, memberIds: [...e.memberIds] })),
    shopping: SHOPPING.map((s) => ({ ...s })),
    expenses: EXPENSES.map((x) => ({ ...x })),
    birthdayTasks: BIRTHDAY_TASKS.map((t) => ({ ...t })),
    birthdayGuests: BIRTHDAY_GUESTS.map((g) => ({ ...g })),
    birthdayBudget: BIRTHDAY_BUDGET.map((l) => ({ ...l })),
  }
}
