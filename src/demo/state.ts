import { asset } from '@/lib/assetUrl'

// La demo es un recorrido por CAPTURAS REALES de la app de PEPA, hechas
// con una familia ficticia (Los Navarro: Elena, Carlos, Lucía, Hugo y el
// bebé Alba). No hay estado que guardar ni datos: solo qué módulo y qué
// pantalla se están viendo. Nada de este módulo habla con Supabase ni
// con ningún servidor.

export type DemoTab =
  | 'inicio'
  | 'familia'
  | 'calendario'
  | 'eventos'
  | 'puntos'
  | 'compras'
  | 'cocina'
  | 'economia'
  | 'cumples'
  | 'contactos'
  | 'documentos'
  | 'mas'

export interface DemoScreen {
  // Captura real (750×1624, WebP) en public/screenshots/demo/.
  image: string
  // Nombre corto para el selector de pantallas del módulo.
  label: string
  alt: string
  title: string
  text: string
}

export interface DemoModule {
  tab: DemoTab
  label: string
  emoji: string
  screens: readonly DemoScreen[]
}

function screen(file: string, label: string, title: string, text: string, alt: string): DemoScreen {
  return { image: asset(`screenshots/demo/${file}.webp`), label, title, text, alt }
}

export const DEMO_MODULES: readonly DemoModule[] = [
  {
    tab: 'inicio',
    label: 'Inicio',
    emoji: '🏠',
    screens: [
      screen(
        'home-1',
        'Hoy',
        'Aquí empieza el día',
        'Elena ve enseguida lo que toca hoy: las cosas pendientes del calendario y un acceso directo a cada parte de la familia.',
        'Pantalla de Inicio de PEPA: saludo a Elena y la nota de hoy con las cosas pendientes del calendario',
      ),
    ],
  },
  {
    tab: 'familia',
    label: 'Familia',
    emoji: '👨‍👩‍👧‍👦',
    screens: [
      screen(
        'fam-1-miembros',
        'Miembros',
        'Cada persona, con su color',
        'Adultos, niños y bebés, cada uno con su color. Ese color es el que verás luego en el calendario, en los gastos y en el mapa.',
        'Lista de miembros de la familia en PEPA: Elena, Carlos, Lucía, Hugo y el bebé Alba, cada uno con su color',
      ),
      screen(
        'fam-2-peso-adulto',
        'Peso',
        'Peso, objetivo e IMC',
        'Se apunta el peso cuando quieras, se marca un objetivo y PEPA enseña cuánto falta y cómo va el IMC. Es solo orientativo.',
        'Peso de Elena en PEPA: peso actual, objetivo de 62 kilos, progreso e IMC',
      ),
      screen(
        'fam-4-medidas',
        'Medidas',
        'Cintura, brazo, pierna…',
        'Además del peso se guardan otras medidas para ver el cambio real, aunque la báscula no se mueva.',
        'Pestaña de medidas corporales de Elena en PEPA: cintura, abdomen, brazo y pierna',
      ),
      screen(
        'fam-5-bebe-peso',
        'Bebé',
        'El crecimiento del bebé',
        'Para los bebés hay peso, altura y perímetro de la cabeza, con el historial de cada revisión.',
        'Seguimiento del bebé Alba en PEPA con peso, altura y perímetro de la cabeza',
      ),
      screen(
        'fam-6-bebe-curva',
        'Curvas OMS',
        'Con las curvas de la OMS',
        'PEPA sitúa al bebé en las curvas de la OMS y dice en qué percentil está. Es orientativo: para dudas, el pediatra.',
        'Curva de peso de la OMS con los puntos de Alba, percentil 74 y el historial de medidas',
      ),
    ],
  },
  {
    tab: 'calendario',
    label: 'Calendario',
    emoji: '📅',
    screens: [
      screen(
        'cal-1-general',
        'Vista general',
        'El mes de un vistazo',
        'Un punto de color por cada persona con planes ese día. Al tocar un día se ve todo lo que hay.',
        'Calendario de PEPA en vista general con puntos de color por miembro y el detalle del día',
      ),
      screen(
        'cal-2-mes',
        'Mes',
        'Vista mensual',
        'El mes completo con los planes de cada día, con el color de quien participa.',
        'Calendario mensual de PEPA con los eventos de cada día de septiembre',
      ),
      screen(
        'cal-3-semana',
        'Semana',
        'Vista semanal',
        'La semana por horas para ver dónde chocan los horarios de la familia.',
        'Calendario semanal de PEPA con la rejilla horaria',
      ),
      screen(
        'cal-4-3dias',
        '3 días',
        'Tres días',
        'Una vista intermedia: hoy y los dos días siguientes, con más detalle.',
        'Calendario de tres días de PEPA con los planes por horas',
      ),
      screen(
        'cal-5-dia',
        'Día',
        'Un día, hora a hora',
        'El día completo por horas, ideal para las jornadas más apretadas.',
        'Vista de un día del calendario de PEPA con los eventos por horas',
      ),
      screen(
        'cal-6-familiar',
        'Familiar',
        'Una columna por persona',
        'Cada miembro de la familia en su columna, para saber quién hace qué hoy.',
        'Vista familiar del calendario de PEPA con una columna por miembro y sus planes del día',
      ),
      screen(
        'cal-7-agenda',
        'Agenda',
        'Agenda en forma de lista',
        'Todos los planes que vienen, en orden y en formato lista.',
        'Agenda de PEPA con la lista de los próximos planes de la familia',
      ),
      screen(
        'cal-8-personal',
        'Personal',
        'Notas privadas',
        'Un espacio solo para ti, con notas por día que el resto de la familia no ve.',
        'Calendario personal de PEPA con notas privadas por día',
      ),
      screen(
        'cal-9-externos',
        'Externos',
        'Otros calendarios',
        'Se puede conectar el calendario de Google y calendarios externos, como los festivos, y llevar el de PEPA al móvil.',
        'Pantalla de calendarios externos de PEPA: conectar con Google Calendar y exportar el calendario al móvil',
      ),
    ],
  },
  {
    tab: 'eventos',
    label: 'Eventos',
    emoji: '🎉',
    screens: [
      screen(
        'ev-1-lista',
        'Tus eventos',
        'Celebraciones organizadas',
        'Cumpleaños, comuniones, bautizos, bodas… Cada evento tiene su propio espacio, con los que están en marcha y los archivados.',
        'Lista de eventos de PEPA: cumpleaños de Hugo y bautizo de Alba',
      ),
      screen(
        'ev-2-detalle',
        'Un evento',
        'Todo el evento en un panel',
        'Invitados, preparativos, presupuesto, menú, decoración, actividades y plan del día, cada uno con su resumen.',
        'Panel del cumpleaños de Hugo en PEPA con los módulos del evento y su estado',
      ),
      screen(
        'ev-4-invitados',
        'Invitados',
        'Quién viene y quién no',
        'La lista de invitados con su respuesta: confirmado, pendiente, no seguro o no viene.',
        'Lista de invitados del cumpleaños de Hugo con el estado de cada respuesta',
      ),
      screen(
        'ev-5-preparativos',
        'Preparativos',
        'Tareas con fecha',
        'Las cosas por hacer antes del evento, con su fecha, para no dejarse nada.',
        'Preparativos del cumpleaños de Hugo: tareas con fecha, algunas ya hechas',
      ),
      screen(
        'ev-6-presupuesto',
        'Presupuesto',
        'Lo previsto y lo gastado',
        'Cuánto se ha planeado gastar en cada partida y cuánto se lleva gastado de verdad, sin duplicar nada.',
        'Presupuesto del cumpleaños de Hugo con las partidas planeadas y el gasto real',
      ),
      screen(
        'ev-7-menu-compra',
        'Menú y compra',
        'Del menú a la lista de la compra',
        'Lo que se va a servir se pasa a la lista de la compra con un toque.',
        'Menú del cumpleaños de Hugo con los platos y bebidas pendientes de pasar a la compra',
      ),
      screen(
        'ev-8-decoracion',
        'Decoración',
        'Ideas y compras',
        'Ideas de decoración, lo ya elegido y lo ya comprado.',
        'Decoración del cumpleaños de Hugo con ideas, elegidas y compradas',
      ),
      screen(
        'ev-9-actividades',
        'Juegos',
        'Actividades y juegos',
        'Juegos para los niños con su edad recomendada, su duración y el material necesario.',
        'Actividades y juegos preparados para el cumpleaños de Hugo',
      ),
      screen(
        'ev-11b-bautizo-2',
        'Otro evento',
        'Un bautizo, más completo',
        'Los eventos grandes activan más módulos: ceremonia, mesas, pagos, proveedores y regalos.',
        'Panel del bautizo de Alba en PEPA con todos sus módulos',
      ),
      screen(
        'ev-12-ceremonia',
        'Ceremonia',
        'Ceremonia y celebración',
        'Lugar y hora de la ceremonia y del banquete por separado.',
        'Módulo de ceremonia del bautizo de Alba',
      ),
      screen(
        'ev-14-pagos',
        'Pagos',
        'Pagos y fianzas',
        'Qué se ha pagado, qué falta y cuándo vence cada pago, con recordatorio en el calendario.',
        'Pagos y fianzas del bautizo de Alba con lo pagado y lo pendiente',
      ),
      screen(
        'ev-15-proveedores',
        'Proveedores',
        'Todos los contactos del evento',
        'Local, tarta, fotógrafo… los proveedores con su contacto, en un solo sitio.',
        'Proveedores del evento en PEPA con su tipo y contacto',
      ),
    ],
  },
  {
    tab: 'puntos',
    label: 'Puntos',
    emoji: '⭐',
    screens: [
      screen(
        'pts-1-puntos',
        'Puntos',
        'Tareas que suman puntos',
        'Las tareas del calendario pueden dar puntos. Los niños los acumulan y luego los canjean por recompensas que elige la familia.',
        'Pantalla de puntos de PEPA con los puntos de cada miembro y las recompensas disponibles',
      ),
      screen(
        'pts-2-puntos-2',
        'Recompensas',
        'Recompensas a medida',
        'Cada familia crea las suyas, con el coste en puntos que quiera.',
        'Lista de recompensas de PEPA con su coste en puntos y botón de canjear',
      ),
    ],
  },
  {
    tab: 'compras',
    label: 'Compras',
    emoji: '🛒',
    screens: [
      screen(
        'shop-1-lista',
        'Lista',
        'Una lista para todos',
        'La lista de la compra agrupada por tienda y por tipo de producto. Se marca lo que ya está en el carrito y se comparte con quien vaya al súper.',
        'Lista de la compra de PEPA agrupada por tienda con productos pendientes',
      ),
      screen(
        'shop-3-precios',
        'Precios',
        'Historial de precios',
        'PEPA recuerda lo que pagas por cada producto y en qué tienda, para saber cuándo ha subido.',
        'Historial de precios de productos en PEPA',
      ),
      screen(
        'shop-4-precios-2',
        'Subidas y bajadas',
        'Qué ha subido y qué ha bajado',
        'Cada producto con su último precio y la variación respecto a la compra anterior.',
        'Precios de productos en PEPA con las subidas respecto a la compra anterior',
      ),
      screen(
        'shop-5-tickets',
        'Tickets',
        'Los tickets, guardados',
        'Se sube la foto del ticket con la tienda, la fecha y el importe. La foto se borra a los 3 meses; los datos se quedan.',
        'Pantalla para subir tickets de compra en PEPA',
      ),
      screen(
        'shop-6-estadistica',
        'Estadística',
        'Cuánto gastáis en comida',
        'Total registrado, reparto por tienda y por tipo de alimento, para saber dónde se va el dinero del súper.',
        'Estadística de compras de PEPA con el total gastado y los gráficos por tienda y tipo de alimento',
      ),
    ],
  },
  {
    tab: 'cocina',
    label: 'Cocina',
    emoji: '🍳',
    screens: [
      screen(
        'cook-1-menu',
        'Menú',
        'El menú de la semana',
        'Desayuno, comida, merienda y cena de cada día, para dejar de improvisar qué hay de cena.',
        'Menú semanal de PEPA con desayuno, comida, merienda y cena de cada día',
      ),
      screen(
        'cook-2-menu-2',
        'Más días',
        'Toda la semana, día a día',
        'Cada día tiene su tarjeta de color. Los huecos vacíos se rellenan con «+ Añadir».',
        'Menú de los siguientes días de la semana en PEPA',
      ),
      screen(
        'cook-3-recetas',
        'Recetas',
        'Vuestro recetario',
        'Las recetas de la familia con etiquetas y buscador: rápidas, de cuchara, para niños…',
        'Recetario de PEPA con las etiquetas y las recetas guardadas',
      ),
      screen(
        'cook-4-receta',
        'Una receta',
        'Ingredientes y preparación',
        'Cada receta guarda sus ingredientes y su preparación, y se puede pasar a la lista de la compra.',
        'Receta de lentejas con verduras en PEPA con ingredientes y preparación',
      ),
    ],
  },
  {
    tab: 'economia',
    label: 'Economía',
    emoji: '💶',
    screens: [
      screen(
        'eco-1-resumen',
        'Resumen',
        'Las cuentas del mes',
        'Ingresos, gastos y ahorro del mes de un vistazo, con la tasa de ahorro, y las cuentas con su saldo arriba.',
        'Economía de PEPA: resumen del mes con ingresos, gastos, ahorro y saldo de las cuentas',
      ),
      screen(
        'eco-2-resumen-conclusiones',
        'Conclusiones',
        'Conclusiones de Pepa',
        'PEPA lee vuestros gastos y os cuenta cómo vais, por ejemplo cuánto es gasto no esencial.',
        'Conclusiones de Pepa sobre el gasto del mes',
      ),
      screen(
        'eco-3-estadisticas',
        'Tendencia',
        'La tendencia del saldo',
        'Cómo evoluciona el dinero de las cuentas a lo largo del mes.',
        'Tendencia del saldo de las cuentas en PEPA',
      ),
      screen(
        'eco-4-estadisticas-2',
        'Categorías',
        'En qué se va el dinero',
        'Los gastos del mes por categoría, en un gráfico fácil de leer.',
        'Gráfico de gastos por categoría del mes en PEPA',
      ),
      screen(
        'eco-5-estadisticas-3',
        'Evolución',
        'Los últimos 6 meses',
        'La evolución del gasto mes a mes, para ver si se sube o se baja.',
        'Evolución temporal del gasto de los últimos seis meses en PEPA',
      ),
      screen(
        'eco-7-debo-necesito-quiero',
        'Debo · Necesito · Quiero',
        'Debo, necesito, quiero',
        'Cada gasto se clasifica en lo que se debe, lo que se necesita y lo que se quiere, para ver cuánto es capricho.',
        'Gastos clasificados en debo, necesito y quiero en PEPA',
      ),
      screen(
        'eco-8-fijo-variable',
        'Fijo y variable',
        'Fijos y variables',
        'Se separan los gastos fijos (alquiler, recibos) de los variables (súper, ocio).',
        'Gastos fijos y variables del mes en PEPA',
      ),
      screen(
        'eco-9-etiquetas',
        'Etiquetas',
        'Gastos con etiqueta',
        'Con etiquetas como «Cumpleaños de Hugo» o «Vacaciones» se ve lo que ha costado cada cosa, sumando todos sus gastos.',
        'Gastos agrupados por etiqueta en PEPA',
      ),
      screen(
        'eco-10-movimientos',
        'Movimientos',
        'Todos los movimientos',
        'Ingresos y gastos con su categoría, tienda e importe. Se filtra por lo que se quiera y se edita al momento.',
        'Lista de movimientos de PEPA con ingresos y gastos y filtros',
      ),
      screen(
        'eco-11-movimientos-2',
        'Lista',
        'Cada gasto, con su categoría',
        'Tienda, categoría e importe de cada movimiento, del más reciente al más antiguo.',
        'Lista de gastos recientes de PEPA con su tienda, categoría e importe',
      ),
      screen(
        'eco-12-presupuestos',
        'Presupuestos',
        'Presupuestos por categoría',
        'Se fija cuánto se quiere gastar en cada categoría y PEPA enseña cuánto lleváis.',
        'Presupuestos del mes en PEPA con lo gastado en cada categoría',
      ),
      screen(
        'eco-13-presupuestos-2',
        'Por categoría',
        'Cuánto queda en cada categoría',
        'Cada categoría con su barra: vivienda, compras, transporte, ocio… Se ve enseguida cuál está a punto de pasarse.',
        'Presupuestos por categoría en PEPA con el porcentaje gastado de cada una',
      ),
      screen(
        'eco-14-banco',
        'Banco',
        'El banco, conectado',
        'Con permiso del banco, los movimientos llegan solos y PEPA los categoriza.',
        'Pantalla del banco en PEPA con cuentas enlazadas y sincronización de movimientos',
      ),
      screen(
        'eco-15-banco-2',
        'Movimientos del banco',
        'Cada movimiento, categorizado',
        'Cada cargo del banco se puede revisar y corregir. Es el mismo movimiento que aparece en Economía.',
        'Movimientos del banco en PEPA, cada uno con su comercio, fecha e importe',
      ),
      screen(
        'eco-16-educacion',
        'Hucha de los niños',
        'Educación financiera',
        'Cada niño tiene su hucha: ingresos, ahorro, gastos y hasta un pequeño impuesto, para aprender a manejar el dinero.',
        'Hucha de Lucía en PEPA con disponible, ingresos, ahorro, gastos e impuestos',
      ),
    ],
  },
  {
    tab: 'cumples',
    label: 'Cumpleaños',
    emoji: '🎂',
    screens: [
      screen(
        'bday-1',
        'Próximos',
        'Ningún cumpleaños se olvida',
        'Los cumpleaños de la familia y de los contactos, ordenados por fecha, con favoritos para no fallar.',
        'Lista de próximos cumpleaños de la familia en PEPA',
      ),
    ],
  },
  {
    tab: 'contactos',
    label: 'Contactos',
    emoji: '📇',
    screens: [
      screen(
        'cont-2',
        'Agenda',
        'La agenda de la familia',
        'Colegio, médico, emergencias, abuelos, el fontanero… con teléfono y notas, y buscador.',
        'Agenda de contactos de PEPA por categorías: colegio, médico, emergencia y familia',
      ),
    ],
  },
  {
    tab: 'documentos',
    label: 'Documentos',
    emoji: '📁',
    screens: [
      screen(
        'doc-1',
        'Carpetas',
        'Los papeles, en su sitio',
        'Carpetas por categoría (casa, educación, familia, salud) y una por cada miembro.',
        'Carpetas de documentos de PEPA por categorías',
      ),
      screen(
        'doc-2-carpeta',
        'Por persona',
        'Documentos por persona',
        'Dentro de cada carpeta, los documentos de cada miembro: DNI, seguros, cartilla médica…',
        'Carpeta de documentos de PEPA organizada por miembros de la familia',
      ),
    ],
  },
  {
    tab: 'mas',
    label: 'Y más',
    emoji: '✨',
    screens: [
      screen(
        'cfg-1',
        'Configuración',
        'A vuestra manera',
        'Se reordena el menú, se cambian colores, se activa el PIN de la app y se ajusta la economía.',
        'Configuración de PEPA: menú, colores, familia, economía y seguridad',
      ),
      screen(
        'help-1',
        'Ayuda',
        'Ayuda dentro de la app',
        'Una guía con buscador que explica cada sección sin salir de PEPA.',
        'Pantalla de ayuda de PEPA con buscador y secciones',
      ),
    ],
  },
]

