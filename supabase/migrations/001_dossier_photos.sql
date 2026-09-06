-- Migration: dossier photos per restoration event.
-- Safe to run on your existing, live database — this only adds a new
-- table, it does not touch anything you already have. Run this once in
-- the Supabase SQL editor (do NOT re-run the full schema.sql, since it
-- would fail on policies that already exist).

create table if not exists restoration_event_photos (
  id uuid primary key default gen_random_uuid(),
  restoration_event_id uuid not null references restoration_events(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_restoration_event_photos_event
  on restoration_event_photos(restoration_event_id);

alter table restoration_event_photos enable row level security;

create policy "public read restoration event photos" on restoration_event_photos
  for select using (true);

-- No insert/update/delete policy — same reasoning as the other tables:
-- uploads happen exclusively through the admin server actions, which
-- use the service-role key and bypass RLS entirely.
