import { useState } from 'react'
import type { Cat, Lang, Mode, Prepared } from '../types'
import { CATS, EXAM_PASS } from '../types'
import { CAT_NAMES, t } from '../i18n'

interface Props {
  lang: Lang
  mode: Mode
  items: Prepared[]
  answers: (number | null)[]
  onHome: () => void
  onNewExam: () => void
  onRetryWrong: () => void
}

export default function Result({ lang, mode, items, answers, onHome, onNewExam, onRetryWrong }: Props) {
  const [onlyWrong, setOnlyWrong] = useState(true)
  const isRight = (i: number) => answers[i] !== null && items[i].order[answers[i]!] === items[i].q.correct
  const score = items.filter((_, i) => isRight(i)).length
  const answered = answers.filter((a) => a !== null).length
  const passed = score >= EXAM_PASS
  const wrongCount = items.length - score

  const perCat = CATS.map((c) => {
    const idxs = items.map((it, i) => (it.q.cat === c ? i : -1)).filter((i) => i >= 0)
    return { c, n: idxs.length, r: idxs.filter(isRight).length }
  }).filter((x) => x.n > 0)

  const shown = items.map((it, i) => ({ it, i })).filter(({ i }) => !onlyWrong || !isRight(i))

  return (
    <div className="page">
      <header className="top">
        <button className="link" onClick={onHome}>← {t(lang, 'home')}</button>
      </header>

      <section className={`card result ${mode === 'exam' ? (passed ? 'pass' : 'fail') : ''}`}>
        <h1>{mode === 'exam' ? (passed ? t(lang, 'passed') : t(lang, 'failed')) : t(lang, 'result')}</h1>
        <p className="score">{score} / {items.length}</p>
        {mode === 'exam' ? <p className="muted">{t(lang, 'passNote')}</p> : <p className="muted">{t(lang, 'studyDone')}</p>}
        {mode === 'exam' && answered < items.length && (
          <p className="muted">{items.length - answered} {t(lang, 'unanswered').toLowerCase()}</p>
        )}
        <div className="actions">
          {wrongCount > 0 && <button className="btn" onClick={onRetryWrong}>{t(lang, 'retryWrong')} ({wrongCount})</button>}
          {mode === 'exam' && <button className="btn ghost" onClick={onNewExam}>{t(lang, 'newExam')}</button>}
        </div>
      </section>

      {perCat.length > 1 && (
        <section className="card">
          <h2>{t(lang, 'perArea')}</h2>
          <ul className="bars">
            {perCat.map(({ c, n, r }) => (
              <li key={c}>
                <span>{CAT_NAMES[c as Cat][lang]}</span>
                <div className="bar"><div style={{ width: `${(100 * r) / n}%` }} /></div>
                <span>{r}/{n}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="reviewhead">
          <h2>{t(lang, 'review')}</h2>
          <div className="langs">
            <button className={onlyWrong ? 'on' : ''} onClick={() => setOnlyWrong(true)}>{t(lang, 'showWrong')}</button>
            <button className={!onlyWrong ? 'on' : ''} onClick={() => setOnlyWrong(false)}>{t(lang, 'showAll')}</button>
          </div>
        </div>
        {shown.length === 0 && <p className="muted">{t(lang, 'noWrong')}</p>}
        {shown.map(({ it, i }) => {
          const q = it.q[lang]
          const a = answers[i]
          return (
            <article key={it.q.id} className={`card review ${isRight(i) ? 'ok' : 'bad'}`}>
              <div className="cat">{i + 1}. {CAT_NAMES[it.q.cat][lang]}</div>
              {it.q.sign && <div className="signimg small"><img src={`/signs/${it.q.sign}`} alt="" /></div>}
              <h3>{q.q}</h3>
              <p>
                <strong>{t(lang, 'yourAnswer')}:</strong>{' '}
                {a === null ? <em>{t(lang, 'unanswered')}</em> : q.a[it.order[a]]}
              </p>
              {!isRight(i) && (
                <p><strong>{t(lang, 'correctAnswer')}:</strong> {q.a[it.q.correct]}</p>
              )}
              <p className="muted"><strong>{t(lang, 'explanation')}:</strong> {q.e}</p>
            </article>
          )
        })}
      </section>
    </div>
  )
}
