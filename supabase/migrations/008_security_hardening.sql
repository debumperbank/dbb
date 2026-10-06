-- Deploy the matching API changes first: legacy lead forms now use the server client.
-- Review/apply through the Supabase SQL editor. Not automatically run by Next.js.
begin;
-- Prevent callers bypassing server-side validation by inserting through the public API.
drop policy if exists "public submit inquiries" on public.inquiries;
drop policy if exists "public submit car wash bookings" on public.car_wash_bookings;
drop policy if exists "public submit workshop bookings" on public.workshop_bookings;
revoke all on public.inquiries, public.car_wash_bookings, public.workshop_bookings from anon, authenticated;
-- Existing service_role privileges remain unchanged.
-- Remove additional legacy policies observed in production: permissive policies are ORed.
drop policy if exists "Iedereen mag cars lezen" on public.cars;
drop policy if exists "Iedereen mag listings lezen" on public.listings;
-- Draft / withdrawn vehicle data must not be readable through the catalogue API.
drop policy if exists "public read cars" on public.cars;
create policy "public read cars" on public.cars for select to anon, authenticated
using (exists (select 1 from public.listings l where l.car_id = cars.id and l.status in ('active','reserved')));
drop policy if exists "public read listing photos" on public.listing_photos;
create policy "public read listing photos" on public.listing_photos for select to anon, authenticated
using (exists (select 1 from public.listings l where l.id = listing_photos.listing_id and l.status in ('active','reserved')));
drop policy if exists "public read restoration events" on public.restoration_events;
create policy "public read restoration events" on public.restoration_events for select to anon, authenticated
using (exists (select 1 from public.listings l where l.car_id = restoration_events.car_id and l.status in ('active','reserved')));
-- Older installations may not have migration 001 (dossier photos) yet.
-- Harden the optional table only when it exists; do not create unrelated features here.
do $hardening$
begin
  if to_regclass('public.restoration_event_photos') is not null then
    execute 'drop policy if exists "public read restoration event photos" on public.restoration_event_photos';
    execute 'create policy "public read restoration event photos" on public.restoration_event_photos for select to anon, authenticated using (exists (select 1 from public.restoration_events e where e.id = restoration_event_photos.restoration_event_id))';
  end if;
end;
$hardening$;
-- Public listing photos are marketing materials, never customer/private paperwork.
update storage.buckets set file_size_limit = 1048576,
allowed_mime_types = array['image/jpeg','image/png','image/webp'] where id = 'listing-photos';
commit;
