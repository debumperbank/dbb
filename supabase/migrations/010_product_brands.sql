begin;
-- Preserve existing IDs, order references and RLS. Existing catalogue belongs to BUMPR.
alter table public.bumpr_products add column if not exists brand text not null default 'BUMPR' check (length(trim(brand)) between 1 and 100);
commit;
