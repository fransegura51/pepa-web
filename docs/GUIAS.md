# Guías de PEPA (SEO): cómo redactar, revisar, publicar, actualizar y retirar

Las guías son archivos de texto en `content/guias/`, uno por guía. **No hace falta tocar código.**
Al compilar la web, un script las convierte en páginas completas (`/guias/<slug>/`), y genera
el índice `/guias/`, el sitemap y el RSS. Solo salen las que están **publicadas**.

## Ver el estado de las guías

```bash
npm run guias:comprobar
```

Lista cada guía (publicada o borrador) y dice qué falta en cada una.

## 1. Redactar

1. Copia una guía existente y ponle como nombre el `slug` nuevo: `content/guias/mi-guia.md`.
   El `slug` (la parte de la URL) va en minúsculas, con guiones, y **debe coincidir con el nombre del archivo**.
2. Rellena los campos de arriba y escribe el texto debajo con Markdown. Usa `## ` para los apartados
   (el título de la página sale de `titulo`, no pongas `# `).
3. Estado: `borrador`.

Campos (todos obligatorios salvo los marcados):

| Campo | Qué es |
|---|---|
| `titulo` | 10–70 caracteres |
| `slug` | igual que el nombre del archivo |
| `resumen` | 60–300 caracteres; sale como entradilla y en el índice |
| `descripcion` | 70–160 caracteres; es la metadescripción de Google |
| `autor` | p. ej. `Equipo PEPA` |
| `tema` | tema de la guía |
| `intencion` | `informacional`, `comparativa`, `transaccional` o `navegacional` |
| `estado` | `borrador` o `publicado` |
| `principal` | (opcional) `true` si es la guía principal de un tema |
| `relacionadas` | lista de `slug` de otras guías (enlaces internos) |
| `modulos` | módulos de PEPA relacionados: `calendario`, `compras`, `economia`, `cocina`, `eventos`, `documentos`, `tareas` |
| `demo` | zona de la demo a la que lleva la guía: `inicio`, `calendario`, `compras`, `economia`, `cocina`, `cumpleanos` |
| `en_desarrollo` | (opcional) lista de funciones que la guía menciona y **aún no existen**; se avisa en la página |
| `imagen` | (opcional) imagen social de 1200×630 en `public/`, p. ej. `/og/mi-guia.png`; por defecto `/og/pepa-guias.png` |
| `publicado`, `actualizado` | fechas reales `AAAA-MM-DD` (se rellenan al publicar / actualizar) |
| `revisado_por`, `revisado_fecha` | quién revisó la guía y cuándo (obligatorios para publicar) |

Reglas de calidad (el comprobador las exige o las prueba):

- Mínimo 300 palabras. Sin relleno ni artículos repetidos con otro título.
- Nada de estadísticas, testimonios, premios, precios o ventajas inventados.
- Si mencionas algo que PEPA todavía no tiene, ponlo en `en_desarrollo`.
- No copiar ni parafrasear de cerca a otras webs.
- Los enlaces a otras guías (`/guias/otro-slug/`) deben existir.

## 2. Revisar (siempre una persona)

Para ver los borradores tal y como quedarán, **solo en tu ordenador**:

```bash
npm run build
npm run guias:borradores
npm run preview
```

Abre `http://localhost:4173/guias/`. Los borradores llevan un aviso rojo y `noindex`.
Esto **no** se publica: el despliegue solo ejecuta `npm run build`.

Al revisar, comprueba: que es útil, que es cierto, que lo que dice de PEPA existe hoy,
que se ve bien en móvil y que los enlaces a la demo llevan a la zona correcta.

## 3. Publicar

1. En la guía: `estado: publicado`, `publicado: <fecha de hoy>`, `revisado_por: <nombre>`,
   `revisado_fecha: <fecha>`.
2. **Solo al publicar la PRIMERA guía**: en `src/config/site.ts` pon `SHOW_GUIDES_LINK = true`
   (activa el enlace "Guías" en la cabecera y el pie). Una prueba falla si esto no coincide.
3. En `tests/guias/guias.test.ts`, actualiza el número de guías publicadas de la prueba
   «siguen sin publicarse hasta que una persona las revise».
4. `npm run guias:comprobar`, `npm test` y `npm run build`.
5. Sube los cambios a `master`: se despliega solo y la guía entra en el sitemap y el RSS.
6. En Google Search Console, pide la indexación de la URL nueva (opcional, acelera).

## 4. Actualizar

Cambia el texto y pon `actualizado: <fecha de hoy>` (y, si procede, vuelve a poner
`revisado_por` y `revisado_fecha`). El sitemap y los datos estructurados usan esa fecha.
No cambies el `slug`: cambiaría la URL y perderías las visitas.

## 5. Retirar

- **Retirada temporal:** vuelve a `estado: borrador`. Desaparece de la web, del sitemap y del RSS
  en el siguiente despliegue. (Recuerda que quien tenga el enlace verá un 404.)
- **Retirada definitiva:** borra el archivo y quita su `slug` de las `relacionadas` de otras guías
  (el comprobador te avisa). Si tenía visitas, valora redirigir su URL a una guía parecida.

## Cómo se mide el recorrido guía → demo → registro

- El botón de cada guía lleva a `/demo/?zona=<zona>&desde=<slug>`.
- "Crear mi familia" en la demo lleva a la app con `?origen=demo&guia=<slug>`.
- La app anota `signup_origin` y `signup_guide` como metadatos de la cuenta nueva (sin datos personales).
- Para contarlo, en Supabase:

```sql
select raw_user_meta_data->>'signup_guide' as guia, count(*)
from auth.users
where raw_user_meta_data->>'signup_origin' = 'demo'
group by 1 order by 2 desc;
```

- Impresiones y clics en Google: Search Console. La demo no tiene analítica propia ni guarda nada.

## Qué no hace este sistema

- No genera guías automáticamente ni páginas masivas por combinaciones de palabras.
- No usa marcado FAQ (no aporta resultados enriquecidos en la mayoría de webs).
- No toca las páginas antiguas de la web (`/funciones`, `/precios`...), que siguen pintándose
  con JavaScript; prerenderizarlas sería un paso aparte.
