import type { Lang, Question } from '../types'

interface Sign {
  code: string
  sv: string
  en: string
  d?: Record<Lang, string>
}

export const SIGN_CLASSES = [
  { code: 'A', sv: 'Varningsmärken', en: 'Warning signs' },
  { code: 'B', sv: 'Väjningspliktsmärken', en: 'Priority signs' },
  { code: 'C', sv: 'Förbudsmärken', en: 'Prohibitory signs' },
  { code: 'D', sv: 'Påbudsmärken', en: 'Mandatory signs' },
  { code: 'E', sv: 'Anvisningsmärken', en: 'Information signs' },
]

export const SIGNS: Sign[] = [
  { code: 'A1-1', sv: 'Varning för farlig kurva', en: 'Dangerous bend' },
  { code: 'A2-1', sv: 'Varning för flera farliga kurvor', en: 'Several dangerous bends' },
  { code: 'A3', sv: 'Varning för nedförslutning', en: 'Steep descent' },
  { code: 'A5-1', sv: 'Varning för avsmalnande väg', en: 'Road narrows' },
  { code: 'A8', sv: 'Varning för ojämn väg', en: 'Uneven road' },
  { code: 'A9-1', sv: 'Varning för farthinder', en: 'Speed bump' },
  { code: 'A10', sv: 'Varning för slirig väg', en: 'Slippery road' },
  { code: 'A13', sv: 'Varning för övergångsställe', en: 'Pedestrian crossing ahead', d: { sv: 'Varnar för ett övergångsställe längre fram. Själva övergångsstället märks ut med B3.', en: 'Warns of a pedestrian crossing ahead. The crossing itself is marked with sign B3.' } },
  { code: 'A14', sv: 'Varning för gående', en: 'Pedestrians' },
  { code: 'A15', sv: 'Varning för barn', en: 'Children', d: { sv: 'Sätts upp vid skolor, lekplatser och liknande. Sänk farten och var beredd att stanna.', en: 'Placed near schools and playgrounds. Slow down and be ready to stop.' } },
  { code: 'A16', sv: 'Varning för cyklister och mopedförare', en: 'Cyclists and moped riders' },
  { code: 'A19-1', sv: 'Varning för vilt (älg)', en: 'Wild animals (moose)', d: { sv: 'Viltolyckor är vanligast i gryning och skymning. Håll ögonen på vägkanterna.', en: 'Wildlife collisions are most common at dawn and dusk. Watch the verges.' } },
  { code: 'A20', sv: 'Varning för vägarbete', en: 'Road works' },
  { code: 'A22', sv: 'Varning för trafiksignal', en: 'Traffic signals ahead' },
  { code: 'A25', sv: 'Varning för mötande trafik', en: 'Two-way traffic' },
  { code: 'A28', sv: 'Varning för vägkorsning', en: 'Crossroads', d: { sv: 'Korsning där högerregeln gäller. Väj för trafik från höger.', en: 'A junction where the right-hand rule applies. Give way to traffic from the right.' } },
  { code: 'A30', sv: 'Varning för cirkulationsplats', en: 'Roundabout ahead' },
  { code: 'A34', sv: 'Varning för kö', en: 'Queue ahead' },
  { code: 'A35', sv: 'Varning för järnvägskorsning med bommar', en: 'Level crossing with barriers' },
  { code: 'A36', sv: 'Varning för järnvägskorsning utan bommar', en: 'Level crossing without barriers' },
  { code: 'A40', sv: 'Varning för annan fara', en: 'Other danger', d: { sv: 'Faran anges på en tilläggstavla.', en: 'The danger is described on a supplementary plate.' } },

  { code: 'B1', sv: 'Väjningsplikt', en: 'Give way', d: { sv: 'Sänk farten, stanna om det behövs och släpp fram trafiken på den korsande vägen.', en: 'Slow down, stop if necessary and let traffic on the crossing road pass.' } },
  { code: 'B2', sv: 'Stopplikt', en: 'Stop', d: { sv: 'Du måste alltid stanna helt vid stopplinjen, även om det inte kommer någon trafik.', en: 'You must always come to a complete stop at the stop line, even if no traffic is coming.' } },
  { code: 'B3-1', sv: 'Övergångsställe', en: 'Pedestrian crossing', d: { sv: 'Du har väjningsplikt mot gående som gått ut på eller just ska gå ut på övergångsstället.', en: 'You must give way to pedestrians who are on or about to step onto the crossing.' } },
  { code: 'B4', sv: 'Huvudled', en: 'Priority road', d: { sv: 'Korsande trafik har väjningsplikt. Parkering är förbjuden på huvudled om inte skyltar tillåter det.', en: 'Crossing traffic must give way. Parking on a priority road is prohibited unless signs allow it.' } },
  { code: 'B5', sv: 'Huvudled upphör', en: 'End of priority road', d: { sv: 'Efter märket gäller normalt högerregeln.', en: 'After the sign the right-hand rule normally applies.' } },
  { code: 'B6', sv: 'Väjningsplikt mot mötande trafik', en: 'Give way to oncoming traffic', d: { sv: 'Den röda pilen är din riktning. Vänta tills mötande trafik passerat.', en: 'The red arrow is your direction. Wait until oncoming traffic has passed.' } },
  { code: 'B7', sv: 'Mötande trafik har väjningsplikt', en: 'Priority over oncoming traffic' },
  { code: 'B8', sv: 'Cykelöverfart', en: 'Cycle crossing', d: { sv: 'Du har väjningsplikt mot cyklister och mopedförare som är ute på eller just ska köra ut på cykelöverfarten.', en: 'You must give way to cyclists and moped riders who are on or about to enter the crossing.' } },

  { code: 'C1', sv: 'Förbud mot infart med fordon', en: 'No entry', d: { sv: 'Gäller alla fordon, även cyklar. Vanligt i slutet av enkelriktade gator.', en: 'Applies to all vehicles, including bicycles. Common at the end of one-way streets.' } },
  { code: 'C2', sv: 'Förbud mot fordonstrafik', en: 'No vehicles', d: { sv: 'Gäller i båda riktningarna och alla fordon, även cyklar.', en: 'Applies in both directions and to all vehicles, including bicycles.' } },
  { code: 'C3', sv: 'Förbud mot trafik med motordrivet fordon', en: 'No motor vehicles', d: { sv: 'Cyklar får passera. Moped klass II räknas som motordrivet fordon.', en: 'Bicycles may pass. Class II mopeds count as motor vehicles.' } },
  { code: 'C10', sv: 'Förbud mot cykel- och mopedtrafik', en: 'No cycles or mopeds' },
  { code: 'C15', sv: 'Förbud mot gångtrafik', en: 'No pedestrians' },
  { code: 'C25-1', sv: 'Förbud mot vänstersväng', en: 'No left turn' },
  { code: 'C25-2', sv: 'Förbud mot högersväng', en: 'No right turn' },
  { code: 'C26', sv: 'Förbud mot U-sväng', en: 'No U-turn' },
  { code: 'C27', sv: 'Omkörning förbjuden', en: 'No overtaking', d: { sv: 'Gäller omkörning av motordrivna fordon med fler än två hjul. Du får köra om tvåhjuliga fordon.', en: 'Applies to overtaking motor vehicles with more than two wheels. You may overtake two-wheelers.' } },
  { code: 'C28', sv: 'Slut på omkörningsförbud', en: 'End of no-overtaking zone' },
  { code: 'C31-3', sv: 'Hastighetsbegränsning 30 km/h', en: 'Speed limit 30 km/h' },
  { code: 'C31-4', sv: 'Hastighetsbegränsning 40 km/h', en: 'Speed limit 40 km/h' },
  { code: 'C31-5', sv: 'Hastighetsbegränsning 50 km/h', en: 'Speed limit 50 km/h' },
  { code: 'C31-6', sv: 'Hastighetsbegränsning 60 km/h', en: 'Speed limit 60 km/h', d: { sv: 'Gäller tills en ny hastighet anges. Märket upphör inte vid korsningar.', en: 'Applies until a new limit is signed. It does not end at junctions.' } },
  { code: 'C31-7', sv: 'Hastighetsbegränsning 70 km/h', en: 'Speed limit 70 km/h' },
  { code: 'C31-8', sv: 'Hastighetsbegränsning 80 km/h', en: 'Speed limit 80 km/h' },
  { code: 'C31-9', sv: 'Hastighetsbegränsning 90 km/h', en: 'Speed limit 90 km/h' },
  { code: 'C31-10', sv: 'Hastighetsbegränsning 100 km/h', en: 'Speed limit 100 km/h' },
  { code: 'C31-11', sv: 'Hastighetsbegränsning 110 km/h', en: 'Speed limit 110 km/h' },
  { code: 'C31-12', sv: 'Hastighetsbegränsning 120 km/h', en: 'Speed limit 120 km/h' },
  { code: 'C35', sv: 'Förbud mot att parkera', en: 'No parking', d: { sv: 'Du får stanna för att släppa av passagerare eller lasta, men inte parkera. Gäller på den sida märket står, fram till nästa korsning.', en: 'You may stop to drop off passengers or load, but not park. Applies on the side of the sign until the next junction.' } },
  { code: 'C36', sv: 'Förbud mot att parkera på dag med udda datum', en: 'No parking on odd-numbered dates' },
  { code: 'C37', sv: 'Förbud mot att parkera på dag med jämnt datum', en: 'No parking on even-numbered dates' },
  { code: 'C38', sv: 'Datumparkering', en: 'Date parking', d: { sv: 'Parkering förbjuden på sidan med jämna husnummer på jämnt datum och på sidan med udda husnummer på udda datum.', en: 'No parking on the even-house-number side on even dates and on the odd side on odd dates.' } },
  { code: 'C39', sv: 'Förbud mot att stanna och parkera', en: 'No stopping or parking', d: { sv: 'Du får inte ens stanna för att släppa av en passagerare.', en: 'You may not even stop to drop off a passenger.' } },

  { code: 'D1-3', sv: 'Påbjuden körriktning rakt fram', en: 'Ahead only' },
  { code: 'D1-5', sv: 'Påbjuden körriktning höger', en: 'Turn right only' },
  { code: 'D2-1', sv: 'Påbjuden körbana höger', en: 'Pass on the right', d: { sv: 'Du ska passera märket på höger sida, till exempel vid en refug.', en: 'You must pass the sign on its right-hand side, for example at a traffic island.' } },
  { code: 'D3', sv: 'Cirkulationsplats', en: 'Roundabout', d: { sv: 'Väjningsplikt när du kör in. Ge tecken åt höger när du kör ut.', en: 'Give way when entering. Signal right when leaving.' } },
  { code: 'D4', sv: 'Påbjuden cykelbana', en: 'Cycle path' },
  { code: 'D5', sv: 'Påbjuden gångbana', en: 'Footpath' },
  { code: 'D6', sv: 'Påbjuden gång- och cykelbana', en: 'Shared footpath and cycle path' },

  { code: 'E1', sv: 'Motorväg', en: 'Motorway', d: { sv: 'Högst 110 km/h om inget annat anges. Endast motorfordon som kan och får köra minst 40 km/h.', en: 'Maximum 110 km/h unless otherwise signed. Only motor vehicles that can and may travel at least 40 km/h.' } },
  { code: 'E2', sv: 'Motorväg upphör', en: 'End of motorway' },
  { code: 'E3', sv: 'Motortrafikled', en: 'Expressway (motortrafikled)', d: { sv: 'Samma regler som motorväg för vilka som får köra, men vägen kan ha mötande trafik.', en: 'Same rules as a motorway for who may use it, but the road can have oncoming traffic.' } },
  { code: 'E4', sv: 'Motortrafikled upphör', en: 'End of expressway' },
  { code: 'E5', sv: 'Tättbebyggt område', en: 'Built-up area', d: { sv: 'Bashastighet 50 km/h gäller om inget annat anges.', en: 'The default speed limit of 50 km/h applies unless otherwise signed.' } },
  { code: 'E6', sv: 'Tättbebyggt område upphör', en: 'End of built-up area', d: { sv: 'Bashastighet 70 km/h gäller om inget annat anges.', en: 'The default speed limit of 70 km/h applies unless otherwise signed.' } },
  { code: 'E7', sv: 'Gågata', en: 'Pedestrian street', d: { sv: 'Motorfordon får bara köra för t.ex. varuleveranser eller till en fastighet på gatan. Gångfart och väjningsplikt mot gående.', en: 'Motor vehicles may only drive in for deliveries or to reach property on the street. Walking pace, give way to pedestrians.' } },
  { code: 'E8', sv: 'Gågata upphör', en: 'End of pedestrian street' },
  { code: 'E9', sv: 'Gångfartsområde', en: 'Walking-pace area', d: { sv: 'Gångfart, väjningsplikt mot gående, parkering bara på markerade platser. Utfartsregeln gäller när du lämnar området.', en: 'Walking pace, give way to pedestrians, park only in marked bays. You must give way to everyone when leaving the area.' } },
  { code: 'E10', sv: 'Gångfartsområde upphör', en: 'End of walking-pace area' },
  { code: 'E11-3', sv: 'Rekommenderad lägre hastighet 30 km/h', en: 'Recommended lower speed 30 km/h', d: { sv: 'En rekommendation, inte en gräns. Används t.ex. vid farthinder.', en: 'A recommendation, not a limit. Used for example at speed bumps.' } },
  { code: 'E11-4', sv: 'Rekommenderad lägre hastighet 40 km/h', en: 'Recommended lower speed 40 km/h' },
  { code: 'E13-3', sv: 'Rekommenderad högsta hastighet 30 km/h', en: 'Recommended maximum speed 30 km/h' },
  { code: 'E13-5', sv: 'Rekommenderad högsta hastighet 50 km/h', en: 'Recommended maximum speed 50 km/h' },
  { code: 'E14', sv: 'Rekommenderad högsta hastighet upphör', en: 'End of recommended maximum speed' },
  { code: 'E15', sv: 'Sammanvävning', en: 'Merging (zipper)', d: { sv: 'Två körfält blir ett. Ingen har företräde, ni turas om enligt blixtlåsprincipen.', en: 'Two lanes become one. Nobody has priority; take turns like a zipper.' } },
  { code: 'E16-1', sv: 'Enkelriktad trafik', en: 'One-way traffic', d: { sv: 'På en enkelriktad gata får du parkera även på vänster sida.', en: 'On a one-way street you may park on the left side as well.' } },
  { code: 'E16-2', sv: 'Enkelriktad trafik', en: 'One-way traffic' },
  { code: 'E17-1', sv: 'Återvändsväg', en: 'No through road' },
  { code: 'E17-2', sv: 'Återvändsväg', en: 'No through road' },
  { code: 'E18', sv: 'Mötesplats', en: 'Passing place', d: { sv: 'Det är förbjudet att parkera på en mötesplats.', en: 'Parking at a passing place is prohibited.' } },
  { code: 'E19', sv: 'Parkering', en: 'Parking', d: { sv: 'Utan tilläggstavla får du parkera högst 24 timmar i följd på vardagar.', en: 'Without a supplementary plate you may park for at most 24 hours in a row on weekdays.' } },
  { code: 'E22', sv: 'Busshållplats', en: 'Bus stop', d: { sv: 'Du får inte stanna eller parkera 20 m före och 5 m efter märket, utom för att släppa av eller på passagerare om det inte hindrar bussen.', en: 'No stopping or parking 20 m before and 5 m after the sign, except to let passengers on or off if that does not obstruct the bus.' } },
  { code: 'E23', sv: 'Taxi', en: 'Taxi rank' },
  { code: 'E24', sv: 'Automatisk trafikövervakning', en: 'Automatic traffic enforcement (speed camera)' },
  { code: 'E25', sv: 'Betalväg', en: 'Toll road' },
  { code: 'E26', sv: 'Tunnel', en: 'Tunnel', d: { sv: 'Tänd halvljuset, stanna inte, backa inte och vänd inte.', en: 'Dipped headlights on, no stopping, no reversing, no U-turns.' } },
  { code: 'E27', sv: 'Nöduppställningsplats', en: 'Emergency lay-by' },
]

