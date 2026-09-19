import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Garantía principal de la demo: NO puede llegar a datos reales.
// Se comprueba de forma estática, recorriendo TODO lo que importa la
// demo (también de forma transitiva).

const SRC = resolve(__dirname, '../../src')
const DEMO_DIR = join(SRC, 'demo')

// Solo se inspecciona el código: los comentarios pueden decir "no usa
// Supabase" sin que eso sea un uso.
function code(file: string): string {
  return readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function demoFiles(): string[] {
  return readdirSync(DEMO_DIR)
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .map((f) => join(DEMO_DIR, f))
}

function importsOf(source: string): string[] {
  const found: string[] = []
  const re = /(?:import|export)\s[^'"]*?from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g
  for (const m of source.matchAll(re)) found.push(m[1] ?? m[2] ?? m[3])
  return found
}

function resolveLocal(spec: string): string | null {
  if (!spec.startsWith('@/')) return null
  const base = join(SRC, spec.slice(2))
  for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

// Cierre transitivo de imports locales + paquetes externos usados.
function closure(entries: string[]) {
  const files = new Set<string>()
  const packages = new Set<string>()
  const queue = [...entries]
  while (queue.length) {
    const file = queue.pop()!
    if (files.has(file)) continue
    files.add(file)
    for (const spec of importsOf(readFileSync(file, 'utf8'))) {
      const local = resolveLocal(spec)
      if (local) queue.push(local)
      else if (!spec.startsWith('.') && !spec.startsWith('@/')) packages.add(spec)
    }
  }
  return { files, packages }
}

describe('aislamiento de la demo', () => {
  const { files, packages } = closure(demoFiles())

  it('recorre de verdad los archivos de la demo', () => {
    expect(files.size).toBeGreaterThanOrEqual(6)
  })

  it('no importa Supabase ni ningún módulo que lo use', () => {
    for (const file of files) {
      expect(code(file), file).not.toMatch(/supabase/i)
    }
    expect([...packages].some((p) => p.includes('supabase'))).toBe(false)
  })

  it('no importa formularios/leads ni el panel de administración', () => {
    for (const file of files) {
      expect(file.replace(/\\/g, '/')).not.toMatch(/\/(lib\/leads|lib\/admin|pages\/admin|components\/admin|context\/(EditableTexts|Images))/)
    }
  })

  it('no hace llamadas de red ni guarda datos del visitante', () => {
    const forbidden = [/\bfetch\s*\(/, /XMLHttpRequest/, /sendBeacon/, /WebSocket/, /localStorage/, /sessionStorage/, /indexedDB/, /document\.cookie/]
    for (const file of demoFiles()) {
      const src = code(file)
      for (const re of forbidden) expect(src, `${file} ${re}`).not.toMatch(re)
    }
  })

  it('solo depende de react y módulos locales sin red', () => {
    expect([...packages].sort()).toEqual(['react', 'react-dom/client'])
  })

  it('la demo arranca por su propia entrada, sin el arranque ni la App de la web', () => {
    const entry = readFileSync(join(DEMO_DIR, 'main.tsx'), 'utf8')
    expect(entry).not.toMatch(/['"]@\/App['"]|['"]@\/main['"]|react-router/)
    const html = readFileSync(resolve(SRC, '../demo/index.html'), 'utf8')
    expect(html).toContain('/src/demo/main.tsx')
    expect(html).not.toContain('/src/main.tsx')
  })

  it('no enlaza al panel privado', () => {
    for (const file of demoFiles()) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/['"`]\/admin/)
    }
  })
})
