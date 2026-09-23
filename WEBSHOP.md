# BUMPR webshop — Mollie

De webshop biedt een blijvend winkelmandje, aantallen aanpassen/verwijderen, verzendadres,
een besteloverzicht en betaling via de gehoste Mollie-checkout.

## Verzendtarieven

- Nederland: €4,99.
- België: €6,99.
- In beide landen gratis vanaf €50 aan producten.
- Alleen verzending, geen afhalen. De tarieven staan in `src/lib/shop.ts` en worden
  zowel op de checkout getoond als op de server berekend.

## Eenmalig instellen

1. Voer `supabase/migrations/004_bumpr_shop.sql` eenmaal uit in Supabase. Dit voegt
   privébestellingen en het veld `is_available` aan de productcatalogus toe.
   De bestaande CRM-migratie 003 blijft nodig voor de afspraakfuncties; migratie 004
   heeft alleen de bestaande `bumpr_products`-tabel nodig.
2. Stel op de hosting `MOLLIE_API_KEY` in. Begin met een `test_`-sleutel uit je eigen
   Mollie-account. Gebruik pas na een geslaagde controle een `live_`-sleutel.
3. Stel `NEXT_PUBLIC_SITE_URL` in op de werkelijke publieke HTTPS-URL van de webshop.
   Deze URL moet van buitenaf bereikbaar zijn. Localhost kan geen Mollie-webhooks ontvangen.
4. Zorg dat de gewenste betaalmethoden, waaronder iDEAL, actief zijn in het Mollie-account.
5. Configureer `RESEND_API_KEY`, `NOTIFY_EMAIL` en bij voorkeur `NOTIFY_FROM_EMAIL` op
   een geverifieerd Resend-domein. De standaardafzender is alleen voor Resend-tests bedoeld.
6. Deploy de code. De webhook-URL wordt per betaling automatisch meegestuurd:
   `/api/shop/webhook`. Een aparte handmatige webhookregistratie is niet nodig voor deze flow.

Zet geheime sleutels nooit in `NEXT_PUBLIC_*`-variabelen, broncode of versiebeheer.
Er zijn tijdens het bouwen geen echte betalingen of testbestellingen in de gekoppelde database aangemaakt.

## Betaling en beheer

De server haalt productprijzen uit Supabase, negeert prijzen uit het mandje, controleert aantallen
en bestemming en vergelijkt het totaal met wat de klant heeft gezien. Een gewijzigde prijs vraagt
om een vernieuwd besteloverzicht voordat betaling start. Een vastgelegde bestelling bewaart de
productnamen en prijzen als momentopname.

Een browserpoging heeft een unieke sleutel. Herhaalde aanvragen met dezelfde gegevens gebruiken
één bestelling en één Mollie-idempotentiesleutel. Een mislukte of verlopen betaling kan opnieuw
worden gestart vanuit het bewaarde mandje. Mollie beheert het daadwerkelijk kiezen van de betaalmethode.

De retourpagina is geen bewijs van betaling. De server controleert de betaling via de Mollie-API:
orderreferentie, bedrag, valuta, test/live-omgeving en betaalreferentie moeten overeenkomen.
De webhook slaat de betaalstatus op; de retourpagina controleert deze ook zodat de klant een
actuele status kan zien. Een latere oude callback kan `paid` niet terugzetten naar onbetaald.

Na een bevestigde betaling krijgt het beheerteam een Resend-melding met de bestelling en het
verzendadres. Foto’s of betaalkaartgegevens worden niet via de site opgeslagen. Een mailfout
maakt een betaalde bestelling niet ongedaan; de webhook geeft een fout terug zodat Mollie opnieuw
kan proberen. Resend-idempotentie voorkomt dubbele meldingen bij gelijktijdige callbacks.
Er is nog geen aparte automatische bevestigings- of verzendmail aan de klant.

`/admin/orders` toont de laatste 100 bestellingen. Alleen betaalde livebestellingen kunnen daar
als verzonden worden gemarkeerd, met een optionele track-en-trace-referentie. Testbetalingen worden
als TEST gemarkeerd en mogen niet worden verzonden. Retourbetalingen en geschillen beheer je voorlopig
in Mollie; deze eerste versie synchroniseert nog geen terugbetalingen/chargebacks of voorraadstanden.
Zet producten die niet besteld mogen worden in Supabase op `is_available = false`.

## Controle vóór livegebruik

Test op een publiek bereikbare testomgeving met de Mollie-testsleutel:

- Product toevoegen, pagina herladen, aantal wijzigen en verwijderen op mobiel en desktop.
- Nederland €4,99 en België €6,99 onder €50; beide gratis op/vanaf €50.
- Correct totaal vóór betaling en dezelfde bedragen in Mollie.
- Geslaagde, mislukte, geannuleerde en verlopen betaling.
- Herhaalde checkout/webhook zonder dubbele order of melding.
- Bestelling zichtbaar in beheer; geen anonieme toegang tot adressen of alle bestellingen.
- Betaalde order blijft betaald als een notificatie mislukt.

Codecontroles: `npm test`, `npm run lint`, `npm run build`.
De bestaande voorwaarden en het privacybeleid zijn nog conceptteksten uit het oorspronkelijke project.

## Primaire API-documentatie

- https://docs.mollie.com/reference/create-payment
- https://docs.mollie.com/reference/payments-api-webhooks
- https://docs.mollie.com/reference/api-idempotency