/** Signs that would make poor quiz items (duplicates of another sign's name, or too many near-identical speed signs). */
const SKIP = new Set(['E16-2', 'E17-2', 'E11-4', 'E13-5', 'C31-3', 'C31-4', 'C31-5', 'C31-7', 'C31-8', 'C31-9', 'C31-10', 'C31-11', 'C31-12'])

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}

function build(): Question[] {
  const out: Question[] = []
  for (const s of SIGNS) {
    if (SKIP.has(s.code)) continue
    const cls = s.code[0]
    const sameClass = SIGNS.filter((o) => o.code !== s.code && o.code[0] === cls && o.sv !== s.sv && o.en !== s.en)
    const others = SIGNS.filter((o) => o.code !== s.code && o.code[0] !== cls)
    // avoid two distractors with the same name
    const seen = new Set<string>([s.sv])
    const distractors: Sign[] = []
    for (const o of [...pick(sameClass, sameClass.length), ...pick(others, others.length)]) {
      if (distractors.length === 3) break
      if (seen.has(o.sv)) continue
      seen.add(o.sv)
      distractors.push(o)
    }
    const opts = [s, ...distractors]
    out.push({
      id: `sign-${s.code}`,
      cat: 'skyltar',
      correct: 0,
      sign: `${s.code}.svg`,
      sv: { q: 'Vad betyder detta vägmärke?', a: opts.map((o) => o.sv), e: s.d ? `${s.sv}. ${s.d.sv}` : `${s.sv}.` },
      en: { q: 'What does this road sign mean?', a: opts.map((o) => o.en), e: s.d ? `${s.en}. ${s.d.en}` : `${s.en}.` },
    })
  }
  return out
}

export const SIGN_QUESTIONS: Question[] = build()
