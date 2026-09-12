import { useState } from 'react'
import type { Cat, Lang, Mode, Prepared } from '../types'
import { CATS, EXAM_PASS } from '../types'
import { CAT_NAMES, t } from '../i18n'
import { buildPath } from '../router'
import { NUM_TESTS } from '../tests'
import Link from './Link'

interface Props {
  lang: Lang
  mode: Mode
  /** Set when mode === 'test': which numbered fixed test this is. */
  testNumber?: number
  items: Prepared[]
  answers: (number | null)[]
}

export default function Result({ lang, mode, testNumber, items, answers }: Props) {
  const [onlyWrong, setOnlyWrong] = useState(true)
  const isRight = (i: number) => answers[i] !== null && items[i].order[answers[i]!] === items[i].q.correct
  const score = items.filter((_, i) => isRight(i)).length
  const answered = answers.filter((a) => a !== null).length
  const isScored = mode === 'exam' || mode === 'test'
  const passed = isScored && score >= EXAM_PASS
  const wrongCount = items.length - score

  const heading = mode === 'test'
    ? `${t(lang, 'testLabel')} ${testNumber}`
    : isScored
      ? passed ? t(lang, 'passed') : t(lang, 'failed')
      : t(lang, 'result')

  const perCat = CATS.map((c) => {
    const idxs = items.map((it, i) => (it.q.cat === c ? i : -1)).filter((i) => i >= 0)
    return { c, n: idxs.length, r: idxs.filter(isRight).length }
  }).filter((x) => x.n > 0)

  const shown = items.map((it, i) => ({ it, i })).filter(({ i }) => !onlyWrong || !isRight(i))

  return (
    <div className="page">
      <header className="top">
        <Link className="link" href={buildPath(lang, { name: 'home' })}>← {t(lang, 'home')}</Link>
      </header>

      <section className={`card result ${isScored ? (passed ? 'pass' : 'fail') : ''}`}>
        <h1>{heading}</h1>
        {mode === 'test' && <p className={passed ? 'ok' : 'bad'}>{passed ? t(lang, 'passed') : t(lang, 'failed')}</p>}
        <p className="score">{score} / {items.length}</p>
        {isScored ? <p className="muted">{t(lang, 'passNote')}</p> : <p className="muted">{t(lang, 'studyDone')}</p>}
        {isScored && answered < items.length && (
          <p className="muted">{items.length - answered} {t(lang, 'unanswered').toLowerCase()}</p>
        )}
        <div className="actions">
          {mode === 'test' && testNumber !== undefined && (
            <>
              <Link className="btn" href={buildPath(lang, { name: 'test', n: testNumber })}>{t(lang, 'retryTest')}</Link>
              {testNumber < NUM_TESTS && (
                <Link className="btn" href={buildPath(lang, { name: 'test', n: testNumber + 1 })}>
                  {t(lang, 'nextTest')} {testNumber + 1}
                </Link>
              )}
              <Link className="btn ghost" href={buildPath(lang, { name: 'exam' })}>{t(lang, 'randomExam')}</Link>
            </>
          )}
          {mode === 'exam' && (
            <Link className="btn ghost" href={buildPath(lang, { name: 'exam' })}>{t(lang, 'newExam')}</Link>
          )}
          {wrongCount > 0 && (
            <Link className="btn" href={buildPath(lang, { name: 'wrong' })}>{t(lang, 'retryWrong')} ({wrongCount})</Link>
          )}
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
