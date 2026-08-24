# De Bumperbank — Next.js + Supabase

Verkoopsite voor De Bumperbank: voorraadbeheer, herstelling/car-wash
leads, de oldtimer-afdeling met restauratiedossiers, en de BUMPR
productlijn — gebouwd op Next.js 14 (App Router) en Supabase.

## 1. Vereisten

- Node.js 20+
- Een gratis Supabase-project ([supabase.com](https://supabase.com))

## 2. Installeren

```bash
npm install
```

## 3. Supabase opzetten

1. Maak een nieuw project aan op supabase.com.
2. Open de **SQL Editor** in het Supabase-dashboard en voer, in deze volgorde, uit:
   - `supabase/schema.sql` — het volledige datamodel + Row Level Security
   - `supabase/storage.sql` — de opslagbucket + policy voor autofoto's
   - `supabase/seed.sql` (optioneel) — voorbeelddata, waaronder de huidige BUMPR-prijzen
3. Ga naar **Project Settings → API** en kopieer:
   - de **Project URL**
   - de **anon public key**
   - de **service_role key** (geheim houden!)
4. Maak je eerste beheeraccount aan onder **Authentication → Users → Add user**
   (e-mail + wachtwoord). Er is bewust geen zelfregistratie — nieuwe
   beheerders voeg je zelf toe via het Supabase-dashboard.

## 4. Environment variabelen

```bash
cp .env.local.example .env.local
```

Vul de drie waarden uit stap 3 in.

## 5. Lokaal draaien

```bash
npm run dev
```

Ga naar [http://localhost:3000](http://localhost:3000) voor de site, en naar
[http://localhost:3000/admin](http://localhost:3000/admin) voor het beheerpaneel
(log in met het account dat je in stap 3.4 hebt aangemaakt).

## 6. Deployen

De eenvoudigste route is [Vercel](https://vercel.com): koppel de
GitHub-repo, zet dezelfde drie environment variabelen in het Vercel-
dashboard, en deploy. Supabase en Vercel werken naadloos samen.

## Beheerpaneel (/admin)

Beveiligd met Supabase Auth (e-mail + wachtwoord) — middleware stuurt
niet-ingelogde bezoekers automatisch naar `/admin/login`. Vanuit het
paneel kun je:

- **Voorraad** — wagens toevoegen, status wijzigen (concept/actief/
  gereserveerd/verkocht), foto's uploaden naar Supabase Storage, en
  voor oldtimers dossierposten toevoegen aan het restauratiedossier.
- **Interesses** — alle inquiries vanuit de auto-detailpagina's en het
  contactformulier, met statusbeheer (nieuw/opgevolgd/afgerond).
- **Boekingen** — aanvragen voor de mobiele car wash en werkplaats,
  beide met eigen statusbeheer.

De beheerpagina's gebruiken de service-role key (bypassed RLS) — dat
mag hier omdat de middleware al een ingelogde Supabase-gebruiker
afdwingt voordat er iets wordt getoond.

## Projectstructuur

```
src/
  app/
    page.tsx                 → homepage (haalt live voorraad + BUMPR op)
    voorraad/page.tsx         → volledige voorraadlijst
    voorraad/[id]/page.tsx    → auto-detailpagina + restauratiedossier + contactformulier
    oldtimers/page.tsx        → oldtimer-afdeling
    bumpr/page.tsx            → BUMPR productpagina
    contact/page.tsx          → contactformulieren (algemeen / car wash / werkplaats)
    admin/
      login/page.tsx              → inlogscherm (Supabase Auth)
      page.tsx                    → dashboard met kerncijfers
      listings/page.tsx           → voorraadoverzicht + statusbeheer
      listings/new/page.tsx       → nieuwe wagen toevoegen
      listings/[id]/page.tsx      → wagen bewerken, foto's uploaden, dossier bijhouden
      inquiries/page.tsx          → interesses beheren
      bookings/page.tsx           → car wash- en werkplaatsboekingen beheren
    api/
      inquiries/route.ts          → verwerkt interesse in een auto
      car-wash/route.ts           → verwerkt mobiele car wash-aanvragen
      workshop-bookings/route.ts  → verwerkt werkplaats-aanvragen
  components/                 → UI-componenten (Nav, Hero, StockGrid, BumprSection, ...)
  lib/
    supabase/
      client.ts   → browserclient (Client Components)
      server.ts   → serverclient (Server Components, respecteert RLS)
      admin.ts     → service-role client — alleen voor vertrouwde server-code
    types.ts       → TypeScript-types die het databaseschema volgen
    format.ts       → prijs/kilometerstand-formattering
supabase/
  schema.sql   → volledig databaseschema + Row Level Security policies
  seed.sql     → voorbeelddata (huidige voorraad + BUMPR-lijn)
```

## Datamodel (kort)

- **cars** — het fysieke voertuig (merk, model, bouwjaar, km-stand…)
- **listings** — het verkoopaanbod: prijs, status, afdeling (verkoop/oldtimer)
- **restoration_events** — restauratiedossier per auto (voor oldtimers)
- **inquiries** — leads vanuit het contactformulier, gekoppeld aan een listing
- **deposits** / **transactions** — voor een latere aanbetalings-/betaalflow
- **bumpr_products** — de BUMPR-productlijn, inclusief de bundel
- **car_wash_bookings** / **workshop_bookings** — aanvragen voor mobiele
  car wash en werkplaatsafspraken
- Supabase Storage bucket **listing-photos** (publiek leesbaar, alleen
  beschrijfbaar via de service-role key — dus enkel vanuit het
  beheerpaneel)

Row Level Security staat overal aan: bezoekers kunnen alleen actieve
voorraad, restauratiedossiers en BUMPR-producten lézen, en mogen alleen
*insert*-en in de lead-tabellen (inquiries, bookings) — nooit lezen wat
anderen hebben ingestuurd. Alles daarbuiten (sellers, deposits,
transactions, en beheer van de lead-tabellen) is enkel toegankelijk via
de service-role key, dus vanuit vertrouwde server-code zoals een
beheeromgeving of een betalings-webhook.

## E-mailnotificaties (optioneel)

Bij een nieuwe interesse, car wash-aanvraag of werkplaatsboeking kan de
site automatisch een meldingsmail sturen via [Resend](https://resend.com)
(gratis tot 100 mails/dag). Dit is optioneel — zonder configuratie werkt
alles gewoon door, dan wordt de mail simpelweg overgeslagen.

Om het aan te zetten: maak een gratis Resend-account, haal een API-key
op, en zet in `.env.local`:

```
RESEND_API_KEY=re_jouw_key
NOTIFY_EMAIL=jouw-email@voorbeeld.nl
```

## Nog te doen / uitbreidingen

- Een echte betaalprovider (bv. Stripe of Mollie) gekoppeld aan de
  `deposits`/`transactions`-tabellen voor aanbetalingen.
- Rollen/rechten binnen het beheerpaneel als er meerdere beheerders
  met verschillende bevoegdheden bijkomen (nu: elke Supabase Auth-
  gebruiker die je aanmaakt heeft volledige toegang).
