import type { Cat, Lang } from '../types'
import { CATS } from '../types'
import { CAT_NAMES, t } from '../i18n'
import type { Stats } from '../storage'
import { buildPath, type Route } from '../router'
import { NUM_TESTS } from '../tests'
import Link from './Link'
import LangSwitch from './LangSwitch'

interface Props {
  lang: Lang
  stats: Stats
  total: number
  wrongCount: number
  onReset: () => void
}

const TEST_NUMBERS = Array.from({ length: NUM_TESTS }, (_, i) => i + 1)

/** Test 1 if never taken, else the lowest-numbered test not yet passed, else the random exam. */
function primaryTarget(lang: Lang, stats: Stats): { route: Route; label: string } {
  for (const n of TEST_NUMBERS) {
    if (!stats.tests[String(n)]?.passed) {
      return { route: { name: 'test', n }, label: `${t(lang, 'startTestPrefix')} ${n}` }
    }
  }
  return { route: { name: 'exam' }, label: t(lang, 'startExam') }
}

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  sv: [
    {
      q: 'Hur många frågor är det på teoriprovet?',
      a: 'Teoriprovet (kunskapsprov B) har 70 frågor. Av dessa räknas 65, de övriga 5 är testfrågor som inte påverkar resultatet. Provtiden är 50 minuter och du behöver 52 rätt av 65 för godkänt.',
    },
    {
      q: 'Är den här sajten gratis?',
      a: 'Ja, helt gratis. Inget konto behövs, det finns ingen reklam och ingen betalvägg.',
    },
    {
      q: 'Är det här samma frågor som hos Trafikverket?',
      a: 'Nej. Frågorna här är egna och täcker samma regler och samma fem kunskapsområden som det riktiga provet, men Trafikverkets faktiska frågor är inte offentliga.',
    },
    {
      q: 'Kan jag öva på engelska?',
      a: 'Ja, hela sajten finns på engelska. Trafikverkets riktiga teoriprov erbjuds på svenska, engelska och arabiska.',
    },
    {
      q: 'Hur många övningsprov finns det?',
      a: `${NUM_TESTS} nummererade övningsprov plus ett slumpat prov draget ur hela frågebanken. Du kan också öva per kunskapsområde i studieläget.`,
    },
    {
      q: 'Vad ändrades 2026?',
      a: 'Sedan 19 augusti 2026 gäller ett godkänt teoriprov i ett år (tidigare fyra månader). Sedan 1 augusti 2026 krävs inte längre introduktionsutbildning för privat övningskörning.',
    },
  ],
  en: [
    {
      q: 'How many questions are on the theory test?',
      a: 'The theory test (kunskapsprov B) has 70 questions. 65 of them count; the other 5 are trial questions that do not affect your result. The time limit is 50 minutes and you need 52 correct out of 65 to pass.',
    },
    {
      q: 'Is this site free?',
      a: 'Yes, completely free. No account is needed, there are no ads, and there is no paywall.',
    },
    {
      q: "Are these the same questions as Trafikverket's?",
      a: "No. These are original questions covering the same rules and the same five knowledge areas as the real test, but Trafikverket's actual questions are not made public.",
    },
    {
      q: 'Can I practise in English?',
      a: "Yes, the whole site is available in English. Trafikverket's real theory test is offered in Swedish, English and Arabic.",
    },
    {
      q: 'How many practice tests are there?',
      a: `${NUM_TESTS} numbered practice tests plus a random exam drawn from the whole question bank. You can also practise by knowledge area in study mode.`,
    },
    {
      q: 'What changed in 2026?',
      a: 'From 19 August 2026, a passed theory test is valid for one year (previously four months). From 1 August 2026, the introduction course is no longer required for private practice driving.',
    },
  ],
}

