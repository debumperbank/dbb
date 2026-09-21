const services = [
  { num: '01', title: 'Verkoop', desc: 'Tweedehands wagens met transparante historie, nagekeken voor ze op het plein staan.' },
  { num: '02', title: 'Herstelling', desc: 'Onderhoud en herstellingen door eigen mecaniciens, zonder tussenpersonen.' },
  { num: '03', title: 'Mobiele car wash', desc: 'Wij komen naar uw oprit — grondige reiniging met de BUMPR-productlijn.' },
  { num: '04', title: 'Oldtimer afdeling', desc: 'Aankoop, verkoop en restauratie van klassiekers met volledig dossier.' },
  { num: '05', title: 'BUMPR', desc: 'Onze eigen detailingreeks, ontwikkeld en getest in de werkplaats.' },
];

export function StripBar() {
  return (
    <section className="px-8 py-8 border-y border-[color:var(--line-dark)]">
      <div className="max-w-site mx-auto flex items-center gap-9 flex-wrap justify-between">
        <div className="eyebrow"><span className="dot" />Wat we doen</div>
        <div className="flex gap-6 flex-wrap font-display text-[15px] text-muted">
          {services.map((s, i) => (
            <span key={s.title} className={i > 0 ? "before:content-['●'] before:text-orange before:text-[6px] before:mr-6 before:align-middle" : ''}>
              {s.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceGrid() {
  return (
    <section id="diensten" className="px-8 py-24 bg-paper text-ink">
      <div className="max-w-site mx-auto">
        <div className="flex justify-between items-end gap-6 flex-wrap mb-12">
          <div>
            <div className="eyebrow text-orange-deep"><span className="dot" />Het aanbod</div>
            <h2 className="mt-2.5 text-3xl md:text-4xl">Vijf disciplines, één zaak</h2>
          </div>
          <p className="max-w-[36ch] text-muted-dark text-sm leading-relaxed">
            Elke dienst los te boeken, of gecombineerd — alles onder één dak in de werkplaats.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[color:var(--line-light)] border border-[color:var(--line-light)]">
          {services.map((s) => (
            <div key={s.num} className="bg-paper hover:bg-paper-2 transition-colors px-5 py-7">
              <div className="font-mono text-[11px] text-orange-deep">{s.num}</div>
              <h3 className="text-[17px] font-semibold mt-3.5 mb-2">{s.title}</h3>
              <p className="text-[12.8px] text-muted-dark leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
