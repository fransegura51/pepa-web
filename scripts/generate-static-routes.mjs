import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyRouteMeta } from './route-meta.mjs'

// Problema real reportado (Google Search Console): la prueba en vivo de
// https://pepafamilyapp.es/funciones devuelve "404 - No se ha
// encontrado", aunque la home y el sitemap sí funcionan. Causa: GitHub
// Pages no tiene fallback de SPA — una petición directa a /funciones no
// es un archivo real, así que el servidor responde con un 404 HTTP de
// verdad. El truco de public/404.html (ver ese archivo) SÍ redirige y
// pinta la app correcta, pero solo después, por JavaScript — para
// entonces Googlebot ya se quedó con el código de estado 404 de la
// respuesta inicial, que es justo lo que reporta Search Console.
//
// Arreglo mínimo: esta app es 100% client-rendered (mismo index.html
// para cualquier ruta, sin HTML distinto por página) — así que tras
// compilar, se copia ese mismo dist/index.html a dist/<ruta>/index.html
// para cada URL real de public/sitemap.xml. GitHub Pages sirve esa
// ruta entonces como un archivo de verdad, con 200 OK de entrada, y
// React Router pinta la pantalla que toca a partir de la URL, igual
// que siempre. El truco de 404.html se queda intacto como red de
// seguridad para cualquier otra ruta no listada en el sitemap.
const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const distDir = join(root, 'dist')

const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])

const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf8')

let created = 0
for (const loc of locs) {
  const path = new URL(loc).pathname // p. ej. "/", "/funciones"
  if (path === '/' || path === '') continue // la raíz ya es dist/index.html
  const dir = join(distDir, path)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  // Igual para todas, salvo las páginas con SEO propio (scripts/route-meta.mjs).
  writeFileSync(join(dir, 'index.html'), applyRouteMeta(indexHtml, path))
  created++
}

console.log(`generate-static-routes: ${created} rutas del sitemap copiadas a dist/<ruta>/index.html`)
