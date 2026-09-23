# Mobiele autoservice & CRM

De bestaande Next.js/Supabase-site is uitgebreid naar het eerder beschreven mobiele bedrijfsmodel.
Er zijn geen productiegegevens gewijzigd en er is niets gedeployd.

## Beschikbaar

- Nieuwe homepage, navigatie en dienstenpagina’s: mobiele autoservice, onderhoud/reparatie en detailing in regio Hulst.
- `/afspraak`: contactgegevens, voertuig, werkzaamheden, locatie, voorkeursdatum/-dagdeel en privéfoto’s.
- `/auto-verkopen`: kenteken, kilometerstand, staat, onderhoud, gebreken, gewenste prijs, contactgegevens en privéfoto’s.
- `/admin/appointments`: nieuwe aanvragen apart van bevestigde afspraken; verplaatsen, annuleren en afronden in het detail.
- `/admin/customers` en `/admin/vehicles`: dossiers met contactgegevens, voertuigen en werkzaamheden.
- `/admin/work-orders`: werknotities, geschatte/eindprijs, werktijd en reistijd. Privéfoto’s vóór/tijdens/na het werk.
- `/admin/trade-ins`: inkoop beoordelen, contactgegevens en foto’s bekijken, status en notities vastleggen.
- `/occasions` gebruikt de bestaande voorraad. Foto’s verschijnen op detailpagina’s; oude `/voorraad`-links blijven werken.
- Metadata, sitemap, robotsregels en gestructureerde gegevens voor mobiele autoservice.

## Database activeren

1. Open de SQL Editor van het Supabase-project dat bij deze installatie hoort.
2. Bij een bestaande installatie: controleer dat migraties 001 en 002 zijn uitgevoerd.
3. Voer **eenmaal** `supabase/migrations/003_mobile_crm.sql` uit. Het bestand bevat één transactie.
4. Herstart de lokale site of publiceer de update via je bestaande hostingproces.

De migratie voegt `customers`, `vehicles`, `appointments`, `trade_ins`, `request_photos`,
een privébucket `request-photos` en een uitsluitend server-toegankelijke invoerfunctie toe.
De bestaande tabellen blijven intact. Aanvraag, klant, voertuig en fotoreferenties worden in één
SQL-transactie aangemaakt. Bij een mislukte database-opslag verwijdert de API reeds geüploade foto’s.

Het oorspronkelijke `schema.sql` is niet opnieuw bedoeld voor een bestaande installatie.
Voor een nieuwe installatie: `schema.sql`, `storage.sql`, vervolgens migratie 003.

## Configuratie

De bestaande Supabase-URL, publieke sleutel en service-role-sleutel blijven in `.env.local`.
Er worden geen sleutels aan de browser toegevoegd. Optioneel: `NEXT_PUBLIC_SITE_URL` voor het
publieke domein van sitemap en metadata; standaard `https://debumperbank.nl`.

Alle bestaande Supabase Auth-gebruikers blijven beheerders, zoals in de oorspronkelijke site.
Nieuwe serveracties controleren de sessie expliciet. Ook de bestaande voorraad- en leadacties
controleren die nu expliciet. Het hele beheer wordt per verzoek geladen, nooit statisch gebouwd.

## Werkwijze

Een aanvraag is geen bevestigde afspraak. Kies in beheer een starttijd voordat je bevestigt.
Controleer zelf beschikbaarheid en reistijd. Het bewerken gebruikt de tijdzone van je apparaat;
het agendaoverzicht toont tijden in Europe/Amsterdam. Opslaan verstuurt geen klantbericht.
Nieuwe afspraak- en inkoopaanvragen sturen na succesvolle opslag een Resend-melding naar `NOTIFY_EMAIL`.
Stel `RESEND_API_KEY` en `NOTIFY_EMAIL` in op je hosting. Optioneel: `NOTIFY_FROM_EMAIL`
voor een afzender op je geverifieerde Resend-domein; standaard wordt de Resend-testafzender gebruikt.
De Resend-testafzender kan alleen naar toegestane testontvangers mailen. De melding bevat klant- en
voertuiggegevens, aanvraagdetails en een link naar het beheer. Antwoorden gaat naar de klant.
Foto’s blijven privé in het beheer. Er wordt geen bevestigingsmail aan de klant gestuurd.
Een mailfout wordt gelogd en maakt de opgeslagen aanvraag niet ongedaan; er is geen automatische
herhaalwachtrij. Controleer het dashboard ook als er geen melding binnenkomt.
Bestaande meldingen voor de oude formulieren zijn ongewijzigd.

Foto’s: maximaal drie per publieke aanvraag, maximaal 1 MB per JPG/PNG/WebP. Werkfoto’s worden
per foto toegevoegd. Afgeschermde links verlopen na tien minuten; herlaad de pagina voor nieuwe links.

Klantgegevens worden per aanvraag vastgelegd. Er is nog geen automatische of handmatige dossierfusie;
ongeverifieerde e-mailadressen/kentekens overschrijven nooit een bestaand dossier.
Diensten staan voorlopig in `src/lib/services.ts`, niet in een bewerkbare dienstencatalogus.
Werkorders zijn gekoppeld aan de afspraak, zonder aparte factuuradministratie.
Omzet op het dashboard betekent vastgelegde eindprijzen van afgeronde afspraken in die planningsmaand,
niet ontvangen betalingen. Aparte medewerkersrollen, offertes, facturatie, onderdelenvoorraad,
APK-workflow en automatische route-/conflictplanning vallen buiten deze versie.

## Controles

- `npm run build`: productiebuild inclusief typecontrole.
- `npm run lint`: codecontrole.
- `npm test`: Controles voor e-mailmeldingen, invoer, datums, bedragen, uploadvalidatie, privétoegang en foutafhandeling.
- Homepage, afspraakformulier, locatiekeuze, inkoopformulier en loginbeveiliging visueel gecontroleerd.

Database-integratie kan pas na migratie worden gecontroleerd. Er zijn geen testaanvragen in de live
database aangemaakt. Controleer na migratie op een testproject: aanvraag met foto verschijnt met gekoppeld
klant-/voertuigdossier; anonieme gebruikers kunnen geen CRM-gegevens lezen; bevestigen vereist een
starttijd; notities, prijzen en werkfoto’s blijven bewaard; een inkoopaanvraag verschijnt in Inkoop.
