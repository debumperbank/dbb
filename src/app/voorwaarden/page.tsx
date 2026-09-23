export const metadata = {
  title: 'Algemene Voorwaarden — De Bumperbank',
};

export default function VoorwaardenPage() {
  return (
    <main className="px-8 py-20 bg-bg min-h-screen">
      <div className="max-w-site mx-auto max-w-[70ch]">
        <div className="eyebrow"><span className="dot" />Juridisch</div>
        <h1 className="mt-2.5 text-3xl md:text-4xl mb-6">Algemene Voorwaarden</h1>


        <div className="grid gap-7 text-[14.5px] leading-relaxed text-muted">
          <section>
            <h2 className="text-lg text-paper mb-2">1. Wie we zijn</h2>
            <p>
              De Bumperbank is een eenmanszaak gevestigd in Terneuzen, actief in de verkoop van
              tweedehands voertuigen (inclusief voertuigen met schade), voertuigherstelling,
              mobiele car wash en de verkoop van BUMPR-verzorgingsproducten.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">2. Toepasselijkheid</h2>
            <p>
              Deze voorwaarden zijn van toepassing op elk aanbod van De Bumperbank en op elke
              tot stand gekomen overeenkomst tussen De Bumperbank en een klant, tenzij schriftelijk
              anders is overeengekomen.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">3. Aanbod en prijzen</h2>
            <p>
              Vermelde prijzen zijn indicatief tot een aanbod schriftelijk of via e-mail is
              bevestigd. Kennelijke fouten of vergissingen in het aanbod binden De Bumperbank niet.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">4. Tweedehands voertuigen &amp; schadevoertuigen</h2>
            <p>
              Voertuigen worden verkocht met de kenmerken en eventuele gebreken zoals omschreven
              op het moment van aankoop. Bij voertuigen die als schadevoertuig of &quot;as-is&quot;
              worden aangeboden, wordt dit expliciet vermeld. Vraag bij twijfel altijd naar de
              volledige staat van het voertuig vóór aankoop.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">5. Herstellingen &amp; car wash</h2>
            <p>
              Voor werkplaatsdiensten en de mobiele car wash geldt dat een afspraak pas definitief
              is na bevestiging door De Bumperbank. Kosten voor bijkomend werk dat pas tijdens de
              uitvoering aan het licht komt, worden vooraf met de klant besproken.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">6. Garantie</h2>
            <p>
              Op tweedehands voertuigen gelden de wettelijke conformiteitsregels voor
              consumentenkoop. De precieze garantietermijn en -voorwaarden worden per voertuig
              afzonderlijk vermeld bij de verkoop.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">7. Aansprakelijkheid</h2>
            <p>
              De Bumperbank is niet aansprakelijk voor schade die het gevolg is van onjuiste of
              onvolledige informatie die door de klant is verstrekt, noch voor indirecte schade,
              behoudens opzet of grove nalatigheid.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">8. Klachten</h2>
            <p>
              Klachten kun je richten aan De Bumperbank via het{' '}
              <a href="/contact" className="text-orange hover:underline">contactformulier</a>.
              We streven ernaar binnen 5 werkdagen te reageren.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">9. Toepasselijk recht</h2>
            <p>Op deze voorwaarden is Nederlands recht van toepassing.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
