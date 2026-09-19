// Contenido centralizado aquí (Skill sección 12: "el propietario no
// debería tener que editar componentes React para cambiar un vídeo o
// una pregunta") — cambiar un vídeo, la pregunta de la semana o una
// pregunta de la FAQ es editar este archivo, no los componentes.

export interface ModuleInfo {
  key: string
  icon: string
  name: string
  tagline: string
  color: string
}

// Un color fijo por módulo (Skill sección 6: paleta semántica, no el
// generador "arcoíris sin repetir" de family-app — aquí cada módulo
// tiene SU color de siempre, para reconocerlo de un vistazo).
export const MODULES: ModuleInfo[] = [
  { key: 'calendario', icon: '📅', name: 'Calendario', tagline: 'Toda la familia en un mismo calendario.', color: '#DCEBFF' },
  { key: 'compras', icon: '🛒', name: 'Compras', tagline: 'Listas inteligentes y tickets por foto.', color: '#D8F5E8' },
  { key: 'economia', icon: '€', name: 'Economía', tagline: 'Controla gastos sin complicaciones.', color: '#FFE8CC' },
  { key: 'cocina', icon: '🍽️', name: 'Cocina', tagline: 'Recetas, menús y lista de la compra.', color: '#FFDCE0' },
  { key: 'eventos', icon: '🎉', name: 'Eventos', tagline: 'Cumpleaños, comuniones y mucho más.', color: '#EADCFF' },
  { key: 'documentos', icon: '📄', name: 'Documentos', tagline: 'Todo lo importante, siempre a mano.', color: '#DCF3FF' },
]

export interface PacoVideo {
  title: string
  thumbnail: string
  url: string
  date: string
  platform?: string
}

// Sin vídeos reales todavía — placeholder EXPLÍCITO (Skill: nunca
// inventar miniaturas/contenido). En cuanto haya vídeos reales, se
// añaden aquí y la sección deja de mostrar el estado vacío.
export const PACO_VIDEOS: PacoVideo[] = []

export interface QuizQuestion {
  question: string
  options: { label: string; chaosPoints: number }[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: '¿Cuántas personas vivís en casa?',
    options: [
      { label: '1-2', chaosPoints: 0 },
      { label: '3-4', chaosPoints: 1 },
      { label: '5 o más', chaosPoints: 2 },
    ],
  },
  {
    question: '¿Con qué frecuencia se os olvida algo importante (cumpleaños, cita, pago)?',
    options: [
      { label: 'Casi nunca', chaosPoints: 0 },
      { label: 'De vez en cuando', chaosPoints: 1 },
      { label: 'Constantemente', chaosPoints: 2 },
    ],
  },
  {
    question: '¿Hay niños en casa?',
    options: [
      { label: 'No', chaosPoints: 0 },
      { label: 'Sí, uno', chaosPoints: 1 },
      { label: 'Sí, dos o más', chaosPoints: 2 },
    ],
  },
  {
    question: '¿Cómo hacéis la lista de la compra?',
    options: [
      { label: 'Lista compartida y ordenada', chaosPoints: 0 },
      { label: 'Notas sueltas / memoria', chaosPoints: 1 },
      { label: '¿Lista? Vamos a improvisar', chaosPoints: 2 },
    ],
  },
  {
    question: '¿Cuál es vuestra principal fuente de caos?',
    options: [
      { label: 'El calendario de todos', chaosPoints: 1 },
      { label: 'Los gastos sin control', chaosPoints: 1 },
      { label: 'Organizar cualquier evento', chaosPoints: 2 },
    ],
  },
]

export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: '¿Cuánto cuesta PEPA?',
    answer: 'Todavía estamos en fase de acceso anticipado. Apúntate a la lista de espera y serás de las primeras familias en saberlo.',
  },
  {
    question: '¿Cuándo estará disponible?',
    answer: 'Estamos terminando de pulirla con familias reales. Si te apuntas a la lista de espera, te avisamos en cuanto puedas entrar.',
  },
  {
    question: '¿Qué pasa con mis datos?',
    answer: 'Cada familia ve solo sus propios datos. Puedes leer el detalle completo en la página de Privacidad.',
  },
  {
    question: '¿Necesito toda la familia para usarla?',
    answer: 'No: puedes empezar sola o solo, e ir invitando al resto cuando quieras. PEPA se vuelve más útil cuantos más la usáis.',
  },
  {
    question: '¿En qué dispositivos funciona?',
    answer: 'En el móvil y en el ordenador, desde el navegador — no hace falta instalar nada de una tienda de aplicaciones.',
  },
]

export interface PacoQuestion {
  key: string
  question: string
  options: { key: string; label: string }[]
}

export const PACO_QUESTION: PacoQuestion = {
  key: 'permiso_o_amenaza_2026',
  question: 'Cuando tu pareja dice "HAZ LO QUE QUIERAS"... ¿es permiso o es una amenaza?',
  options: [
    { key: 'permiso', label: 'Permiso real' },
    { key: 'amenaza', label: 'Amenaza disfrazada' },
  ],
}
