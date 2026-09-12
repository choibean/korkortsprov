import type { Question } from './types'
import { CATS, EXAM_MIX, EXAM_TOTAL } from './types'

/** Number of numbered fixed practice tests (Prov 1..NUM_TESTS). */
export const NUM_TESTS = 8

/** Deterministic PRNG (mulberry32): same seed always yields the same sequence. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Memoised per (test number, bank size) so earlier tests are only computed once. */
const cache = new Map<string, Question[]>()

/**
 * Build fixed practice test n (1-based) deterministically from the full question bank.
 * Tests 1..n-1 are computed first (and memoised) so each question's prior-test usage
 * count can be minimised: lower-usage questions are preferred, ties broken by a seeded
 * shuffle. This keeps early tests close to disjoint and spreads reuse evenly as the
 * bank grows or is exhausted.
 */
export function buildFixedTest(all: Question[], n: number): Question[] {
  const cacheKey = `${n}:${all.length}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const sorted = all.slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  const rng = mulberry32(n * 7919 + 13)

  const usage = new Map<string, number>()
  for (let earlier = 1; earlier < n; earlier++) {
    for (const q of buildFixedTest(all, earlier)) {
      usage.set(q.id, (usage.get(q.id) ?? 0) + 1)
    }
  }
  const usageOf = (q: Question) => usage.get(q.id) ?? 0

  const picked: Question[] = []
  const pickedIds = new Set<string>()

  const lowestUsageFirst = (pool: Question[]) =>
    seededShuffle(pool, rng).sort((a, b) => usageOf(a) - usageOf(b))

  for (const c of CATS) {
    const pool = sorted.filter((q) => q.cat === c)
    const ordered = lowestUsageFirst(pool)
    for (const q of ordered.slice(0, EXAM_MIX[c])) {
      picked.push(q)
      pickedIds.add(q.id)
    }
  }

  if (picked.length < EXAM_TOTAL) {
    const remaining = sorted.filter((q) => !pickedIds.has(q.id))
    const ordered = lowestUsageFirst(remaining)
    for (const q of ordered) {
      if (picked.length >= EXAM_TOTAL) break
      picked.push(q)
      pickedIds.add(q.id)
    }
  }

  const result = seededShuffle(picked, rng).slice(0, EXAM_TOTAL)
  cache.set(cacheKey, result)
  return result
}
