begin;
alter table public.moneybird_exports add column if not exists payment_attempted boolean not null default false;
commit;
