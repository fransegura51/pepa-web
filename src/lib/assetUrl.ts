// Vite reescribe automáticamente las rutas de public/ dentro de
// index.html (favicon, etc.), pero NO las que van sueltas como texto
// dentro de un componente — un <img src="/screenshots/x.svg"> se queda
// apuntando a la raíz del dominio (fransegura51.github.io/x.svg), no a
// /pepa-web/x.svg. Bug real: las imágenes salían rotas en producción
// aunque en local funcionaban (ahí base es '/', coincide por casualidad).
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
