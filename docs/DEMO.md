# La demo pública y sus capturas

`/demo/` es un recorrido por **6 capturas reales de la app de PEPA**, hechas con una familia
ficticia. No hay nada que guardar ni ninguna conexión a datos: son imágenes fijas.

| Pantalla de la demo | Archivo | Qué se ve en la app |
|---|---|---|
| Inicio | `public/screenshots/home.webp` | Portada con el saludo y la lista de la compra |
| Calendario | `public/screenshots/calendario.webp` | Septiembre 2026, un punto de color por persona |
| Compras | `public/screenshots/compras.webp` | Lista por tiendas, 3 de 9 comprados |
| Economía | `public/screenshots/economia.webp` | Ingresos, gastos, ahorro y conclusiones de Pepa |
| Cocina | `public/screenshots/cocina.webp` | Menú semanal (desayuno, comida, merienda, cena) |
| Cumpleaños | `public/screenshots/eventos.webp` | Cumpleaños de Hugo: cuenta atrás, tareas, invitados |

Las mismas imágenes son las **imágenes por defecto de la portada** (el móvil de arriba y el
carrusel de más abajo). Desde `/admin` → **Imágenes** se pueden sustituir por otras sin tocar código.
Documentos no tiene captura todavía y sigue con su ilustración de ejemplo.

## De dónde salen los datos

De la cuenta de pruebas **"Familia Demo"** de la app (nunca de una familia real), rellena con la
familia ficticia **Los Navarro**: Elena, Carlos, Lucía (10) y Hugo (6, cumple el 2 de octubre),
con la semana del 21 al 27 de septiembre de 2026, una lista de la compra, el menú, el mes de
septiembre en Economía y el cumpleaños de Hugo.

> El administrador de esa cuenta se llamaba "Demo" y ahora se llama "Elena".

## Cómo repetirlas (por ejemplo, si la app cambia de aspecto)

1. Entra en la app con la cuenta **Familia Demo**, en un móvil o con el navegador a **375 × 812**.
2. Ve a cada pantalla, **arriba del todo, sin desplazar**, y haz la captura.
3. Conviértelas a **WebP de 750 px de ancho** (proporción 9 : 19,5; cada una debe pesar entre
   20 y 400 KB) y sustituye los archivos de `public/screenshots/`.
4. `npm test` comprueba que existen, que son WebP y que miden 750 × 1624.
5. **Revisa cada imagen antes de publicar:** solo deben verse datos ficticios (nombres de la
   familia de ejemplo, ningún email, ninguna cuenta bancaria ni foto real).

Las fechas de los datos son de septiembre de 2026; si se rehacen más adelante, actualiza las
fechas de la familia de ejemplo para que el calendario y el menú tengan planes de esa semana.
