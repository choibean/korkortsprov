import type { Cat, Lang } from '../types'
import { CATS } from '../types'
import { CAT_NAMES, t } from '../i18n'
import type { Stats } from '../storage'

interface Props {
  lang: Lang
  setLang: (l: Lang) => void
  stats: Stats
  total: number
  wrongCount: number
  onExam: () => void
  onStudy: (cat?: Cat) => void
  onWrong: () => void
  onSigns: () => void
  onInfo: () => void
  onReset: () => void
}

export default function Home(p: Props) {
  const { lang } = p
  const seen = Object.values(p.stats.seen)
  const answered = seen.reduce((n, s) => n + s.c + s.w, 0)
  const correct = seen.reduce((n, s) => n + s.c, 0)
  const pct = answered ? Math.round((100 * correct) / answered) : 0

  return (
    <div className="page">
      <header className="top">
        <div className="brand">
          <img src="/signs/B4.svg" alt="" width="28" height="28" />
          <span>{t(lang, 'appName')}</span>
        </div>
        <div className="langs" role="group" aria-label="Language">
          <button className={lang === 'sv' ? 'on' : ''} onClick={() => p.setLang('sv')}>Svenska</button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => p.setLang('en')}>English</button>
        </div>
      </header>

      <section className="hero">
        <h1>{lang === 'sv' ? 'Klara teoriprovet. Gratis.' : 'Pass the theory test. For free.'}</h1>
        <p>{t(lang, 'tagline')}</p>
        <p className="muted">{t(lang, 'free')} · {p.total} {t(lang, 'questionsInBank')}</p>
      </section>

      <section className="cards">
        <article className="card primary">
          <h2>{t(lang, 'examTitle')}</h2>
          <p>{t(lang, 'examDesc')}</p>
          <button className="btn big" onClick={p.onExam}>{t(lang, 'startExam')}</button>
        </article>

        <article className="card">
          <h2>{t(lang, 'studyTitle')}</h2>
          <p>{t(lang, 'studyDesc')}</p>
          <div className="chips">
            <button className="chip" onClick={() => p.onStudy()}>{t(lang, 'allAreas')}</button>
            {CATS.map((c) => (
              <button key={c} className="chip" onClick={() => p.onStudy(c)}>{CAT_NAMES[c][lang]}</button>
            ))}
            <button className="chip warn" onClick={p.onWrong} disabled={p.wrongCount === 0}>
              {t(lang, 'wrongOnes')}{p.wrongCount ? ` (${p.wrongCount})` : ''}
            </button>
          </div>
        </article>

        <div className="row">
          <article className="card half">
            <h2>{t(lang, 'signsTitle')}</h2>
            <p>{t(lang, 'signsDesc')}</p>
            <button className="btn ghost" onClick={p.onSigns}>{t(lang, 'start')}</button>
          </article>
          <article className="card half">
            <h2>{t(lang, 'infoTitle')}</h2>
            <p>{lang === 'sv' ? 'Antal frågor, tid, nya regler från augusti 2026.' : 'Question count, time limit, the August 2026 rule changes.'}</p>
            <button className="btn ghost" onClick={p.onInfo}>{t(lang, 'start')}</button>
          </article>
        </div>

        <article className="card stats">
          <h2>{t(lang, 'progress')}</h2>
          <div className="statrow">
            <div><strong>{answered}</strong><span>{t(lang, 'answered')}</span></div>
            <div><strong>{pct} %</strong><span>{t(lang, 'accuracy')}</span></div>
            <div><strong>{p.stats.exams.length}</strong><span>{t(lang, 'examsTaken')}</span></div>
          </div>
          {p.stats.exams.length > 0 && (
            <div className="exams">
              <h3>{t(lang, 'lastExams')}</h3>
              <ul>
                {[...p.stats.exams].reverse().slice(0, 5).map((e) => (
                  <li key={e.date}>
                    <span>{new Date(e.date).toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-GB')}</span>
                    <span>{e.score}/{e.total}</span>
                    <span className={e.passed ? 'ok' : 'bad'}>{e.passed ? t(lang, 'passed') : t(lang, 'failed')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {answered > 0 && (
            <button className="link" onClick={() => { if (confirm(t(lang, 'confirmReset'))) p.onReset() }}>
              {t(lang, 'reset')}
            </button>
          )}
        </article>
      </section>

      <footer className="foot">
        <p>{t(lang, 'footer')}</p>
        <p><a href="https://github.com/choibean/korkortsprov/issues" target="_blank" rel="noreferrer">{t(lang, 'reportError')}</a></p>
      </footer>
    </div>
  )
}
