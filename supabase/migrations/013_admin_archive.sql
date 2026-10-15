-- Archiving hides records; financial history, email delivery locks and files remain intact.
begin;
alter table public.appointments add column archived_at timestamptz, add column admin_notes text not null default '';
alter table public.inquiries add column archived_at timestamptz, add column admin_notes text not null default '';
alter table public.car_wash_bookings add column archived_at timestamptz, add column admin_notes text not null default '';
alter table public.workshop_bookings add column archived_at timestamptz, add column admin_notes text not null default '';
alter table public.trade_ins add column archived_at timestamptz, add column admin_notes text not null default '';
alter table public.shop_orders add column archived_at timestamptz, add column admin_notes text not null default '';
-- A late successful payment must return to the active order queue.
create function public.unarchive_paid_order() returns trigger
language plpgsql set search_path=public as $$
begin
 if NEW.status='paid' and OLD.status is distinct from 'paid' then NEW.archived_at:=null; end if;
 return NEW;
end; $$;
create trigger unarchive_paid_order before update on public.shop_orders for each row execute function public.unarchive_paid_order();
revoke all on function public.unarchive_paid_order() from public,anon,authenticated;
grant execute on function public.unarchive_paid_order() to service_role;
commit;
