// Genera las guías dentro de dist/ (se ejecuta solo tras "npm run build",
// ver "postbuild" en package.json). Con --borradores añade también las
// páginas de los borradores, para revisarlas en local: nunca se hace en
// el despliegue (el CI ejecuta solo "npm run build").
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateSite, loadGuides, tuneFontLinks, validateGuides } from './lib.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const distDir = join(root, 'dist')
const includeDrafts = process.argv.includes('--borradores')

const indexPath = join(distDir, 'index.html')
if (!existsSync(indexPath)) {
  console.error('guias: falta dist/index.html. Ejecuta primero "npm run build".')
  process.exit(1)
}

// Mismos estilos y tipografías que el resto de la web: se leen del
// index.html ya compilado (los nombres de archivo llevan un hash).
const indexHtml = readFileSync(indexPath, 'utf8')
const cssLinks = [...indexHtml.matchAll(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]+"[^>]*>/g)].map((m) => m[0])
const fontLinks = [...indexHtml.matchAll(/<link[^>]*(?:fonts\.googleapis|fonts\.gstatic)[^>]*>/g)].map((m) => m[0])

const guides = loadGuides(join(root, 'content', 'guias'))
const today = new Date().toISOString().slice(0, 10)
const errors = validateGuides(guides, today)
if (errors.length > 0) {
  console.error(`guias: ${errors.length} problema(s) en las guías:\n - ${errors.join('\n - ')}`)
  process.exit(1)
}

const staticSitemapXml = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8')
const { files, published } = generateSite({ guides, staticSitemapXml, ctx: { cssLinks, fontLinks }, includeDrafts })

for (const [rel, content] of Object.entries(files)) {
  const target = join(distDir, rel)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}

const drafts = guides.length - published
console.log(
  `guias: ${published} publicada(s), ${drafts} borrador(es) ${includeDrafts ? '(páginas de borradores GENERADAS en dist/ solo para revisión local)' : '(no se generan)'}; ${Object.keys(files).length} archivo(s) escritos.`,
)
