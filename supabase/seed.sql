-- Sample data so the site isn't empty on first run.
-- Safe to run multiple times against a fresh database.

insert into sellers (id, name, type, verified)
values ('00000000-0000-0000-0000-000000000001', 'De Bumperbank', 'shop', true)
on conflict (id) do nothing;

-- ===== Regular stock =====
with c1 as (
  insert into cars (make, model, build_year, mileage_km, fuel_type, transmission, is_oldtimer)
  values ('Peugeot', '205 GTI', 1988, 142000, 'benzine', 'handgeschakeld', true)
  returning id
), c2 as (
  insert into cars (make, model, build_year, mileage_km, fuel_type, transmission, is_oldtimer)
  values ('Volkswagen', 'Golf III', 2001, 98000, 'diesel', 'handgeschakeld', false)
  returning id
), c3 as (
  insert into cars (make, model, build_year, mileage_km, fuel_type, transmission, is_oldtimer)
  values ('Mercedes-Benz', 'W124', 1993, 210000, 'benzine', 'automaat', false)
  returning id
)
insert into listings (car_id, seller_id, department, price_cents, status, slug, listed_at)
select id, '00000000-0000-0000-0000-000000000001'::uuid, 'verkoop', 1490000, 'active', 'peugeot-205-gti-1988', now() from c1
union all
select id, '00000000-0000-0000-0000-000000000001'::uuid, 'verkoop', 525000, 'active', 'volkswagen-golf-iii-2001', now() from c2
union all
select id, '00000000-0000-0000-0000-000000000001'::uuid, 'verkoop', 1140000, 'active', 'mercedes-w124-1993', now() from c3; 
-- ===== Oldtimer dossier example =====
with oc as (
  insert into cars (make, model, build_year, is_oldtimer, description)
  values ('Citroën', 'DS 21 Pallas', 1971, true, 'Volledige restauratie: leder & fineer.')
  returning id
), ol as (
  insert into listings (car_id, seller_id, department, price_cents, status, slug, listed_at)
  select id, '00000000-0000-0000-0000-000000000001', 'oldtimer', 0, 'reserved', 'citroen-ds21-pallas-1971', now() from oc
  returning car_id
)
insert into restoration_events (car_id, event_date, title, description, performed_by)
select id, date '1971-01-01', 'Ophaling', 'Voertuig opgehaald voor dossier.', 'De Bumperbank' from oc
union all
select id, date '2023-06-01', 'Restauratie afgerond', 'Volledige restauratie van coachwerk en interieur afgerond.', 'De Bumperbank' from oc;

-- ===== BUMPR product line =====
insert into bumpr_products (slug, name, description, price_cents, size_ml, is_bundle, bundle_of, sort_order)
values
  ('ceramic-coating', 'BUMPR Ceramic Coating',
   'Snelle keramische spray (SiO2). Geeft diepe glans, waterafstotend effect en bescherming. Klaar voor gebruik.',
   3995, 500, false, null, 1),
  ('fast-detailer', 'BUMPR Fast Detailer',
   'Snelle detailer spray. Verwijdert lichte vervuiling, herstelt glans en laat geen strepen achter. Ideaal voor snelle opfrissing.',
   2995, 500, false, null, 2),
  ('polish', 'BUMPR Polish',
   'Polijstmiddel voor lichte swirls en haze. Geeft een hoogglans finish en is eenvoudig uit te poetsen.',
   3495, 500, false, null, 3),
  ('performance-set', 'BUMPR Performance Set',
   'Alle 3 producten (Ceramic Coating + Fast Detailer + Polish) in premium verpakking.',
   9900, null, true, array['ceramic-coating', 'fast-detailer', 'polish'], 4)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  size_ml = excluded.size_ml,
  is_bundle = excluded.is_bundle,
  bundle_of = excluded.bundle_of,
  sort_order = excluded.sort_order;
