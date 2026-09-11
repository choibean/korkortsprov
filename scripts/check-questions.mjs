// Sanity checks for the question bank: unique ids, valid correct index,
// same option count in both languages, sign files present, no empty text.
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(root, 'src', 'data')
const signDir = join(root, 'public', 'signs')

// Crude but dependency-free: evaluate each data file after stripping TS type annotations.
const files = readdirSync(dataDir).filter((f) => /^(regler|sakerhet|fordon|miljo|person)\.ts$/.test(f))
const errors = []
const ids = new Set()
const counts = {}

for (const f of files) {
  let src = readFileSync(join(dataDir, f), 'utf8')
  src = src.replace(/^import[^\n]*\n/gm, '').replace(/export const (\w+): Question\[\] =/, 'globalThis.__Q =')
  let arr
  try {
    new Function(src)()
    arr = globalThis.__Q
  } catch (e) {
    errors.push(`${f}: could not evaluate: ${e.message}`)
    continue
  }
  for (const q of arr) {
    counts[q.cat] = (counts[q.cat] ?? 0) + 1
    if (ids.has(q.id)) errors.push(`${f}: duplicate id ${q.id}`)
    ids.add(q.id)
    for (const l of ['sv', 'en']) {
      if (!q[l]?.q?.trim()) errors.push(`${q.id}: empty ${l} question`)
      if (!q[l]?.e?.trim()) errors.push(`${q.id}: empty ${l} explanation`)
      if (!Array.isArray(q[l]?.a) || q[l].a.length < 2) errors.push(`${q.id}: ${l} needs at least 2 options`)
      if (q[l]?.a?.some((o) => !String(o).trim())) errors.push(`${q.id}: empty ${l} option`)
    }
    if (q.sv.a.length !== q.en.a.length) errors.push(`${q.id}: option count differs sv=${q.sv.a.length} en=${q.en.a.length}`)
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.sv.a.length) errors.push(`${q.id}: bad correct index ${q.correct}`)
    if (q.sign && !existsSync(join(signDir, q.sign))) errors.push(`${q.id}: missing sign file ${q.sign}`)
  }
}

console.log('questions per area:', counts, 'total:', ids.size)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('OK')
