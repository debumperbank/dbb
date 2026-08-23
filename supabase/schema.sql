-- De Bumperbank — database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ========== SELLERS ==========
-- A seller can be the shop itself or, later, a third-party consignor.
create table if not exists sellers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('shop', 'private')) default 'shop',
  email text,
  phone text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ========== CARS ==========
-- The physical vehicle. Separate from `listings` so a car can be
-- relisted, and so oldtimer restoration history survives a sale.
create table if not exists cars (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  build_year int not null,
  vin text,
  mileage_km int,
  fuel_type text check (fuel_type in ('benzine', 'diesel', 'elektrisch', 'hybride', 'lpg')),
  transmission text check (transmission in ('handgeschakeld', 'automaat')),
  is_oldtimer boolean not null default false,
  description text,
  created_at timestamptz not null default now()
);

-- ========== LISTINGS ==========
-- The commercial offer: a car, priced, owned by a seller, in a department.
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references cars(id) on delete cascade,
  seller_id uuid not null references sellers(id) on delete restrict,
  department text not null check (department in ('verkoop', 'oldtimer')) default 'verkoop',
  price_cents int not null,
  currency text not null default 'EUR',
  status text not null check (status in ('draft', 'active', 'reserved', 'sold')) default 'draft',
  slug text unique,
  listed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

-- ========== RESTORATION HISTORY (oldtimer dossier) ==========
create table if not exists restoration_events (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references cars(id) on delete cascade,
  event_date date not null,
  title text not null,
  description text,
  cost_cents int,
  performed_by text,
  created_at timestamptz not null default now()
);

-- ========== INQUIRIES (no shopping cart — every sale starts as a lead) ==========
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null check (status in ('new', 'contacted', 'closed')) default 'new',
  created_at timestamptz not null default now()
);

-- ========== DEPOSITS & TRANSACTIONS ==========
create table if not exists deposits (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  inquiry_id uuid references inquiries(id) on delete set null,
  amount_cents int not null,
  currency text not null default 'EUR',
  status text not null check (status in ('pending', 'paid', 'refunded')) default 'pending',
  provider_reference text,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  deposit_id uuid references deposits(id) on delete set null,
  type text not null check (type in ('deposit', 'final_payment', 'refund')),
  amount_cents int not null,
  status text not null check (status in ('pending', 'succeeded', 'failed')) default 'pending',
  created_at timestamptz not null default now()
);

-- ========== BUMPR PRODUCT LINE ==========
create table if not exists bumpr_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_cents int not null,
  size_ml int,
  is_bundle boolean not null default false,
  bundle_of text[], -- slugs of included products, only set when is_bundle = true
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ========== MOBILE CAR WASH BOOKINGS ==========
create table if not exists car_wash_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  address text not null,
  requested_date date,
  notes text,
  status text not null check (status in ('new', 'scheduled', 'done', 'cancelled')) default 'new',
  created_at timestamptz not null default now()
);

-- ========== WORKSHOP (HERSTELLING) BOOKINGS ==========
create table if not exists workshop_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service_type text,
  requested_date date,
  notes text,
  status text not null check (status in ('new', 'scheduled', 'done', 'cancelled')) default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_listings_status on listings(status);
create index if not exists idx_listings_department on listings(department);
create index if not exists idx_listing_photos_listing on listing_photos(listing_id);
create index if not exists idx_restoration_events_car on restoration_events(car_id);
create index if not exists idx_inquiries_listing on inquiries(listing_id);

-- ========== ROW LEVEL SECURITY ==========
alter table sellers enable row level security;
alter table cars enable row level security;
alter table listings enable row level security;
alter table listing_photos enable row level security;
alter table restoration_events enable row level security;
alter table inquiries enable row level security;
alter table deposits enable row level security;
alter table transactions enable row level security;
alter table bumpr_products enable row level security;
alter table car_wash_bookings enable row level security;
alter table workshop_bookings enable row level security;

-- Public (anon) read access to the catalogue-facing tables.
create policy "public read active listings" on listings
  for select using (status = 'active' or status = 'reserved');

create policy "public read cars" on cars
  for select using (true);

create policy "public read listing photos" on listing_photos
  for select using (true);

create policy "public read restoration events" on restoration_events
  for select using (true);

create policy "public read bumpr products" on bumpr_products
  for select using (true);

-- Public (anon) insert-only access to lead-generation tables — no read,
-- so a visitor can never enumerate other people's inquiries or bookings.
create policy "public submit inquiries" on inquiries
  for insert with check (true);

create policy "public submit car wash bookings" on car_wash_bookings
  for insert with check (true);

create policy "public submit workshop bookings" on workshop_bookings
  for insert with check (true);

-- Everything else (sellers, deposits, transactions, and read/update/delete
-- on the lead tables) is left with RLS enabled and no matching policy,
-- which means: only the Supabase service role (used from trusted server
-- code, e.g. an admin dashboard or a Stripe webhook) can touch them.
