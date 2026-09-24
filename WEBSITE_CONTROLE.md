# Websitecontrole — 24 september 2026

## Resultaat

75 geautomatiseerde tests geslaagd. Productiebuild inclusief TypeScript en lint geslaagd.
De 16 gecontroleerde publieke pagina's op https://www.debumperbank.nl geven HTTP 200.
Sitemap en robots.txt geven HTTP 200. /admin en /admin/orders verwijzen zonder sessie naar inloggen.
Het hoofddomein verwijst correct door naar www.

In de live browser gecontroleerd: product toevoegen, aantal aanpassen, mandje bewaren na herladen,
checkoutoverzicht en gratis verzending boven €50. Testproducten weer verwijderd.
Verzendgrens €50 en NL/BE-tarieven worden ook door geautomatiseerde tests gecontroleerd.

## Lokaal hersteld, nog te publiceren

- Beheer vereist nu het bevestigde account debumperbank@gmail.com. Alleen ingelogd zijn volstaat niet meer.
  Controle toegevoegd aan login, middleware, serveracties, beheergegevens en foto-upload.
  Het account bestaat en is bevestigd in de gekoppelde Supabase-database.
- Algemene vragen en de oudere boekingsroutes gebruiken dezelfde configureerbare Resend-afzender
  en foutafhandeling als de nieuwere aanvraagroute. Een mailstoring maakt een opgeslagen aanvraag niet ongedaan.
- Toestemming accepteert alleen een aangevinkte HTML-checkbox (`on`) of boolean true.
- Niet-beschikbare producten kunnen niet meer vanaf de productkaart worden toegevoegd.
- Mobiele navigatie paste niet binnen 390px. Hersteld; de productiebuild gecontroleerd op 320px en 1536px zonder horizontale overflow.

## Supabase

Database bereikbaar met de lokale configuratie. Productcatalogus bevat vier producten.
CRM- en besteltabellen bestaan; shopproducten hebben is_available.
Anonieme toegang tot customers, appointments, request_photos en shop_orders geeft 401 / permission denied.
Catalogus is openbaar leesbaar. request-photos is privé, listing-photos openbaar.
Registratie staat nog open in Supabase Auth. De nieuwe applicatiecontrole weigert andere accounts als beheerder.
Schakel openbare registratie uit in Supabase als deze niet nodig is.
Geen records of bestanden aangemaakt, gewijzigd of verwijderd in Supabase tijdens deze audit.

## Resend en betalingen: resterende verificatie

De lokaal ingestelde Resend-sleutel werkt voor het lezen van domeinen.
Het domein debumperbank.nl heeft status verified.
Lokaal ontbreekt NOTIFY_FROM_EMAIL; de code valt daarom terug op onboarding@resend.dev (testafzender).
Stel op de hosting bijvoorbeeld NOTIFY_FROM_EMAIL='De Bumperbank <info@debumperbank.nl>' in.
RESEND_API_KEY en NOTIFY_EMAIL zijn lokaal aanwezig. De Vercel-waarden zijn niet ingezien.
Er is geen echte e-mail verzonden: daadwerkelijke ontvangst is dus nog niet bewezen.

MOLLIE_API_KEY en NEXT_PUBLIC_SITE_URL ontbreken lokaal. Controleer de productie-instellingen op Vercel;
gebruik voor de site-URL https://www.debumperbank.nl. Er is geen betaling gestart of afgerond.
De betaal- en webhooklogica is met mocks getest, niet volledig tegen Mollie.

## Grenzen van deze controle

Geen ingelogde beheersessie of echte formulierinzending met opslag getest. Lege formulieren geven lokaal 400;
beveiligde pagina's verwijzen naar login en een order zonder toegangstoken geeft 404.
Privégegevens zijn niet weergegeven. Werkelijke aflevering van mail, succesvolle betaling en volledige
beheerworkflow moeten nog met een afgesproken testaanvraag/testbetaling worden gecontroleerd.
De wijzigingen zijn niet gepusht of gedeployd.
