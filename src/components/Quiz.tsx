import { useEffect, useRef, useState } from 'react'
import type { Lang, Mode, Prepared } from '../types'
import { EXAM_SECONDS } from '../types'
import { CAT_NAMES, t } from '../i18n'

interface Props {
  lang: Lang
  mode: Mode
  /** Set when mode === 'test': which numbered fixed test this is. */
  testNumber?: number
  items: Prepared[]
  onFinish: (answers: (number | null)[]) => void
  onQuit: () => void
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

export default function Quiz({ lang, mode, testNumber, items, onFinish, onQuit }: Props) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => items.map(() => null))
  const [revealed, setRevealed] = useState<boolean[]>(() => items.map(() => false))
  const [flags, setFlags] = useState<Set<number>>(() => new Set())
  const [left, setLeft] = useState(EXAM_SECONDS)
  const answersRef = useRef(answers)
  answersRef.current = answers
  const finishedRef = useRef(false)

  useEffect(() => {
    if (mode === 'study') return
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          if (!finishedRef.current) {
            finishedRef.current = true
            alert(t(lang, 'timeUp'))
            onFinish(answersRef.current)
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const it = items[idx]
  const q = it.q[lang]
  const chosen = answers[idx]
  const isRevealed = mode === 'study' && revealed[idx]
  const isLast = idx === items.length - 1
  const answeredCount = answers.filter((a) => a !== null).length

  const choose = (pos: number) => {
    if (isRevealed) return
    const next = [...answers]
    next[idx] = pos
    setAnswers(next)
    if (mode === 'study') {
      const r = [...revealed]
      r[idx] = true
      setRevealed(r)
    }
  }

  const submit = () => {
    if (finishedRef.current) return
    if (mode !== 'study' && answeredCount < items.length && !confirm(t(lang, 'confirmFinish'))) return
    finishedRef.current = true
    onFinish(answers)
  }

  const quit = () => {
    if (mode === 'study' && answeredCount > 0) {
      // keep what was learned so far
      finishedRef.current = true
      onFinish(answers)
      return
    }
    if (answeredCount === 0 || confirm(t(lang, 'confirmQuit'))) onQuit()
  }

  const toggleFlag = () => {
    const f = new Set(flags)
    if (f.has(idx)) f.delete(idx)
    else f.add(idx)
    setFlags(f)
  }

  return (
    <div className="page quiz">
      <header className="top">
        <button className="link" onClick={quit}>✕ {t(lang, 'quit')}</button>
        <div className="qmeta">
          <span>
            {testNumber ? `${t(lang, 'testLabel')} ${testNumber} · ` : ''}
            {t(lang, 'question')} {idx + 1} {t(lang, 'of')} {items.length}
          </span>
          {mode !== 'study' && (
            <span className={`timer ${left < 300 ? 'low' : ''}`} aria-live="polite">{t(lang, 'timeLeft')} {fmt(left)}</span>
          )}
        </div>
      </header>
      <div className="progress"><div style={{ width: `${((idx + 1) / items.length) * 100}%` }} /></div>

      <article className="card qcard" key={it.q.id}>
        <div className="cat">{CAT_NAMES[it.q.cat][lang]}</div>
        {it.q.sign && (
          <div className="signimg"><img src={`/signs/${it.q.sign}`} alt="" /></div>
        )}
        <h2 className="qtext">{q.q}</h2>
        <div className="options">
          {it.order.map((orig, pos) => {
            let cls = 'opt'
            if (isRevealed) {
              if (orig === it.q.correct) cls += ' right'
              else if (chosen === pos) cls += ' wrong'
            } else if (chosen === pos) cls += ' sel'
            return (
              <button key={orig} className={cls} onClick={() => choose(pos)} disabled={isRevealed}>
                <span className="letter">{String.fromCharCode(65 + pos)}</span>
                <span>{q.a[orig]}</span>
              </button>
            )
          })}
        </div>
        {isRevealed && (
          <div className={`expl ${it.order[chosen!] === it.q.correct ? 'ok' : 'bad'}`}>
            <strong>{it.order[chosen!] === it.q.correct ? t(lang, 'correct') : t(lang, 'wrong')}</strong>
            <p>{q.e}</p>
          </div>
        )}
      </article>

      <div className="nav">
        <button className="btn ghost" onClick={() => setIdx(idx - 1)} disabled={idx === 0}>{t(lang, 'previous')}</button>
        {mode !== 'study' && (
          <button className={`btn ghost ${flags.has(idx) ? 'flagged' : ''}`} onClick={toggleFlag}>
            {flags.has(idx) ? '⚑ ' + t(lang, 'flagged') : '⚐ ' + t(lang, 'flag')}
          </button>
        )}
        {isLast ? (
          <button className="btn" onClick={submit} disabled={mode === 'study' && !isRevealed}>{t(lang, 'finish')}</button>
        ) : (
          <button className="btn" onClick={() => setIdx(idx + 1)} disabled={mode === 'study' && !isRevealed}>{t(lang, 'next')}</button>
        )}
      </div>

      {mode !== 'study' && (
        <div className="grid" aria-label="Navigator">
          {items.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === idx ? 'cur' : ''} ${answers[i] !== null ? 'done' : ''} ${flags.has(i) ? 'flag' : ''}`}
              onClick={() => setIdx(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      {mode !== 'study' && !isLast && (
        <p className="center"><button className="link" onClick={submit}>{t(lang, 'finish')} ({answeredCount}/{items.length})</button></p>
      )}
    </div>
  )
}
