// Contenido de la página «Cómo empezó todo» (/historia).
// Los textos son los de la familia: cualquier cambio de redacción se hace aquí.

export const HISTORIA_TITLE = 'Cómo empezó todo — La historia de PEPA, la app familiar'
export const HISTORIA_DESCRIPTION =
  'PEPA no nació porque quisiéramos crear una app: nació porque una familia necesitaba una. Así empezó, quién inspiró su nombre y por qué queremos compartirla con otras familias.'

// ---------------------------------------------------------------- Fotos reales
// Pueden ser fotos, ilustraciones o imágenes en 3D. Cada hueco se rellena sin tocar
// código: basta con guardar una imagen con el nombre del hueco (jpg, jpeg, png, webp o avif) en src/assets/historia/.
// Ejemplo: src/assets/historia/historia-abuela-pepa.jpg
// Mientras no exista, se ve un hueco reservado.

export type FotoSlot =
  | 'historia-familia'
  | 'historia-abuela-pepa'
  | 'historia-inicios'
  | 'historia-primera-pepa'
  | 'historia-desarrollo'
  | 'historia-evolucion'
  | 'historia-paco'

export interface FotoInfo {
  // Qué es lo que se pondrá aquí (se ve en el hueco vacío).
  placeholder: string
  // Texto alternativo cuando ya hay una imagen real.
  alt: string
  // Pie de foto opcional cuando ya hay una imagen real.
  caption?: string
  // Proporción del marco (evita saltos de diseño al cargar).
  ratio: string
  icon: string
  // Marco redondo (para imágenes que ya son un círculo).
  round?: boolean
}

export const FOTOS: Record<FotoSlot, FotoInfo> = {
  'historia-familia': {
    placeholder: 'Aquí irá una imagen de nuestra familia',
    alt: 'Ilustración en 3D de nuestra familia: el padre, la madre y sus dos hijos abrazados en el sofá de casa',
    ratio: '1222 / 1287',
    icon: '👨‍👩‍👧‍👦',
  },
  'historia-abuela-pepa': {
    placeholder: 'Aquí irá una imagen de la abuela que inspiró a PEPA',
    alt: 'La abuela de nuestra familia, en quien se inspira PEPA',
    ratio: '4 / 5',
    icon: '💛',
  },
  'historia-inicios': {
    placeholder: 'Aquí irán imágenes de los primeros días',
    alt: 'Una de las primeras versiones del calendario de PEPA en el móvil, con los planes de un día',
    caption: 'Una de las primeras capturas del calendario',
    ratio: '738 / 1500',
    icon: '📝',
  },
  'historia-primera-pepa': {
    placeholder: 'Aquí irá la primera PEPA',
    alt: 'La primera imagen de PEPA: solo su cara, con su pelo gris, sus gafas de carey y su sonrisa cercana',
    ratio: '1 / 1',
    icon: '🙂',
    round: true,
  },
  'historia-desarrollo': {
    placeholder: 'Aquí irá un momento del desarrollo de PEPA',
    alt: 'Un momento del desarrollo de PEPA',
    ratio: '4 / 3',
    icon: '🛠️',
  },
  'historia-evolucion': {
    placeholder: 'Aquí irá cómo evolucionó PEPA',
    alt: 'PEPA de cuerpo entero, con su taza, su bolsa «Una vida más fácil» y una tableta',
    ratio: '2 / 3',
    icon: '🎨',
  },
  'historia-paco': {
    placeholder: 'Aquí irá un fotograma de los vídeos de Paco',
    alt: 'Un momento de los vídeos de Paco',
    ratio: '16 / 9',
    icon: '🎬',
  },
}

// ---------------------------------------------------------------- El principio

export const CHORES = [
  'La compra.',
  'Las comidas.',
  'Las citas.',
  'Las tareas de casa.',
  'Las cosas que hay que recordar.',
  'Los gastos.',
  'Los recibos.',
  'El calendario.',
  'Lo que falta.',
  'Lo que se nos ha olvidado.',
  'Lo que uno pensaba que iba a hacer el otro.',
] as const

// ---------------------------------------------------------------- El problema

export const TOOLS_FOUND = [
  'Calendarios',
  'Listas de la compra',
  'Aplicaciones de economía',
  'Organizadores de tareas',
  'Recetas',
  'Aplicaciones para cada parte de la organización familiar',
] as const

