# Moneybird — BUMPR facturen

Administratie: **498995830364046671**.

## Wat is gebouwd

Een door Mollie bevestigde **betaalde livebestelling** kan een Moneybird-verkoopfactuur
krijgen. Producten en verzending worden inclusief btw overgenomen. Moneybird mailt de
factuur naar het besteladres voor e-mail, met de expliciete vermelding dat al betaald is.
De site verstuurt hiervoor geen extra Resend-factuurmail.

De koppeling staat standaard **uit**. De broncode alleen activeert geen facturen.
Testbetalingen worden altijd overgeslagen. De bestaande betaalflow blijft werken als
Moneybird niet geactiveerd is. Er zijn geen echte Moneybird-contacten/facturen aangemaakt
of klantmails verstuurd tijdens de implementatie.

## Eenmalig instellen

1. Voer `supabase/migrations/005_moneybird.sql` uit in de bestaande Supabase-database.
2. Voeg in Vercel Production `MONEYBIRD_API_TOKEN` toe. Gebruik een token met toegang
   tot deze administratie, contacten en verkoopfacturen. Deel de sleutel niet in chat of Git.
3. Kies de juiste Moneybird-instellingen en zet hun ID's in Vercel:
   - `MONEYBIRD_LEDGER_ACCOUNT_ID`: omzetcategorie voor BUMPR-producten en verzending.
   - `MONEYBIRD_TAX_RATE_NL`: toepasselijke verkoop-btw-code voor leveringen naar Nederland.
   - `MONEYBIRD_TAX_RATE_BE`: toepasselijke verkoop-btw-code voor leveringen naar België.
   - `MONEYBIRD_WORKFLOW_ID`: aparte webshopworkflow **zonder automatische betaalherinneringen**,
     met passende tekst voor reeds betaalde bestellingen.
   De code kiest geen btw-percentage of OSS-behandeling voor je. Controleer beide landcodes
   en de omzetcategorie met de verantwoordelijke voor je boekhouding.
4. Controleer wat de bestaande Moneybird/Mollie-koppeling werkelijk doet: alleen betaallinks,
   ook transacties importeren, automatisch facturen maken, of betalingen afletteren?
   Deze website maakt **geen extra betaalboeking** in Moneybird. Dat voorkomt een tweede
   registratie, maar bewijst niet dat de bestaande koppeling de geïmporteerde factuur automatisch
   als betaald markeert. Indien nodig moet de geïmporteerde Mollie-transactie aan de factuur worden
   gekoppeld. Zorg dat een andere koppeling niet eveneens facturen voor dezelfde bestelling maakt.
5. Pas na die controle: `MONEYBIRD_RECONCILIATION=external_reviewed`.
6. Zet `MONEYBIRD_ENABLED=true` en deploy. Zonder deze vlag worden geen exports uitgevoerd.

De administratie-ID staat bewust vast als string, zodat een onbedoelde instelling geen
klantgegevens naar een andere administratie stuurt.

## Verificatie voor automatische ingebruikname

Gebruik eerst een afzonderlijke testadministratie/kopie van deze integratie voor een proef
met een fictieve betaalde liveorder en een eigen ontvanger; verander het mode-veld van echte
productie-testorders niet om de uitsluiting te omzeilen. De vaste administratie-ID en testsleutels
maken gewone Mollie-testbetalingen nadrukkelijk ongeschikt voor een echte Moneybird-factuurtest.
Een productieproef vereist een afgesproken werkelijke verkoop.

Controleer factuurtotaal, btw-codes, grootboek, klantadres, PDF, afleverstatus in Moneybird,
geen betaalherinneringen, en de betaalboeking/aflettering van Mollie. Een `sent_at` van Moneybird
betekent dat het verzendproces is uitgevoerd, niet dat ontvangst in de inbox bewezen is.

## Herhalen en fouten

`/admin/orders` toont bij livebetaalde bestellingen de factuurstatus en een link naar Moneybird.
Bij een fout kan de beheerder kiezen voor **Controleer en hervat factuur**.
De Mollie-webhook geeft bij een exportfout 503 terug zodat een nieuwe poging kan volgen.
De opgeslagen betaalstatus blijft betaald; de beheermelding wordt ondanks een exportfout geprobeerd.

- Eén privé-exportrecord per bestelling en een atomaire claim voorkomen gelijktijdig aanmaken.
- Referentie `BUMPR-{order-id}` wordt vóór aanmaken opgezocht.
- Contacten gebruiken `bumpr-order-{order-id}`: een adresmomentopname per bestelling,
  dus bewust geen automatische samenvoeging van verschillende bestellingen op e-mailadres.
- Vóór contact/factuur aanmaken of mailen wordt een poging duurzaam vastgelegd.
- Na een timeout wordt eerst opgezocht of de factuur al bestaat/verstuurd is. Een onzekere
  aanmaak/verzending wordt niet blind herhaald: dit kan handmatige controle vereisen.
- Een gecrashte worker kan op `processing` blijven staan. Controleer dat de worker echt gestopt is
  en bekijk Moneybird, vóór een beheerder het exportrecord naar `error` terugzet. Wis pogingvlaggen
  nooit zonder te hebben uitgesloten dat de externe actie al plaatsvond.
- Refunds en creditnota's worden nog niet automatisch verwerkt.

Relevante foutcodes: `configuration_required`, `migration_required`, `invoice_mismatch`,
`invoice_creation_uncertain`, `invoice_sending_uncertain`, `http_401`, `http_422`, `http_429`.
Volledige API-antwoorden, tokens en klantgegevens worden niet gelogd.

## Validatie

Geautomatiseerde tests voor bruto bedragen/verzending, expliciete boekhoudinstellingen,
uitsluiting van test/onbetaalde orders, herhaalde en gelijktijdige callbacks, bestaande facturen,
verkeerde totalen/administratie, en timeouts bij aanmaken/verzenden. Geen Moneybird-netwerkverkeer
in deze tests. Een echte Moneybird-koppeling is nog niet getest wegens ontbrekende configuratie.

## Officiële documentatie

- https://developer.moneybird.com/integration/creating-sales-invoices
- https://developer.moneybird.com/api/sales-invoices
- https://developer.moneybird.com/api/contacts
