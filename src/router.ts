import { useEffect, useMemo, useState } from 'react'
import type { Cat, Lang } from './types'
import { loadSavedLang } from './storage'
import { NUM_TESTS } from './tests'

export type Route =
  | { name: 'home' }
  | { name: 'exam' }
  | { name: 'test'; n: number }
  | { name: 'study'; cat?: Cat }
  | { name: 'wrong' }
  | { name: 'signs' }
  | { name: 'info' }

const SLUG_TO_CAT: Record<Lang, Record<string, Cat>> = {
  sv: {
    trafikregler: 'regler',
    vagmarken: 'skyltar',
    trafiksakerhet: 'sakerhet',
    fordon: 'fordon',
    miljo: 'miljo',
    'personliga-forutsattningar': 'person',
  },
  en: {
    'traffic-rules': 'regler',
    'road-signs': 'skyltar',
    'traffic-safety': 'sakerhet',
    vehicle: 'fordon',
    environment: 'miljo',
    'personal-factors': 'person',
  },
}

const CAT_TO_SLUG: Record<Lang, Record<Cat, string>> = {
  sv: {
    regler: 'trafikregler',
    skyltar: 'vagmarken',
    sakerhet: 'trafiksakerhet',
    fordon: 'fordon',
    miljo: 'miljo',
    person: 'personliga-forutsattningar',
  },
  en: {
    regler: 'traffic-rules',
    skyltar: 'road-signs',
    sakerhet: 'traffic-safety',
    fordon: 'vehicle',
    miljo: 'environment',
    person: 'personal-factors',
  },
}

const WRONG_SLUG: Record<Lang, string> = { sv: 'mina-fel', en: 'my-mistakes' }
const EXAM_SEG: Record<Lang, string> = { sv: '/prov', en: '/test' }
const STUDY_SEG: Record<Lang, string> = { sv: '/ova', en: '/practise' }
const SIGNS_SEG: Record<Lang, string> = { sv: '/vagmarken', en: '/road-signs' }
const INFO_SEG: Record<Lang, string> = { sv: '/regler-2026', en: '/rules-2026' }

function normalize(pathname: string): string {
  let p = pathname
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p === '' ? '/' : p
}

/** Parse a raw pathname into a language + route. Unknown paths fall back to that language's home. */
export function parsePath(pathname: string): { lang: Lang; route: Route } {
  const path = normalize(pathname)

  let lang: Lang = 'sv'
  let rest = path
  if (path === '/en' || path.startsWith('/en/')) {
    lang = 'en'
    rest = path.slice(3) || '/'
  }

  const home = { lang, route: { name: 'home' as const } }
  if (rest === '/') return home

  if (rest === EXAM_SEG[lang]) return { lang, route: { name: 'exam' } }
  if (rest.startsWith(EXAM_SEG[lang] + '/')) {
    const n = Number(rest.slice(EXAM_SEG[lang].length + 1))
    if (Number.isInteger(n) && n >= 1 && n <= NUM_TESTS) return { lang, route: { name: 'test', n } }
    return home
  }

  if (rest === STUDY_SEG[lang]) return { lang, route: { name: 'study' } }
  if (rest.startsWith(STUDY_SEG[lang] + '/')) {
    const slug = rest.slice(STUDY_SEG[lang].length + 1)
    if (slug === WRONG_SLUG[lang]) return { lang, route: { name: 'wrong' } }
    const cat = SLUG_TO_CAT[lang][slug]
    if (cat) return { lang, route: { name: 'study', cat } }
    return home
  }

  if (rest === SIGNS_SEG[lang]) return { lang, route: { name: 'signs' } }
  if (rest === INFO_SEG[lang]) return { lang, route: { name: 'info' } }

  return home
}

/** Build the canonical path for a route in a given language. */
export function buildPath(lang: Lang, route: Route): string {
  const prefix = lang === 'en' ? '/en' : ''
  switch (route.name) {
    case 'home':
      return lang === 'en' ? '/en' : '/'
    case 'exam':
      return prefix + EXAM_SEG[lang]
    case 'test':
      return prefix + EXAM_SEG[lang] + '/' + route.n
    case 'study':
      return prefix + STUDY_SEG[lang] + (route.cat ? '/' + CAT_TO_SLUG[lang][route.cat] : '')
    case 'wrong':
      return prefix + STUDY_SEG[lang] + '/' + WRONG_SLUG[lang]
    case 'signs':
      return prefix + SIGNS_SEG[lang]
    case 'info':
      return prefix + INFO_SEG[lang]
  }
}

const NAV_EVENT = 'korkortsprov:navigate'

/** Push a new URL and notify every useRoute() subscriber, even if the path is unchanged
 * (e.g. retrying the same fixed test rebuilds it from scratch). */
export function navigate(path: string) {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new Event(NAV_EVENT))
  window.scrollTo(0, 0)
}

// One-time, synchronous (pre-render) redirect: only ever driven by an explicit saved
// preference, never by browser language, and only exactly at the Swedish root.
if (typeof window !== 'undefined' && window.location.pathname === '/') {
  if (loadSavedLang() === 'en') {
    window.history.replaceState(null, '', '/en' + window.location.search + window.location.hash)
  }
}

/** Current language + route, updating on navigation (Link clicks, popstate, or navigate()). */
export function useRoute(): { lang: Lang; route: Route; navId: number } {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [navId, setNavId] = useState(0)

  useEffect(() => {
    const onChange = () => {
      setPathname(window.location.pathname)
      setNavId((n) => n + 1)
    }
    window.addEventListener('popstate', onChange)
    window.addEventListener(NAV_EVENT, onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener(NAV_EVENT, onChange)
    }
  }, [])

  const parsed = useMemo(() => parsePath(pathname), [pathname])

  // Unknown paths resolve to home above; also corrects things like a trailing slash
  // that normalize() accepts for matching but isn't the canonical URL.
  useEffect(() => {
    const canonical = buildPath(parsed.lang, parsed.route)
    if (canonical !== pathname) {
      window.history.replaceState(null, '', canonical)
    }
  }, [pathname, parsed])

  return { lang: parsed.lang, route: parsed.route, navId }
}
