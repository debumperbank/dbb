begin;
create table public.moneybird_exports (
 order_id uuid primary key references public.shop_orders(id),
 administration_id text not null,
 state text not null default 'pending' check(state in ('pending','processing','error','done')),
 contact_attempted boolean not null default false,
 invoice_attempted boolean not null default false,
 send_attempted boolean not null default false,
 invoice_id text,
 error_code text,
 updated_at timestamptz not null default now()
);
alter table public.moneybird_exports enable row level security;
revoke all on public.moneybird_exports from anon, authenticated;
grant all on public.moneybird_exports to service_role;
commit;
