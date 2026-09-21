# Imágenes de «Cómo empezó todo» (/historia)

Esta carpeta está vacía a propósito. Las imágenes pueden ser fotos, ilustraciones o imágenes en 3D.

Para poner una imagen, guarda aquí un archivo con **exactamente** el nombre del hueco
(`.jpg`, `.jpeg`, `.png`, `.webp` o `.avif`). No hay que tocar código: al compilar, la web
sustituye el hueco reservado por tu imagen.

| Nombre del archivo | Qué va aquí | Proporción del marco |
|---|---|---|
| `historia-familia` | Imagen de la familia (portada de la página) | 4:5 (vertical) |
| `historia-abuela-pepa` | Imagen de la abuela que inspiró a PEPA | 4:5 (vertical) |
| `historia-inicios` | Imágenes o notas de los primeros días | 4:3 |
| `historia-primera-pepa` | La primera PEPA (solo su cara). Se muestra en un marco redondo | 1:1 (cuadrada) |
| `historia-desarrollo` | Un momento del desarrollo (junto a `historia-inicios`) | 4:3 |
| `historia-evolucion` | PEPA de cuerpo entero: cómo evolucionó | 2:3 (vertical) |
| `historia-paco` | Fotograma de los vídeos de Paco (solo se usa si no hay vídeos cargados en el panel) | 16:9 |

Ejemplo: `src/assets/historia/historia-abuela-pepa.jpg`.

Consejos: recorta la foto a la proporción de la tabla y guárdala a unos 1200 píxeles de ancho
(bien optimizada, mejor por debajo de 300 KB). El texto alternativo de cada foto se cambia en
`src/config/historia.ts` (`FOTOS`).
