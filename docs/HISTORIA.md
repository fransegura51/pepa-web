# La página «Cómo empezó todo» (`/historia`)

Cuenta la historia real del nacimiento de PEPA. En la navegación aparece como **Historia**
y en el pie como **Cómo empezó todo**.

## Dónde está cada cosa

| Qué | Archivo |
|---|---|
| Página (estructura y textos largos) | `src/pages/Historia.tsx` |
| Etapas de la línea temporal, frases, listas y huecos de fotos | `src/config/historia.ts` |
| Marco de foto (real o hueco reservado) | `src/components/HistoriaFoto.tsx` |
| Estilos (todo con prefijo `hs-`) | `src/styles/historia.css` |
| SEO propio en el HTML estático (título, descripción, Open Graph, datos estructurados) | `scripts/route-meta.mjs` |
| Fotos reales | `src/assets/historia/` (ver el README de esa carpeta) |

## Fotos: cómo se sustituye un hueco

Los 7 huecos (`historia-familia`, `historia-abuela-pepa`, `historia-inicios`,
`historia-primera-pepa`, `historia-desarrollo`, `historia-evolucion`, `historia-paco`) se ven como
un marco cálido con una nota escrita a mano. Para poner la foto real basta con guardar
`src/assets/historia/<hueco>.jpg` (o png/webp/avif). No hay que cambiar código.

El personaje oficial de PEPA se muestra con la referencia facial oficial
(`src/assets/brand/references/pepa-face-reference-official.jpg`), sin modificarla.

## Vídeos de Paco

La sección «Y entonces apareció Paco…» muestra los primeros vídeos que haya publicados en el
panel (`/admin` → Vídeos), con las mismas tarjetas que la portada. Si no hay ninguno, muestra el
hueco `historia-paco`.

## SEO

La web es una SPA: todas las rutas comparten el mismo `index.html`. Para que buscadores y redes
sociales vean el título, la descripción, el `canonical`, Open Graph y los datos estructurados de esta
página sin ejecutar JavaScript, `scripts/generate-static-routes.mjs` genera `dist/historia/index.html`
con esos datos (`scripts/route-meta.mjs`). Si se cambian el título o la descripción en
`src/config/historia.ts`, hay que cambiarlos también en `route-meta.mjs` (una prueba avisa si no
coinciden).
