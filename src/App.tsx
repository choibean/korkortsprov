import { useEffect, useState } from 'react'
import type { Cat, Mode, Prepared, Question } from './types'
import { CATS, EXAM_MIX, EXAM_PASS, EXAM_TOTAL } from './types'
import { ALL_QUESTIONS } from './data'
import { loadStats, recordAnswers, recordExam, recordTest, saveStats, type Stats } from './storage'
import { useRoute, navigate, buildPath, type Route } from './router'
import { buildFixedTest } from './tests'
import { useSeo } from './seo'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Result from './components/Result'
import Info from './components/Info'
import SignGallery from './components/SignGallery'

const STUDY_SIZE = 25

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function prepare(q: Question): Prepared {
  return { q, order: shuffle(q.sv.a.map((_, i) => i)) }
}

function buildExam(all: Question[]): Prepared[] {
  const pools = new Map<Cat, Question[]>()
  for (const c of CATS) pools.set(c, shuffle(all.filter((q) => q.cat === c)))
  const picked: Question[] = []
  for (const c of CATS) picked.push(...pools.get(c)!.splice(0, EXAM_MIX[c]))
  const rest = shuffle(CATS.flatMap((c) => pools.get(c)!))
  while (picked.length < EXAM_TOTAL && rest.length) picked.push(rest.pop()!)
  return shuffle(picked).map(prepare)
}

/** Study session: prefer unseen questions, then the ones answered wrong most often. */
function buildStudy(all: Question[], stats: Stats, cat?: Cat): Prepared[] {
  const pool = cat ? all.filter((q) => q.cat === cat) : all
  const score = (q: Question) => {
    const s = stats.seen[q.id]
    if (!s) return -1
    return s.c / (s.c + s.w)
  }
  return shuffle(pool)
    .sort((a, b) => score(a) - score(b))
    .slice(0, STUDY_SIZE)
    .map(prepare)
}

function buildWrong(all: Question[], stats: Stats): Prepared[] {
  return shuffle(all.filter((q) => (stats.seen[q.id]?.w ?? 0) > 0 && stats.seen[q.id].w >= stats.seen[q.id].c))
    .slice(0, STUDY_SIZE)
    .map(prepare)
}

type SessionKind =
  | { type: 'exam' }
  | { type: 'test'; n: number }
  | { type: 'study'; cat?: Cat }
  | { type: 'wrong' }

function sessionKindFor(route: Route): SessionKind | null {
  switch (route.name) {
    case 'exam':
      return { type: 'exam' }
    case 'test':
      return { type: 'test', n: route.n }
    case 'study':
      return { type: 'study', cat: route.cat }
    case 'wrong':
      return { type: 'wrong' }
    default:
      return null
  }
}

function buildSessionItems(kind: SessionKind, all: Question[], stats: Stats): Prepared[] {
  switch (kind.type) {
    case 'exam':
      return buildExam(all)
    case 'test':
      return buildFixedTest(all, kind.n).map(prepare)
    case 'study':
      return buildStudy(all, stats, kind.cat)
    case 'wrong':
      return buildWrong(all, stats)
  }
}

function modeFor(kind: SessionKind): Mode {
  return kind.type === 'exam' ? 'exam' : kind.type === 'test' ? 'test' : 'study'
}

export default function App() {
  const { lang, route, navId } = useRoute()
  const [stats, setStats] = useState<Stats>(loadStats)
  const [items, setItems] = useState<Prepared[] | null>(null)
  const [answers, setAnswers] = useState<(number | null)[] | null>(null)

  const kind = sessionKindFor(route)

  useEffect(() => {
    const k = sessionKindFor(route)
    if (!k) {
      setItems(null)
      setAnswers(null)
      return
    }
    setItems(buildSessionItems(k, ALL_QUESTIONS, stats))
    setAnswers(null)
    window.scrollTo(0, 0)
    // Rebuild only when the route (or a forced re-navigation) actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, navId])

  useSeo(lang, route)

  const updateStats = (s: Stats) => {
    setStats(s)
    saveStats(s)
  }

  const finish = (answersIn: (number | null)[]) => {
    if (!items || !kind) return
    const results = items.map((it, i) => ({
      id: it.q.id,
      correct: answersIn[i] !== null && it.order[answersIn[i]!] === it.q.correct,
    }))
    let s = recordAnswers(stats, results.filter((_, i) => answersIn[i] !== null))
    const score = results.filter((r) => r.correct).length
    if (kind.type === 'exam') {
      s = recordExam(s, { date: new Date().toISOString(), score, total: items.length, passed: score >= EXAM_PASS })
    } else if (kind.type === 'test') {
      s = recordTest(s, kind.n, score, items.length, score >= EXAM_PASS)
    }
    updateStats(s)
    setAnswers(answersIn)
    window.scrollTo(0, 0)
  }

  const wrongCount = ALL_QUESTIONS.filter(
    (q) => (stats.seen[q.id]?.w ?? 0) > 0 && stats.seen[q.id].w >= stats.seen[q.id].c,
  ).length

  if (items && kind) {
    const mode = modeFor(kind)
    const testNumber = kind.type === 'test' ? kind.n : undefined
    if (answers) {
      return <Result lang={lang} mode={mode} testNumber={testNumber} items={items} answers={answers} />
    }
    return (
      <Quiz
        key={items.map((i) => i.q.id).join(',')}
        lang={lang}
        mode={mode}
        testNumber={testNumber}
        items={items}
        onFinish={finish}
        onQuit={() => navigate(buildPath(lang, { name: 'home' }))}
      />
    )
  }

  switch (route.name) {
    case 'info':
      return <Info lang={lang} />
    case 'signs':
      return <SignGallery lang={lang} />
    default:
      return (
        <Home
          lang={lang}
          stats={stats}
          total={ALL_QUESTIONS.length}
          wrongCount={wrongCount}
          onReset={() => updateStats({ seen: {}, exams: [], tests: {} })}
        />
      )
  }
}
