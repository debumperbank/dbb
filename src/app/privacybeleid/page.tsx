export const metadata = {
  title: "Privacybeleid — De Bumperbank",
};

export default function PrivacybeleidPage() {
  return (
    <main className="px-8 py-20 bg-bg min-h-screen">
      <div className="max-w-site mx-auto max-w-[70ch]">
        <div className="eyebrow">
          <span className="dot" />
          Juridisch
        </div>
        <h1 className="mt-2.5 text-3xl md:text-4xl mb-6">Privacybeleid</h1>

        <div className="bg-bg-soft border border-orange/40 rounded-[4px] px-5 py-4 mb-10 text-[13px] text-muted leading-relaxed">
          <strong className="text-orange">Concepttekst.</strong> Dit is een
          startpunt op basis van de gegevens die de site daadwerkelijk
          verzamelt, geen juridisch geverifieerde tekst. Laat dit nakijken door
          een jurist voordat je &apos;m als definitief beschouwt.
        </div>

        <div className="grid gap-7 text-[14.5px] leading-relaxed text-muted">
          <section>
            <h2 className="text-lg text-paper mb-2">
              1. Verwerkingsverantwoordelijke
            </h2>
            <p>
              De Bumperbank, gevestigd in Terneuzen, is verantwoordelijk voor de
              verwerking van persoonsgegevens zoals beschreven in dit
              privacybeleid.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">
              2. Welke gegevens we verzamelen
            </h2>
            <p>
              Via de formulieren op deze website verzamelen we, afhankelijk van
              het formulier:
            </p>
            <ul className="list-disc pl-5 mt-2 grid gap-1">
              <li>
                Naam, e-mailadres en telefoonnummer (verplicht bij afspraak- en
                inkoopaanvragen)
              </li>
              <li>
                Bij een interesse in een voertuig: je bericht en het voertuig
                waar het om gaat
              </li>
              <li>
                Bij een mobiele car wash-aanvraag: je adres en de gewenste datum
              </li>
              <li>
                Bij een afspraakaanvraag: kenteken, merk/model, kilometerstand,
                werkzaamheden, locatie en voorkeursdatum/-tijd
              </li>
              <li>
                Bij een inkoopaanvraag: kenteken, kilometerstand, staat,
                onderhoud, schade/gebreken en gewenste prijs
              </li>
              <li>
                Bij een BUMPR-bestelling: contactgegevens, verzendadres, gekozen producten, betaalreferentie en betaalstatus. Kaartgegevens worden bij de betaalprovider verwerkt.</li>
              <li>Foto’s die je zelf aan een aanvraag toevoegt; deze zijn alleen
                toegankelijk voor het beheerteam
              </li>
              <li>
                Bij de uitvoering: planning, werknotities en afgesproken
                prijzen, gekoppeld aan je klant- en voertuigdossier
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">
              3. Waarvoor we deze gegevens gebruiken
            </h2>
            <p>
              Uitsluitend om contact met je op te nemen over je aanvraag, een
              afspraak in te plannen, werkzaamheden bij te houden, of je vraag
              te beantwoorden. We gebruiken je gegevens niet voor marketing
              zonder je aparte toestemming, en verkopen ze nooit aan derden.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">4. Bewaartermijn</h2>
            <p>
              We bewaren aanvraaggegevens zolang nodig is om je verzoek te
              behandelen en eventuele vervolgcontacten mogelijk te maken, en
              verwijderen ze daarna binnen een redelijke termijn, tenzij een
              langere bewaartermijn wettelijk verplicht is (bv. voor facturen).
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">5. Delen met derden</h2>
            <p>
              We delen gegevens met de partijen die nodig zijn om de website en
              de dienstverlening te laten werken: onze hostingpartij, onze
              database-provider (Supabase) voor opslag, en — enkel als we een
              meldingsmail sturen bij een nieuwe aanvraag — onze e-mailprovider
              (Resend). Deze partijen verwerken je gegevens uitsluitend in onze
              opdracht.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">6. Jouw rechten</h2>
            <p>
              Je hebt het recht op inzage, correctie, verwijdering en bezwaar
              met betrekking tot je persoonsgegevens. Neem hiervoor contact op
              via het{" "}
              <a href="/contact" className="text-orange hover:underline">
                contactformulier
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg text-paper mb-2">7. Klacht indienen</h2>
            <p>
              Ben je niet tevreden over hoe we met je gegevens omgaan? Je hebt
              het recht een klacht in te dienen bij de Autoriteit
              Persoonsgegevens.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
