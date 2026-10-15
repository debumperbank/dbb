-- Apply before deploying the dossier overview. No change to existing RLS.
begin;
lock table public.appointments in access exclusive mode;
create sequence public.work_dossier_number_seq;
alter table public.appointments add column dossier_number text;
-- Only actually scheduled jobs become dossiers.
with numbered as (
 select id, row_number() over (order by created_at, id) as n
 from public.appointments where scheduled_at is not null and status in ('confirmed','in_progress','completed')
)
update public.appointments a set dossier_number = 'DBB-' ||
 repeat('0', greatest(0, 6 - length(n.n::text))) || n.n::text
from numbered n where n.id = a.id;
select setval('public.work_dossier_number_seq',
 greatest((select count(dossier_number) from public.appointments), 1),
 exists(select 1 from public.appointments where dossier_number is not null));
create function public.assign_work_dossier_number() returns trigger
language plpgsql set search_path = public as $$
declare n text;
begin
 if TG_OP = 'UPDATE' and OLD.dossier_number is not null then
  if NEW.dossier_number is distinct from OLD.dossier_number then
   raise exception 'Dossiernummer kan niet worden gewijzigd';
  end if;
  return NEW;
 end if;
 NEW.dossier_number := null;
 if NEW.scheduled_at is not null and NEW.status in ('confirmed','in_progress','completed') then
  n := nextval('public.work_dossier_number_seq')::text;
  NEW.dossier_number := 'DBB-' || repeat('0', greatest(0, 6-length(n))) || n;

 end if;
 return NEW;
end; $$;
create trigger assign_work_dossier_number before insert or update
 on public.appointments for each row execute function public.assign_work_dossier_number();
alter table public.appointments add constraint appointments_dossier_number_key unique(dossier_number);
revoke all on sequence public.work_dossier_number_seq from public, anon, authenticated;
grant usage on sequence public.work_dossier_number_seq to service_role;
revoke all on function public.assign_work_dossier_number() from public, anon, authenticated;
grant execute on function public.assign_work_dossier_number() to service_role;
alter table public.vehicles add column registration_search text generated always as
 (regexp_replace(upper(registration), '[^A-Z0-9]', '', 'g')) stored;
create index vehicles_registration_search_idx on public.vehicles(registration_search text_pattern_ops);
commit;
