import type { Lang } from './types'

export interface ExamRecord {
  date: string
  score: number
  total: number
  passed: boolean
}

export interface Stats {
  seen: Record<string, { c: number; w: number }>
  exams: ExamRecord[]
}

const KEY = 'korkortsprov.stats.v1'
const LANG_KEY = 'korkortsprov.lang'

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw) as Stats
      if (s && s.seen && Array.isArray(s.exams)) return s
    }
  } catch {
    /* ignore */
  }
  return { seen: {}, exams: [] }
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

export function loadLang(): Lang {
  try {
    const l = localStorage.getItem(LANG_KEY)
    if (l === 'sv' || l === 'en') return l
  } catch {
    /* ignore */
  }
  return navigator.language.toLowerCase().startsWith('sv') ? 'sv' : 'en'
}

export function saveLang(l: Lang) {
  try {
    localStorage.setItem(LANG_KEY, l)
  } catch {
    /* ignore */
  }
}
