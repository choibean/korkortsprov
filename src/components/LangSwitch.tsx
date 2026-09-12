import type { Lang } from '../types'
import type { Route } from '../router'
import { buildPath } from '../router'
import { saveLang } from '../storage'
import Link from './Link'

/** Language toggle: always links to the equivalent page in the other language. */
export default function LangSwitch({ lang, route }: { lang: Lang; route: Route }) {
  return (
    <div className="langs" role="group" aria-label="Language">
      <Link href={buildPath('sv', route)} className={lang === 'sv' ? 'on' : ''} onClick={() => saveLang('sv')}>
        Svenska
      </Link>
      <Link href={buildPath('en', route)} className={lang === 'en' ? 'on' : ''} onClick={() => saveLang('en')}>
        English
      </Link>
    </div>
  )
}
