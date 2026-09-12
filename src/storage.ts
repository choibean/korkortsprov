import type { Lang } from './types'

export interface ExamRecord {
  date: string
  score: number
  total: number
  passed: boolean
}

export interface TestRecord {
  best: number
  total: number
  attempts: number
  passed: boolean
  last: string
}

export interface Stats {
  seen: Record<string, { c: number; w: number }>
  exams: ExamRecord[]
  /** Fixed practice tests (1..NUM_TESTS), keyed by test number as a string. */
  tests: Record<string, TestRecord>
}

const KEY = 'korkortsprov.stats.v1'
const LANG_KEY = 'korkortsprov.lang'

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<Stats>
      if (s && s.seen && Array.isArray(s.exams)) {
        return { seen: s.seen, exams: s.exams, tests: s.tests ?? {} }
      }
    }
  } catch {
    /* ignore */
  }
  return { seen: {}, exams: [], tests: {} }
}

export function saveStats(s: Stats) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

export function recordAnswers(s: Stats, results: { id: string; correct: boolean }[]): Stats {
  const seen = { ...s.seen }
  for (const r of results) {
    const cur = seen[r.id] ?? { c: 0, w: 0 }
    seen[r.id] = r.correct ? { c: cur.c + 1, w: cur.w } : { c: cur.c, w: cur.w + 1 }
  }
  return { ...s, seen }
}

export function recordExam(s: Stats, rec: ExamRecord): Stats {
  return { ...s, exams: [...s.exams, rec].slice(-20) }
}

export function recordTest(s: Stats, n: number, score: number, total: number, passed: boolean): Stats {
  const key = String(n)
  const cur = s.tests[key]
  const rec: TestRecord = {
    best: cur ? Math.max(cur.best, score) : score,
    total,
    attempts: (cur?.attempts ?? 0) + 1,
    passed: (cur?.passed ?? false) || passed,
    last: new Date().toISOString(),
  }
  return { ...s, tests: { ...s.tests, [key]: rec } }
}

/** The user's explicitly saved language preference, or null if they never chose one. */
export function loadSavedLang(): Lang | null {
  try {
    const l = localStorage.getItem(LANG_KEY)
    if (l === 'sv' || l === 'en') return l
  } catch {
    /* ignore */
  }
  return null
}

export function saveLang(l: Lang) {
  try {
    localStorage.setItem(LANG_KEY, l)
  } catch {
    /* ignore */
  }
}