export const DEMO_TABS: readonly { id: DemoTab; label: string; emoji: string }[] = DEMO_MODULES.map((m) => ({
  id: m.tab,
  label: m.label,
  emoji: m.emoji,
}))

// Todas las pantallas en orden (para el contador "Pantalla N de M").
export const DEMO_SCREENS: readonly { tab: DemoTab; index: number; screen: DemoScreen }[] = DEMO_MODULES.flatMap((m) =>
  m.screens.map((s, index) => ({ tab: m.tab, index, screen: s })),
)

export interface DemoState {
  tab: DemoTab
  screen: number
}

// Con una zona (entrada desde una guía) se abre directamente en ese módulo.
export function initialState(tab: DemoTab | null = null): DemoState {
  return { tab: tab ?? 'inicio', screen: 0 }
}

export type DemoAction =
  | { type: 'goTab'; tab: DemoTab }
  | { type: 'goScreen'; screen: number }
  | { type: 'next' }
  | { type: 'prev' }

export function moduleOf(tab: DemoTab): DemoModule {
  return DEMO_MODULES.find((m) => m.tab === tab) ?? DEMO_MODULES[0]
}

// Posición global (0-based) de la pantalla actual entre todas las de la demo.
export function globalIndex(state: DemoState): number {
  const i = DEMO_SCREENS.findIndex((s) => s.tab === state.tab && s.index === state.screen)
  return i < 0 ? 0 : i
}

function stateAt(i: number): DemoState {
  const target = DEMO_SCREENS[Math.max(0, Math.min(DEMO_SCREENS.length - 1, i))]
  return { tab: target.tab, screen: target.index }
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'goTab':
      return { tab: action.tab, screen: 0 }
    case 'goScreen': {
      const last = moduleOf(state.tab).screens.length - 1
      return { tab: state.tab, screen: Math.max(0, Math.min(last, action.screen)) }
    }
    case 'next':
      return stateAt(globalIndex(state) + 1)
    case 'prev':
      return stateAt(globalIndex(state) - 1)
  }
}
