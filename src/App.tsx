import { useState } from 'react'
import type { Cat, Lang, Mode, Prepared, Question } from './types'
import { CATS, EXAM_MIX, EXAM_PASS, EXAM_TOTAL } from './types'
import { ALL_QUESTIONS } from './data'
import { loadLang, loadStats, recordAnswers, recordExam, saveLang, saveStats, type Stats } from './storage'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Result from './components/Result'
import Info from './components/Info'
import SignGallery from './components/SignGallery'

type View =
  | { name: 'home' }
  | { name: 'quiz'; mode: Mode; items: Prepared[] }
  | { name: 'result'; mode: Mode; items: Prepared[]; answers: (number | null)[] }
  | { name: 'info' }
  | { name: 'signs' }

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

export default function App() {
  const [lang, setLangState] = useState<Lang>(loadLang)
  const [stats, setStats] = useState<Stats>(loadStats)
  const [view, setView] = useState<View>({ name: 'home' })

  const setLang = (l: Lang) => {
    setLangState(l)
    saveLang(l)
    document.documentElement.lang = l
  }

  const updateStats = (s: Stats) => {
    setStats(s)
    saveStats(s)
  }

  const finish = (mode: Mode, items: Prepared[], answers: (number | null)[]) => {
    const results = items.map((it, i) => ({
      id: it.q.id,
      correct: answers[i] !== null && it.order[answers[i]!] === it.q.correct,
    }))
    let s = recordAnswers(stats, results.filter((_, i) => answers[i] !== null))
    if (mode === 'exam') {
      const score = results.filter((r) => r.correct).length
      s = recordExam(s, { date: new Date().toISOString(), score, total: items.length, passed: score >= EXAM_PASS })
    }
    updateStats(s)
    setView({ name: 'result', mode, items, answers })
    window.scrollTo(0, 0)
  }

  const go = (v: View) => {
    setView(v)
    window.scrollTo(0, 0)
  }

  const wrongCount = ALL_QUESTIONS.filter(
    (q) => (stats.seen[q.id]?.w ?? 0) > 0 && stats.seen[q.id].w >= stats.seen[q.id].c,
  ).length

  switch (view.name) {
    case 'quiz':
      return (
        <Quiz
          key={view.items.map((i) => i.q.id).join(',')}
          lang={lang}
          mode={view.mode}
          items={view.items}
          onFinish={(answers) => finish(view.mode, view.items, answers)}
          onQuit={() => go({ name: 'home' })}
        />
      )
    case 'result':
      return (
        <Result
          lang={lang}
          mode={view.mode}
          items={view.items}
          answers={view.answers}
          onHome={() => go({ name: 'home' })}
          onNewExam={() => go({ name: 'quiz', mode: 'exam', items: buildExam(ALL_QUESTIONS) })}
          onRetryWrong={() => {
            const wrong = view.items.filter((it, i) => view.answers[i] === null || it.order[view.answers[i]!] !== it.q.correct)
            go({ name: 'quiz', mode: 'study', items: shuffle(wrong.map((w) => prepare(w.q))) })
          }}
        />
      )
    case 'info':
      return <Info lang={lang} onBack={() => go({ name: 'home' })} />
    case 'signs':
      return <SignGallery lang={lang} onBack={() => go({ name: 'home' })} />
    default:
      return (
        <Home
          lang={lang}
          setLang={setLang}
          stats={stats}
          total={ALL_QUESTIONS.length}
          wrongCount={wrongCount}
          onExam={() => go({ name: 'quiz', mode: 'exam', items: buildExam(ALL_QUESTIONS) })}
          onStudy={(cat) => go({ name: 'quiz', mode: 'study', items: buildStudy(ALL_QUESTIONS, stats, cat) })}
          onWrong={() => go({ name: 'quiz', mode: 'study', items: buildWrong(ALL_QUESTIONS, stats) })}
          onSigns={() => go({ name: 'signs' })}
          onInfo={() => go({ name: 'info' })}
          onReset={() => updateStats({ seen: {}, exams: [] })}
        />
      )
  }
}
