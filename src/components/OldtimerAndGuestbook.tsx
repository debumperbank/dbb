import Link from 'next/link';

export function OldtimerTeaser() {
  return (
    <section id="oldtimers" className="px-8 py-24 bg-paper text-ink">
      <div className="max-w-site mx-auto grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="eyebrow text-orange-deep"><span className="dot" />Oldtimer afdeling</div>
          <h2 className="mt-3.5 mb-4.5 text-3xl md:text-4xl">Klassiekers, met dossier</h2>
          <p className="max-w-[42ch] text-[15px] leading-relaxed text-muted-dark mb-6.5">
            Van eerste opzoeking tot laatste laklaag: elke klassieker die bij De Bumperbank
            binnenkomt krijgt een volledig opgebouwd herstellingsdossier — vanaf dag één.
          </p>
          <div className="flex gap-9 mb-7">
            <div>
              <div className="font-display text-[15px] text-orange-deep leading-snug">Elke restauratie</div>
              <div className="font-mono text-[11px] text-muted-dark mt-1">met volledig dossier</div>
            </div>
            <div>
              <div className="font-display text-[15px] text-orange-deep leading-snug">Van de sloop gered</div>
              <div className="font-mono text-[11px] text-muted-dark mt-1">in plaats van gesloopt</div>
            </div>
            <div>
              <div className="font-display text-[15px] text-orange-deep leading-snug">Persoonlijk opgevolgd</div>
              <div className="font-mono text-[11px] text-muted-dark mt-1">van A tot Z</div>
            </div>
          </div>
          <Link href="/oldtimers" className="btn btn-ghost-light">Bezoek de oldtimer-afdeling →</Link>
        </div>
        <div className="bg-white border border-[color:var(--line-light)] rounded-lg p-10 flex flex-col items-center gap-4">
          <svg viewBox="0 0 220 90" fill="none" className="w-4/5">
            <path d="M6 60 L18 60 L36 30 L80 22 L150 22 L182 36 L214 44 L214 60 L206 60" stroke="#141517" strokeWidth={2.5} strokeLinejoin="round" />
            <circle cx="56" cy="62" r="11" stroke="#141517" strokeWidth={2.5} />
            <circle cx="176" cy="62" r="11" stroke="#141517" strokeWidth={2.5} />
          </svg>
          <div className="font-mono text-xs text-muted-dark text-center">
            Elk dossier begint bij ophaling en volgt de wagen tot de laatste laklaag.
          </div>
        </div>
      </div>
    </section>
  );
}

export function Guestbook() {
  return (
    <section className="px-8 py-24">
      <div className="max-w-site mx-auto text-center">
        <div className="eyebrow justify-center"><span className="dot" />Net gestart</div>
        <h2 className="mt-3.5 text-2xl md:text-3xl max-w-[36ch] mx-auto">
          De Bumperbank is nieuw — en jij kan er van de eerste dag bij zijn.
        </h2>
        <p className="mt-4 max-w-[52ch] mx-auto text-[14.5px] text-muted leading-relaxed">
          Geen decennia geschiedenis, wel een garage waar je zelf mee aan tafel zit: elke wagen,
          elke restauratie en elke afspraak lopen persoonlijk via de eigenaar.
        </p>
        <Link href="/contact" className="btn btn-primary mt-7 inline-flex">Maak kennis →</Link>
      </div>
    </section>
  );
}
