import type { Lang } from '../types'
import { t } from '../i18n'
import { buildPath } from '../router'
import Link from './Link'
import LangSwitch from './LangSwitch'

const CONTENT: Record<Lang, { h: string; items: string[] }[]> = {
  sv: [
    {
      h: 'Teoriprovet (kunskapsprov B)',
      items: [
        '70 frågor med svarsalternativ. 65 räknas, 5 är testfrågor som inte påverkar resultatet.',
        'Provtiden är 50 minuter.',
        'Godkänt vid 52 rätt av 65.',
        'Fem kunskapsområden: fordonskännedom och manövrering, miljö, trafiksäkerhet, trafikregler samt personliga förutsättningar.',
        'Provet finns på svenska, engelska och arabiska. Tolk kan bokas för andra språk.',
        'Riskutbildning del 1 och del 2 måste vara klara innan du får göra teoriprovet.',
        'Teoriprovet måste vara godkänt innan du får göra körprovet.',
        'Nytt 19 augusti 2026: ett godkänt teoriprov gäller i ett år (tidigare fyra månader).',
      ],
    },
    {
      h: 'Vägen till körkortet',
      items: [
        'Körkortstillstånd söks hos Transportstyrelsen och gäller i fem år.',
        'Övningskörning för B får börja vid 16 år.',
        'Nytt 1 augusti 2026: kravet på introduktionsutbildning (handledarkursen) för privat övningskörning är borttaget.',
        'Handledaren ska fortfarande vara godkänd av Transportstyrelsen: minst 24 år och körkort i minst fem av de senaste tio åren.',
        'Riskutbildning del 1 (alkohol, droger, trötthet) och del 2 (halkbana) är giltiga i fem år.',
        'Körkort B kan tas från 18 år. Prövotid i två år: återkallas körkortet under prövotiden måste både teori- och körprov göras om.',
        'EU har beslutat att B-körkort ska kunna tas från 17 år med medföljande handledare, men det är INTE infört i Sverige. Frågan utreds, med rapport senast juli 2027.',
      ],
    },
    {
      h: 'Andra regler som gäller 2026',
      items: [
        'Vinterdäck krävs 1 december–31 mars när det är vinterväglag. Minsta mönsterdjup 3 mm (sommardäck: 1,6 mm).',
        'Dubbdäck får användas 1 oktober–15 april, eller längre om det är eller väntas bli vinterväglag.',
        'Rattfylleri från 0,2 promille, grovt rattfylleri från 1,0 promille.',
        'Handhållen mobil vid körning är förbjuden sedan 2018.',
        'Barn kortare än 135 cm ska använda bilbarnstol, bältesstol eller bälteskudde.',
        'Cykelhjälm är obligatorisk för barn under 15 år.',
        'Sedan 15 januari 2026 bedöms adhd och autism inte längre som diagnoser utan efter faktisk körförmåga vid ansökan om körkortstillstånd.',
      ],
    },
  ],
  en: [
    {
      h: 'The theory test (kunskapsprov B)',
      items: [
        '70 multiple-choice questions. 65 count; 5 are trial questions that do not affect your result.',
        'Time limit: 50 minutes.',
        'Pass mark: 52 correct out of 65.',
        'Five knowledge areas: vehicle knowledge and handling, environment, traffic safety, traffic rules, and personal factors.',
        'The test is available in Swedish, English and Arabic. An interpreter can be booked for other languages.',
        'Risk education part 1 and part 2 must be completed before you can take the theory test.',
        'You must pass the theory test before you can take the driving test.',
        'New from 19 August 2026: a passed theory test is valid for one year (previously four months).',
      ],
    },
    {
      h: 'The road to a licence',
      items: [
        'A learner permit (körkortstillstånd) is applied for at Transportstyrelsen and is valid for five years.',
        'Practice driving for category B may start at 16.',
        'New from 1 August 2026: the introduction course (handledarkurs) is no longer required for private practice driving.',
        'The supervisor must still be approved by Transportstyrelsen: at least 24 years old with a licence for at least five of the last ten years.',
        'Risk education part 1 (alcohol, drugs, fatigue) and part 2 (skid pan) are valid for five years.',
        'A B licence can be obtained from age 18. Two-year probation: if the licence is revoked during probation, both tests must be retaken.',
        'The EU has decided that B licences may be issued from 17 with an accompanying driver, but this is NOT in force in Sweden. It is under review, with a report due by July 2027.',
      ],
    },
    {
      h: 'Other rules in force in 2026',
      items: [
        'Winter tyres are required 1 December to 31 March in winter road conditions. Minimum tread depth 3 mm (summer tyres: 1.6 mm).',
        'Studded tyres may be used 1 October to 15 April, or longer if winter conditions exist or are expected.',
        'Drink driving from 0.2 per mille blood alcohol; aggravated drink driving from 1.0 per mille.',
        'Using a handheld phone while driving has been banned since 2018.',
        'Children shorter than 135 cm must use a child seat, booster seat or booster cushion.',
        'Cycle helmets are mandatory for children under 15.',
        'Since 15 January 2026, ADHD and autism are assessed on actual driving ability rather than diagnosis when applying for a learner permit.',
      ],
    },
  ],
}

export default function Info({ lang }: { lang: Lang }) {
  return (
    <div className="page">
      <header className="top">
        <Link className="link" href={buildPath(lang, { name: 'home' })}>← {t(lang, 'back')}</Link>
        <LangSwitch lang={lang} route={{ name: 'info' }} />
      </header>
      <h1>{t(lang, 'infoTitle')}</h1>
      <p className="muted">
        {lang === 'sv'
          ? 'Källor: Trafikverket, Transportstyrelsen och regeringen. Kontrollerat september 2026.'
          : 'Sources: Trafikverket, Transportstyrelsen and the Swedish government. Checked September 2026.'}
      </p>
      {CONTENT[lang].map((sec) => (
        <section key={sec.h} className="card">
          <h2>{sec.h}</h2>
          <ul className="facts">
            {sec.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </section>
      ))}
      <p className="muted">
        <a href="https://www.trafikverket.se/korkort/korkortsprov/personbil-och-latt-lastbil/kunskapsprov-b/" target="_blank" rel="noreferrer">trafikverket.se</a>
        {' · '}
        <a href="https://www.transportstyrelsen.se/sv/vagtrafik/korkort/" target="_blank" rel="noreferrer">transportstyrelsen.se</a>
      </p>
    </div>
  )
}
