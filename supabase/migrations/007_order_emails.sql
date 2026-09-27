begin;
create table public.shop_order_emails (
 order_id uuid not null references public.shop_orders(id),
 kind text not null check(kind in ('confirmation','shipped')),
 state text not null default 'pending' check(state in ('pending','processing','sent','review_required')),
 attempted_at timestamptz,
 sent_at timestamptz,
 provider_id text,
 primary key(order_id,kind)
);
alter table public.shop_order_emails enable row level security;
revoke all on public.shop_order_emails from anon, authenticated;
grant all on public.shop_order_emails to service_role;
commit;
