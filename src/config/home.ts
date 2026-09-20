// Contenido de la HOME que no se gestiona desde /admin. Todo lo que se
// afirma aquí describe funciones que PEPA tiene hoy (comprobadas contra la
// app): nada de capacidades inventadas.

export type ShowcaseKey = 'calendario' | 'compras' | 'economia' | 'cocina' | 'eventos' | 'documentos'

export interface ShowcaseModule {
  key: ShowcaseKey
  name: string
  icon: string
  title: string
  text: string
  alt: string
}

// Módulos del visor "Mira PEPA por dentro". La captura de cada uno sale de
// los huecos de imagen de /admin → Imágenes (con la captura real por
// defecto); un módulo solo se muestra si su imagen es una captura real.
export const SHOWCASE: ShowcaseModule[] = [
  {
    key: 'calendario',
    name: 'Calendario',
    icon: '📅',
    title: 'Todos los planes en un solo calendario',
    text: 'Cada persona con su color y un vistazo a lo que pasa cada día. Apuntas un evento escribiéndolo o dictándolo.',
    alt: 'Calendario de PEPA con los planes de la semana y un punto de color por cada miembro de la familia',
  },
  {
    key: 'compras',
    name: 'Compras',
    icon: '🛒',
    title: 'La lista de la compra, compartida',
    text: 'Agrupada por tienda y por tipo de producto. Marcas lo que ya está en el carrito y dictas lo que falta.',
    alt: 'Lista de la compra de PEPA agrupada por tienda, con productos ya comprados',
  },
  {
    key: 'economia',
    name: 'Economía',
    icon: '💶',
    title: 'Ingresos, gastos y ahorro del mes',
    text: 'Apuntas gastos o subes la foto del ticket y Pepa lee los productos. El resumen te cuenta cuánto ahorráis, con conclusiones de Pepa.',
    alt: 'Economía de PEPA: ingresos, gastos y ahorro del mes, con las conclusiones de Pepa',
  },
  {
    key: 'cocina',
    name: 'Cocina',
    icon: '🍳',
    title: 'El menú de la semana',
    text: 'Desayuno, comida, merienda y cena de cada día, y tus recetas con sus ingredientes para añadir a la compra los que te faltan.',
    alt: 'Menú semanal de PEPA con desayuno, comida, merienda y cena de cada día',
  },
  {
    key: 'eventos',
    name: 'Eventos',
    icon: '🎂',
    title: 'Cumpleaños y celebraciones sin estrés',
    text: 'Cuenta atrás, invitados, tareas y presupuesto de cada celebración, con recomendaciones de Pepa para no dejarte nada.',
    alt: 'Cumpleaños de Hugo en PEPA: cuenta atrás, preparación, tareas e invitados confirmados',
  },
  {
    key: 'documentos',
    name: 'Documentos',
    icon: '📄',
    title: 'Los papeles importantes, a mano',
    text: 'DNI, seguros o carnets por carpetas y con su fecha de vencimiento, para que no se os pase renovarlos.',
    alt: 'Documentos de la familia en PEPA, ordenados por carpetas con su fecha de vencimiento',
  },
]

// Situaciones reales de PEPA que aparecen (decorativas) alrededor del móvil.
export const HERO_NOTES = ['🛒 Falta leche', '🎂 Cumpleaños en 12 días', '🦷 Dentista · 16:45']

export interface DayMoment {
  time: string
  text: string
}

// "Un día con PEPA": cada momento corresponde a una función que existe.
export const DAY_WITH_PEPA: DayMoment[] = [
  { time: '08:15', text: 'Un aviso en el móvil te recuerda la cita de esta mañana.' },
  { time: '12:30', text: 'Te acuerdas de que falta leche y la apuntas por voz en la lista compartida.' },
  { time: '17:00', text: 'Haces una foto al ticket y el gasto queda apuntado y clasificado.' },
  { time: '19:30', text: '¿Qué hay de cena? Miras el menú de la semana y listo.' },
  { time: '21:00', text: 'PEPA te avisa de que aún queda una tarea pendiente del cumpleaños.' },
]

// Resultado del test de caos. El porcentaje sale de las respuestas; no se
// guarda ni se envía nada.
export interface ChaosTier {
  max: number // el nivel aplica si el porcentaje es menor que este valor
  title: string
  text: string
  modules: { key: ShowcaseKey; name: string }[]
}

export const CHAOS_TIERS: ChaosTier[] = [
  {
    max: 40,
    title: 'Caos bajo control 🌿',
    text: 'Casi no me necesitáis… pero yo me acuerdo de todo igualmente.',
    modules: [
      { key: 'calendario', name: 'Calendario' },
      { key: 'compras', name: 'Compras' },
    ],
  },
  {
    max: 70,
    title: 'Caos con encanto 😅',
    text: 'Hay días buenos y días de «¿quién iba a por el niño?». Ahí entro yo.',
    modules: [
      { key: 'calendario', name: 'Calendario' },
      { key: 'economia', name: 'Economía' },
      { key: 'cocina', name: 'Cocina' },
    ],
  },
  {
    max: 101,
    title: 'Caos nivel experto 🌪️',
    text: 'Habéis venido al sitio correcto. Yo me acuerdo; vosotros, respirad.',
    modules: [
      { key: 'calendario', name: 'Calendario' },
      { key: 'compras', name: 'Compras' },
      { key: 'economia', name: 'Economía' },
      { key: 'eventos', name: 'Eventos' },
    ],
  },
]

export function chaosTierFor(percent: number): ChaosTier {
  return CHAOS_TIERS.find((t) => percent < t.max) ?? CHAOS_TIERS[CHAOS_TIERS.length - 1]
}

// Guía de la lista pública /guias/guias.json (la genera el build).
export interface GuideSummary {
  slug: string
  titulo: string
  resumen: string
  tema: string
  publicado: string
}

// Evento con el que el test de caos le pide al visor que abra un módulo.
export const SHOWCASE_EVENT = 'pepa:modulo'
