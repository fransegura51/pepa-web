# Fotos reales de «Cómo empezó todo» (/historia)

Esta carpeta está vacía a propósito: no hay que inventar ninguna foto.

Para poner una foto real, guarda aquí una imagen con **exactamente** el nombre del hueco
(`.jpg`, `.jpeg`, `.png`, `.webp` o `.avif`). No hay que tocar código: al compilar, la web
sustituye el hueco reservado por tu imagen.

| Nombre del archivo | Qué va aquí | Proporción del marco |
|---|---|---|
| `historia-familia` | Foto real de la familia (portada de la página) | 4:5 (vertical) |
| `historia-abuela-pepa` | Foto real de la abuela que inspiró a PEPA | 4:5 (vertical) |
| `historia-inicios` | Fotos o notas de los primeros días | 4:3 |
| `historia-primera-pepa` | Captura de la primera versión de la app | 4:3 |
| `historia-desarrollo` | Un momento del desarrollo | 4:3 |
| `historia-evolucion` | Cómo ha cambiado el diseño | 4:3 |
| `historia-paco` | Fotograma de los vídeos de Paco (solo se usa si no hay vídeos cargados en el panel) | 16:9 |

Ejemplo: `src/assets/historia/historia-abuela-pepa.jpg`.

Consejos: recorta la foto a la proporción de la tabla y guárdala a unos 1200 píxeles de ancho
(bien optimizada, mejor por debajo de 300 KB). El texto alternativo de cada foto se cambia en
`src/config/historia.ts` (`FOTOS`).
