import Link from "next/link";

export function OurStory() {
  return (
    <section className="relative overflow-hidden bg-[#0d0f11] px-5 py-20 md:px-8 md:py-24">
      <div className="absolute right-0 top-0 h-full w-[35%] bg-[linear-gradient(135deg,transparent_0%,rgba(245,208,40,.035)_48%,transparent_49%)]" />
      <div className="relative mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <div className="eyebrow"><span className="dot" /> Over De Bumperbank</div>
          <h2 className="mt-4 max-w-[13ch] text-4xl md:text-5xl">
            Automotive ervaring. Service bij jou op locatie.
          </h2>
          <p className="mt-5 max-w-[45ch] text-sm leading-7 text-muted">
            Eén aanspreekpunt, duidelijke afspraken en aandacht voor de auto alsof het onze eigen wagen is.
          </p>
          <Link href="/over-ons" className="btn btn-ghost mt-7">Meer over ons →</Link>
        </div>

        <div className="grid gap-5 text-sm leading-7 text-muted md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/20 p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">01 / Persoonlijk</span>
            <p className="mt-4">
              De Bumperbank werkt bewust kleinschalig. Daardoor blijft er aandacht voor het voertuig,
              de klant en het werk dat echt nodig is.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">02 / Duidelijk</span>
            <p className="mt-4">
              We bespreken vooraf de werkzaamheden, leggen uit wat we aantreffen en communiceren helder
              over aanpak en kosten.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">03 / Verantwoord</span>
            <p className="mt-4">
              Vloeistoffen en materialen worden zorgvuldig opgevangen en via daarvoor bestemde kanalen
              afgevoerd of gerecycled.
            </p>
          </div>
          <div className="rounded-xl border border-orange/25 bg-orange/[0.04] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">04 / Onze visie</span>
            <p className="mt-4 text-paper/80">
              Werk dat veilig en professioneel op locatie kan, brengen we naar de klant. Voor grotere
              werkzaamheden zoeken we de passende werkplaatsoplossing.
            </p>
            <p className="mt-5 font-display text-lg font-semibold text-paper">Jouw auto. Onze zorg.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
