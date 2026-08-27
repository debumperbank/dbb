import Link from 'next/link';

export function OldtimerTeaser() {
  return (
    <section id="oldtimers" className="px-8 py-24 bg-paper text-ink">
      <div className="max-w-site mx-auto grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="eyebrow text-orange-deep"><span className="dot" />Oldtimer afdeling</div>
          <h2 className="mt-3.5 mb-4.5 text-3xl md:text-4xl">Klassiekers, met dossier</h2>
          <p className="max-w-[42ch] text-[15px] leading-relaxed text-muted-dark mb-6.5">
            Van eerste opzoeking tot laatste laklaag: onze oldtimer afdeling koopt, restaureert en
            verkoopt klassiekers met een volledig opgebouwd herstellingsdossier.
          </p>
          <div className="flex gap-9 mb-7">
            <div>
              <div className="font-display text-3xl text-orange-deep">3+</div>
              <div className="font-mono text-[11px] text-muted-dark mt-1">klassiekers behandeld</div>
            </div>
            <div>
              <div className="font-display text-3xl text-orange-deep">1992</div>
              <div className="font-mono text-[11px] text-muted-dark mt-1">oudste dossier</div>
            </div>
            <div>
              <div className="font-display text-3xl text-orange-deep">1 wk</div>
              <div className="font-mono text-[11px] text-muted-dark mt-1">gem. concours-traject</div>
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
            Dossier № 12 &middot; opgehaald 1992 &middot; restauratie afgerond 2018
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { quote: 'Geen verkooppraatjes, gewoon een eerlijke prijs en een wagen die klopt met wat ze zeiden.', who: 'R. Vermeulen' },
  { quote: 'De mobiele car wash kwam gewoon tot aan de oprit, met de BUMPR-producten. Wagen zag eruit als nieuw.', who: 'S. De Clerck' },
  { quote: 'Onze oude Volvo is bij hen gerestaureerd tot in het kleinste detail. Compleet dossier erbij.', who: 'F. Janssens' },
];

export function Guestbook() {
  return (
    <section className="px-8 py-24">
      <div className="max-w-site mx-auto">
        <div className="eyebrow"><span className="dot" />Uit het gastenboek</div>
        <div className="grid md:grid-cols-3 gap-6.5 mt-9">
          {testimonials.map((t) => (
            <div key={t.who} className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[4px] px-6 py-7">
              <div className="font-display text-[38px] leading-none text-orange mb-2">&quot;</div>
              <p className="text-[14.5px] leading-relaxed">{t.quote}</p>
              <div className="mt-4 font-mono text-[11px] text-muted">— {t.who}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
