// Comprueba las guías sin compilar la web: "npm run guias:comprobar".
// Útil mientras se redacta: dice qué falta antes de poder publicar.
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadGuides, validateGuides } from './lib.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const guides = loadGuides(join(root, 'content', 'guias'))
const errors = validateGuides(guides, new Date().toISOString().slice(0, 10))

for (const g of guides) console.log(`${g.estado === 'publicado' ? '✔ publicada ' : '· borrador  '} ${g.slug}`)
if (errors.length > 0) {
  console.error(`\n${errors.length} problema(s):\n - ${errors.join('\n - ')}`)
  process.exit(1)
}
console.log(`\nTodo correcto: ${guides.length} guía(s).`)
