-- Sample data so the site isn't empty on first run.
-- Safe to run multiple times against a fresh database.

insert into sellers (id, name, type, verified)
values ('00000000-0000-0000-0000-000000000001', 'De Bumperbank', 'shop', true)
on conflict (id) do nothing;

-- ===== Actuele voorraad =====
with c1 as (
  insert into cars (make, model, build_year, mileage_km, fuel_type, transmission, is_oldtimer, description)
  values (
    'Citroën', 'C4 Grand Picasso', 2013, null, 'diesel', 'handgeschakeld', false,
    '7-zitter, 1.6 HDI. Linker achterportier opnieuw gespoten, schade aan de wielranden ' ||
    'aangepakt en herspoten. Remmen en remschijven vernieuwd. Alle injectoren hebben nieuwe ' ||
    'seals gekregen. Recent groot onderhoud ondergaan: olie, filters en bougies.'
  )
  returning id
)
insert into listings (car_id, seller_id, department, price_cents, status, slug, listed_at)
select id, '00000000-0000-0000-0000-000000000001', 'verkoop', 520000, 'active', 'citroen-c4-grand-picasso-2013', now() from c1;

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