export default function Home({ lang, stats, total, wrongCount, onReset }: Props) {
  const seen = Object.values(stats.seen)
  const answered = seen.reduce((n, s) => n + s.c + s.w, 0)
  const correct = seen.reduce((n, s) => n + s.c, 0)
  const pct = answered ? Math.round((100 * correct) / answered) : 0
  const primary = primaryTarget(lang, stats)
  const otherLang: Lang = lang === 'sv' ? 'en' : 'sv'

  return (
    <div className="page">
      <header className="top">
        <div className="brand">
          <img src="/signs/B4.svg" alt="" width="28" height="28" />
          <span>{t(lang, 'appName')}</span>
        </div>
        <LangSwitch lang={lang} route={{ name: 'home' }} />
      </header>

      <section className="hero">
        <h1>{lang === 'sv' ? 'Klara teoriprovet. Gratis.' : 'Pass the theory test. For free.'}</h1>
        <p>{t(lang, 'tagline')}</p>
        <p className="muted">{t(lang, 'free')} · {total} {t(lang, 'questionsInBank')}</p>
      </section>

      <section className="cards">
        <article className="card primary">
          <h2>{t(lang, 'examTitle')}</h2>
          <p>{t(lang, 'examDesc')}</p>
          <Link className="btn big" href={buildPath(lang, primary.route)}>{primary.label}</Link>
        </article>

        <article className="card">
          <h2>{t(lang, 'testsTitle')}</h2>
          <div className="testgrid">
            {TEST_NUMBERS.map((n) => {
              const rec = stats.tests[String(n)]
              return (
                <Link key={n} className={`testcell ${rec?.passed ? 'passed' : ''}`} href={buildPath(lang, { name: 'test', n })}>
                  <strong>{t(lang, 'testLabel')} {n}</strong>
                  {rec ? (
                    <span>{rec.best}/{rec.total}{rec.passed ? ' ✓' : ''}</span>
                  ) : (
                    <span className="muted">{t(lang, 'notTaken')}</span>
                  )}
                </Link>
              )
            })}
          </div>
          <p><Link className="link" href={buildPath(lang, { name: 'exam' })}>{t(lang, 'randomExam')}</Link></p>
        </article>

        <article className="card">
          <h2>{t(lang, 'studyTitle')}</h2>
          <p>{t(lang, 'studyDesc')}</p>
          <div className="chips">
            <Link className="chip" href={buildPath(lang, { name: 'study' })}>{t(lang, 'allAreas')}</Link>
            {CATS.map((c: Cat) => (
              <Link key={c} className="chip" href={buildPath(lang, { name: 'study', cat: c })}>{CAT_NAMES[c][lang]}</Link>
            ))}
            {wrongCount > 0 ? (
              <Link className="chip warn" href={buildPath(lang, { name: 'wrong' })}>
                {t(lang, 'wrongOnes')} ({wrongCount})
              </Link>
            ) : (
              <span className="chip warn" aria-disabled="true">{t(lang, 'wrongOnes')}</span>
            )}
          </div>
        </article>

        <div className="row">
          <article className="card half">
            <h2>{t(lang, 'signsTitle')}</h2>
            <p>{t(lang, 'signsDesc')}</p>
            <Link className="btn ghost" href={buildPath(lang, { name: 'signs' })}>{t(lang, 'start')}</Link>
          </article>
          <article className="card half">
            <h2>{t(lang, 'infoTitle')}</h2>
            <p>{lang === 'sv' ? 'Antal frågor, tid, nya regler från augusti 2026.' : 'Question count, time limit, the August 2026 rule changes.'}</p>
            <Link className="btn ghost" href={buildPath(lang, { name: 'info' })}>{t(lang, 'start')}</Link>
          </article>
        </div>

        <article className="card stats">
          <h2>{t(lang, 'progress')}</h2>
          <div className="statrow">
            <div><strong>{answered}</strong><span>{t(lang, 'answered')}</span></div>
            <div><strong>{pct} %</strong><span>{t(lang, 'accuracy')}</span></div>
            <div><strong>{stats.exams.length}</strong><span>{t(lang, 'examsTaken')}</span></div>
          </div>
          {stats.exams.length > 0 && (
            <div className="exams">
              <h3>{t(lang, 'lastExams')}</h3>
              <ul>
                {[...stats.exams].reverse().slice(0, 5).map((e) => (
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
            <button className="link" onClick={() => { if (confirm(t(lang, 'confirmReset'))) onReset() }}>
              {t(lang, 'reset')}
            </button>
          )}
        </article>

        <section className="card faq">
          <h2>{t(lang, 'faqTitle')}</h2>
          {FAQ[lang].map((item) => (
            <div key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </section>
      </section>

      <footer className="foot">
        <nav className="footnav" aria-label="Footer">
          <Link href={buildPath(lang, { name: 'exam' })}>{t(lang, 'randomExam')}</Link>
          {TEST_NUMBERS.map((n) => (
            <Link key={n} href={buildPath(lang, { name: 'test', n })}>{t(lang, 'testLabel')} {n}</Link>
          ))}
          {CATS.map((c: Cat) => (
            <Link key={c} href={buildPath(lang, { name: 'study', cat: c })}>{CAT_NAMES[c][lang]}</Link>
          ))}
          <Link href={buildPath(lang, { name: 'signs' })}>{t(lang, 'signsTitle')}</Link>
          <Link href={buildPath(lang, { name: 'info' })}>{t(lang, 'infoTitle')}</Link>
          <Link href={buildPath(otherLang, { name: 'home' })}>{otherLang === 'sv' ? 'Svenska' : 'English'}</Link>
        </nav>
        <p>{t(lang, 'footer')}</p>
        <p><a href="https://github.com/choibean/korkortsprov/issues" target="_blank" rel="noreferrer">{t(lang, 'reportError')}</a></p>
      </footer>
    </div>
  )
}
