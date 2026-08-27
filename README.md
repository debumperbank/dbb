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
2. Open de **SQL Editor** in het Supabase-dashboard en voer eerst
   `supabase/schema.sql` uit, daarna `supabase/seed.sql` (optioneel,
   maar handig om meteen voorbeelddata te hebben — de huidige BUMPR-
   producten en een paar auto's staan er al in).
3. Ga naar **Project Settings → API** en kopieer:
   - de **Project URL**
   - de **anon public key**
   - de **service_role key** (geheim houden!)

## 4. Environment variabelen

```bash
cp .env.local.example .env.local
```

Vul de drie waarden uit stap 3 in.

## 5. Lokaal draaien

```bash
npm run dev
```

Ga naar [http://localhost:3000](http://localhost:3000).

## 6. Deployen

De eenvoudigste route is [Vercel](https://vercel.com): koppel de
GitHub-repo, zet dezelfde drie environment variabelen in het Vercel-
dashboard, en deploy. Supabase en Vercel werken naadloos samen.

## Projectstructuur

```
src/
  app/
    page.tsx                 → homepage (haalt live voorraad + BUMPR op)
    voorraad/page.tsx         → volledige voorraadlijst
    voorraad/[id]/page.tsx    → auto-detailpagina + restauratiedossier + contactformulier
    oldtimers/page.tsx        → oldtimer-afdeling
    bumpr/page.tsx            → BUMPR productpagina
    contact/page.tsx          → algemeen contactformulier
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

Row Level Security staat overal aan: bezoekers kunnen alleen actieve
voorraad, restauratiedossiers en BUMPR-producten lézen, en mogen alleen
*insert*-en in de lead-tabellen (inquiries, bookings) — nooit lezen wat
anderen hebben ingestuurd. Alles daarbuiten (sellers, deposits,
transactions, en beheer van de lead-tabellen) is enkel toegankelijk via
de service-role key, dus vanuit vertrouwde server-code zoals een
beheeromgeving of een betalings-webhook.

## Nog te doen / uitbreidingen

- Een beveiligd `/admin`-gedeelte (Supabase Auth) om voorraad, oldtimer-
  dossiers en bookings te beheren.
- Foto's per listing (tabel `listing_photos` bestaat al) + Supabase
  Storage voor de uploads.
- Een echte betaalprovider (bv. Stripe of Mollie) gekoppeld aan de
  `deposits`/`transactions`-tabellen voor aanbetalingen.
- E-mailnotificaties bij een nieuwe inquiry/booking (bv. via Resend).
