import { useEffect } from 'react'
import type { Lang } from './types'
import { CAT_NAMES } from './i18n'
import type { Route } from './router'
import { buildPath } from './router'
import { NUM_TESTS } from './tests'

const BASE = 'https://korkortsprov.vercel.app'

interface Meta {
  title: string
  description: string
}

function metaFor(lang: Lang, route: Route): Meta {
  switch (route.name) {
    case 'home':
      return lang === 'sv'
        ? {
            title: 'Teoriprov körkort B – gratis övningsprov på svenska och engelska | Körkortsprov',
            description:
              'Öva gratis inför Trafikverkets kunskapsprov för B-körkort. 8 övningsprov med 70 frågor på 50 minuter, förklaringar till varje fråga och alla vägmärken. Uppdaterat för 2026. Inget konto.',
          }
        : {
            title: 'Swedish Driving Theory Test in English – Free Practice Tests | Körkortsprov',
            description:
              'Free practice for the Swedish B-licence theory test (kunskapsprov) in English. 8 mock exams with 70 questions in 50 minutes, explanations for every question and all road signs. Updated for 2026. No account.',
          }

    case 'exam':
      return lang === 'sv'
        ? {
            title: 'Slumpat övningsprov – teoriprov B med 70 frågor | Körkortsprov',
            description:
              'Gör ett slumpat övningsprov med 70 frågor dragna ur hela frågebanken, precis som Trafikverkets kunskapsprov. Förklaring till varje fråga. Helt gratis, inget konto.',
          }
        : {
            title: 'Random Practice Exam – Swedish Theory Test, 70 Questions | Körkortsprov',
            description:
              "Take a randomly drawn practice exam with 70 questions from the full question bank, just like Trafikverket's real theory test. An explanation for every question. Completely free, no account.",
          }

    case 'test':
      return lang === 'sv'
        ? {
            title: `Övningsprov ${route.n} – teoriprov B med 70 frågor | Körkortsprov`,
            description: `Övningsprov ${route.n} av ${NUM_TESTS} för teoriprovet, körkort B. 70 frågor på 50 minuter med förklaring till varje fråga. Gratis, inget konto.`,
          }
        : {
            title: `Practice Test ${route.n} – Swedish Theory Test, 70 Questions | Körkortsprov`,
            description: `Practice test ${route.n} of ${NUM_TESTS} for the Swedish B-licence theory test. 70 questions in 50 minutes with an explanation for every question. Free, no account.`,
          }

    case 'study': {
      if (!route.cat) {
        return lang === 'sv'
          ? {
              title: 'Öva på alla frågor – teoriprov B | Körkortsprov',
              description:
                'Öva fritt på frågor från alla fem kunskapsområden i teoriprovet för körkort B, med direkt feedback och förklaring efter varje fråga.',
            }
          : {
              title: 'Practise All Questions – Swedish Theory Test | Körkortsprov',
              description:
                'Practise freely with questions from all five knowledge areas of the Swedish B-licence theory test, with instant feedback and an explanation after every question.',
            }
      }
      const name = CAT_NAMES[route.cat]
      return lang === 'sv'
        ? {
            title: `Övningsfrågor: ${name.sv} – teoriprov B | Körkortsprov`,
            description: `Öva på frågor om ${name.sv.toLowerCase()} inför teoriprovet för körkort B. Direkt feedback och förklaring efter varje fråga.`,
          }
        : {
            title: `Practice Questions: ${name.en} – Swedish Theory Test | Körkortsprov`,
            description: `Practise questions about ${name.en.toLowerCase()} for the Swedish B-licence theory test. Instant feedback and an explanation after every question.`,
          }
    }

    case 'wrong':
      return lang === 'sv'
        ? {
            title: 'Öva på mina fel – teoriprov B | Körkortsprov',
            description: 'Öva specifikt på de frågor du tidigare svarat fel på, med förklaring till varje fråga.',
          }
        : {
            title: 'Practise My Mistakes – Swedish Theory Test | Körkortsprov',
            description: 'Practise specifically the questions you have previously answered incorrectly, with an explanation for each one.',
          }

    case 'signs':
      return lang === 'sv'
        ? {
            title: 'Vägmärken – alla svenska vägmärken med betydelse | Körkortsprov',
            description:
              'Bläddra bland alla svenska vägmärken: varningsmärken, väjningspliktsmärken, förbudsmärken, påbudsmärken och anvisningsmärken, med förklaring till varje märke.',
          }
        : {
            title: 'Swedish Road Signs and Their Meanings | Körkortsprov',
            description:
              'Browse every Swedish road sign — warning, priority, prohibitory, mandatory and information signs — with an explanation for each one.',
          }

    case 'info':
      return lang === 'sv'
        ? {
            title: 'Så funkar teoriprovet 2026 – nya körkortsregler | Körkortsprov',
            description:
              'Allt om teoriprovet för körkort B: antal frågor, provtid, gränsen för godkänt och de nya körkortsreglerna som gäller från 2026.',
          }
        : {
            title: 'How the Swedish Theory Test Works in 2026 – New Rules | Körkortsprov',
            description:
              'Everything about the Swedish B-licence theory test: number of questions, time limit, the pass mark and the new driving licence rules in force from 2026.',
          }
  }
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Sets per-route document title, description, canonical + hreflang links, and OG tags. */
export function useSeo(lang: Lang, route: Route) {
  useEffect(() => {
    const { title, description } = metaFor(lang, route)
    document.title = title
    document.documentElement.lang = lang

    upsertMeta('name', 'description', description)

    const svUrl = BASE + buildPath('sv', route)
    const enUrl = BASE + buildPath('en', route)
    const curUrl = BASE + buildPath(lang, route)

    upsertLink('canonical', curUrl)
    upsertLink('alternate', svUrl, 'sv')
    upsertLink('alternate', enUrl, 'en')
    upsertLink('alternate', svUrl, 'x-default')

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', curUrl)
    upsertMeta('property', 'og:locale', lang === 'sv' ? 'sv_SE' : 'en_US')
  }, [lang, route])
}
