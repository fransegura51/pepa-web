import { asset } from '@/lib/assetUrl'

// La demo es un recorrido por CAPTURAS REALES de la app de PEPA, hechas
// con una familia ficticia (Los Navarro: Elena, Carlos, Lucía y Hugo).
// No hay estado que guardar ni datos: solo qué pantalla se está viendo.
// Nada de este módulo habla con Supabase ni con ningún servidor.

export type DemoTab = 'inicio' | 'calendario' | 'compras' | 'economia' | 'cocina' | 'cumpleanos'

export interface DemoStep {
  tab: DemoTab
  label: string
  emoji: string
  // Captura real (750×1624, WebP) en public/screenshots/. La misma que usa
  // la portada de la web por defecto.
  image: string
  alt: string
  title: string
  text: string
}

export const DEMO_STEPS: readonly DemoStep[] = [
  {
    tab: 'inicio',
    label: 'Inicio',
    emoji: '🏠',
    image: asset('screenshots/home.webp'),
    alt: 'Pantalla de Inicio de PEPA: saludo a Elena, la lista de la compra y accesos a cada sección',
    title: 'Aquí empieza el día',
    text: 'La portada reúne lo de hoy: la lista de la compra a mano y un acceso directo a cada sección de la familia.',
  },
  {
    tab: 'calendario',
    label: 'Calendario',
    emoji: '📅',
    image: asset('screenshots/calendario.webp'),
    alt: 'Calendario de PEPA con los planes de la semana y un punto de color por cada miembro de la familia',
    title: 'Un calendario para todos',
    text: 'Todos los planes de la familia en un solo sitio. Cada persona tiene su color, y los puntitos de cada día enseñan de un vistazo cuántos planes hay.',
  },
  {
    tab: 'compras',
    label: 'Compras',
    emoji: '🛒',
    image: asset('screenshots/compras.webp'),
    alt: 'Lista de la compra de PEPA agrupada por tienda, con tres productos ya comprados',
    title: 'Una lista, todos a la vez',
    text: 'La lista de la compra, agrupada por tienda y por tipo de producto. Se marca lo que ya está en el carrito y se comparte con quien vaya al súper.',
  },
  {
    tab: 'economia',
    label: 'Economía',
    emoji: '💶',
    image: asset('screenshots/economia.webp'),
    alt: 'Economía de PEPA: ingresos, gastos y ahorro del mes, con las conclusiones de Pepa',
    title: 'Las cuentas, sin hojas de cálculo',
    text: 'Ingresos, gastos y ahorro del mes de un vistazo, y unas conclusiones de Pepa para saber cómo vais.',
  },
  {
    tab: 'cocina',
    label: 'Cocina',
    emoji: '🍳',
    image: asset('screenshots/cocina.webp'),
    alt: 'Menú semanal de PEPA con desayuno, comida, merienda y cena de cada día',
    title: 'El menú de la semana',
    text: 'Desayuno, comida, merienda y cena de cada día de la semana, para dejar de improvisar qué hay de cena.',
  },
  {
    tab: 'cumpleanos',
    label: 'Cumpleaños',
    emoji: '🎂',
    image: asset('screenshots/eventos.webp'),
    alt: 'Cumpleaños de Hugo en PEPA: cuenta atrás, preparación, tareas e invitados confirmados',
    title: 'Cumpleaños sin estrés',
    text: 'Cuenta atrás, tareas, invitados y presupuesto en un solo sitio, con recomendaciones de Pepa para no dejarte nada.',
  },
]

export const DEMO_TABS: readonly { id: DemoTab; label: string; emoji: string }[] = DEMO_STEPS.map((s) => ({
  id: s.tab,
  label: s.label,
  emoji: s.emoji,
}))

export interface DemoState {
  tab: DemoTab
}

// Con una zona (entrada desde una guía) se abre directamente en esa pantalla.
export function initialState(tab: DemoTab | null = null): DemoState {
  return { tab: tab ?? 'inicio' }
}

export type DemoAction = { type: 'goTab'; tab: DemoTab } | { type: 'next' } | { type: 'prev' }

export function stepIndex(tab: DemoTab): number {
  return DEMO_STEPS.findIndex((s) => s.tab === tab)
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'goTab':
      return { tab: action.tab }
    case 'next':
      return { tab: DEMO_STEPS[Math.min(DEMO_STEPS.length - 1, stepIndex(state.tab) + 1)].tab }
    case 'prev':
      return { tab: DEMO_STEPS[Math.max(0, stepIndex(state.tab) - 1)].tab }
  }
}
