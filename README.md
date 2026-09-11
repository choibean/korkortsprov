# Körkortsprov

Gratis övningsprov för det svenska teoriprovet (körkort B), på svenska och engelska. Inget konto, ingen backend, all data ligger lokalt i webbläsaren.

- **Provsimulering**: 70 frågor, 50 minuter, samma blandning av ämnesområden som Trafikverkets riktiga prov.
- **Öva per område**: regler, skyltar, säkerhet, fordon, miljö och personliga förutsättningar.
- **Skyltgalleri**: bläddra bland svenska vägmärken.
- **Egna framsteg**: rätt/fel per fråga och tidigare provresultat sparas i `localStorage` på din enhet, ingenting skickas till någon server.

## Köra lokalt

```bash
npm install
npm run dev       # startar dev-servern
npm run build     # bygger produktionsversionen till dist/
npm run check     # kontrollerar frågebanken (unika id, giltiga svar, m.m.)
```

## Lägga till en fråga

Varje fråga är ett objekt i en av filerna under `src/data/` (`regler.ts`, `skyltar.ts`/`signs.ts`, `sakerhet.ts`, `fordon.ts`, `miljo.ts`, `person.ts`) och följer formatet i `src/types.ts`:

```ts
{
  id: 'r45',          // unikt id, prefix + löpnummer
  cat: 'regler',       // område, se Cat i src/types.ts
  correct: 1,           // index i a[] på rätt svar, samma index i sv och en
  sign: 'B2.svg',       // valfritt, filnamn under public/signs
  sv: { q: '...', a: ['...', '...', '...', '...'], e: '...' },
  en: { q: '...', a: ['...', '...', '...', '...'], e: '...' },
}
```

`q` är frågan, `a` är svarsalternativen i samma ordning på båda språken, `e` är en kort förklaring (1–2 meningar). Kör `npm run check` efteråt för att verifiera att frågan är korrekt formaterad.

## Källor

Frågorna är skrivna av projektet, inte hämtade eller kopierade från Trafikverkets eller Transportstyrelsens provbank. Vägmärkena i skyltgalleriet kommer från Wikimedia Commons (svenska officiella vägmärken, public domain).

Sajten drivs inte av och är inte kopplad till Trafikverket eller Transportstyrelsen.

---

# Körkortsprov (English)

A free practice test for the Swedish B-licence theory exam, in Swedish and English. No account, no backend, everything runs and is stored locally in your browser.

- **Exam simulation**: 70 questions, 50 minutes, the same mix of subject areas as Trafikverket's real test.
- **Study by area**: rules, signs, safety, vehicles, environment, and personal factors.
- **Sign gallery**: browse Swedish road signs.
- **Local progress**: right/wrong per question and past exam results are saved in `localStorage` on your device, nothing is sent to a server.

## Running locally

```bash
npm install
npm run dev       # start the dev server
npm run build     # build the production bundle to dist/
npm run check     # validate the question bank (unique ids, valid answers, etc.)
```

## Adding a question

Each question is an object in one of the files under `src/data/` (`regler.ts`, `signs.ts`, `sakerhet.ts`, `fordon.ts`, `miljo.ts`, `person.ts`), following the format in `src/types.ts`:

```ts
{
  id: 'r45',          // unique id, prefix + running number
  cat: 'regler',       // area, see Cat in src/types.ts
  correct: 1,           // index into a[] of the correct option, same index in sv and en
  sign: 'B2.svg',       // optional, filename under public/signs
  sv: { q: '...', a: ['...', '...', '...', '...'], e: '...' },
  en: { q: '...', a: ['...', '...', '...', '...'], e: '...' },
}
```

`q` is the question, `a` is the answer options in the same order in both languages, `e` is a short explanation (1–2 sentences). Run `npm run check` afterwards to verify the question is formatted correctly.

## Sources

The questions are original, written for this project, not taken or copied from Trafikverket's or Transportstyrelsen's question bank. The road signs in the sign gallery come from Wikimedia Commons (official Swedish road signs, public domain).

This site is not run by, and is not affiliated with, Trafikverket or Transportstyrelsen.
