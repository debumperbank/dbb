begin;
alter table public.bumpr_products add column if not exists is_available boolean not null default true;
create table public.shop_orders (
 id uuid primary key default gen_random_uuid(), checkout_key uuid not null unique,
 request_hash text not null, view_token text not null,
 customer jsonb not null, items jsonb not null check(jsonb_typeof(items)='array' and jsonb_array_length(items)>0),
 subtotal_cents integer not null check(subtotal_cents>0), shipping_cents integer not null check(shipping_cents>=0),
 total_cents integer not null check(total_cents=subtotal_cents+shipping_cents), currency text not null default 'EUR' check(currency='EUR'),
 status text not null default 'pending' check(status in ('pending','open','pending_payment','authorized','paid','failed','canceled','expired')),
 payment_id text unique, payment_mode text not null check(payment_mode in ('test','live')), checkout_url text,
 fulfillment_status text not null default 'unfulfilled' check(fulfillment_status in ('unfulfilled','shipped')),
 tracking_reference text, consent_at timestamptz not null default now(),
 created_at timestamptz not null default now(), paid_at timestamptz, notified_at timestamptz,
 check(fulfillment_status<>'shipped' or status='paid')
);
alter table public.shop_orders enable row level security;
revoke all on public.shop_orders from anon,authenticated;
grant all on public.shop_orders to service_role;
create index on public.shop_orders(created_at desc);
create index on public.shop_orders(status,fulfillment_status);
commit;