// ---------------------------------------------------------------- Nace PEPA

export const AI_TOOLS = ['Claude Code', 'ChatGPT', 'Gemini', 'Generación de imagen y vídeo', 'Inteligencia artificial aplicada al desarrollo'] as const

export const BUILD_VERBS = ['diseñar', 'programar', 'probar', 'equivocarnos', 'cambiar', 'volver a probar', 'eliminar cosas', 'añadir otras', 'reconstruir constantemente'] as const

// ---------------------------------------------------------------- Construir PEPA utilizándola

export const USING_PHRASES = [
  'Esto así no nos sirve.',
  'Aquí faltaría esto.',
  '¿Por qué tenemos que hacer esto a mano?',
  '¿Y si PEPA pudiera hacerlo por nosotros?',
] as const

export const GROWTH = [
  { icon: '📅', label: 'Calendario familiar' },
  { icon: '🛒', label: 'Compras' },
  { icon: '💶', label: 'Economía' },
  { icon: '🍳', label: 'Cocina' },
  { icon: '📁', label: 'Documentos' },
  { icon: '🎉', label: 'Eventos' },
  { icon: '✅', label: 'Tareas' },
  { icon: '🏠', label: 'Organización familiar' },
  { icon: '✨', label: 'Inteligencia artificial' },
] as const

// ---------------------------------------------------------------- Línea temporal

export type EtapaKind = 'normal' | 'pregunta' | 'nombre' | 'futuro'

export interface Etapa {
  title: string
  text: string
  icon: string
  kind: EtapaKind
}

export const ETAPAS: readonly Etapa[] = [
  {
    title: 'La familia crece',
    text: 'Llega nuestro segundo hijo y comienza una nueva etapa familiar.',
    icon: '👶',
    kind: 'normal',
  },
  {
    title: 'El caos cotidiano',
    text: 'Dos padres, dos hijos, trabajo, casa, compras, citas, economía, tareas y cada vez más cosas que recordar.',
    icon: '🌪️',
    kind: 'normal',
  },
  {
    title: 'Buscamos soluciones',
    text: 'Probamos diferentes maneras y aplicaciones para organizarnos.',
    icon: '🔎',
    kind: 'normal',
  },
  {
    title: 'Una pregunta',
    text: '«¿Y si hacemos nosotros exactamente la aplicación que necesitamos?»',
    icon: '💡',
    kind: 'pregunta',
  },
  {
    title: 'Nace PEPA',
    text: 'Comenzamos a construir una aplicación exclusivamente para nuestra propia familia.',
    icon: '🌱',
    kind: 'normal',
  },
  {
    title: 'PEPA recibe su nombre',
    text: 'Nuestra aplicación adopta el nombre y la personalidad inspirados en la abuela de la familia: alguien que siempre está intentando ayudar a hijos y nietos.',
    icon: '💛',
    kind: 'nombre',
  },
  {
    title: 'PEPA crece',
    text: 'Calendario, compras, economía, cocina, eventos, documentos y nuevas herramientas empiezan a formar parte de PEPA.',
    icon: '📈',
    kind: 'normal',
  },
  {
    title: 'Descubrimos su potencial',
    text: 'Nos damos cuenta de que los problemas que intentábamos resolver no eran únicamente nuestros.',
    icon: '👀',
    kind: 'normal',
  },
  {
    title: 'Decidimos compartirla',
    text: 'PEPA deja de ser únicamente nuestra aplicación privada y empieza su camino para convertirse en una aplicación para otras familias.',
    icon: '🤝',
    kind: 'normal',
  },
  {
    title: 'El futuro',
    text: 'Seguimos construyendo PEPA e incorporando inteligencia artificial y nuevas posibilidades con el objetivo de conseguir un verdadero asistente familiar.',
    icon: '🚀',
    kind: 'futuro',
  },
]

// ---------------------------------------------------------------- Paco

export const PACO_SITUATIONS = [
  'Planes que cambian',
  'Cosas que se olvidan',
  'Discusiones domésticas',
  'Gastos inesperados',
  'Tareas pendientes',
  'Malentendidos',
  'Situaciones de pareja',
] as const
