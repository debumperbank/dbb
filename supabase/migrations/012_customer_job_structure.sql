-- Apply after 011. Existing assigned numbers are never removed or recycled.
begin;
alter table public.appointments alter column dossier_number drop not null;
create or replace function public.assign_work_dossier_number() returns trigger
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
alter table public.customers add column merged_into uuid references public.customers(id);
alter table public.customers add constraint customers_not_self_merged check(merged_into is distinct from id);
alter table public.appointments add column submitted_customer jsonb;
update public.appointments a set submitted_customer = jsonb_build_object(
 'name',c.name,'email',c.email,'phone',c.phone)
from public.customers c where c.id=a.customer_id;
create function public.capture_request_customer() returns trigger
language plpgsql set search_path=public as $$
begin
 select jsonb_build_object('name',name,'email',email,'phone',phone)
 into NEW.submitted_customer from public.customers where id=NEW.customer_id;
 return NEW;
end; $$;
create trigger capture_request_customer before insert on public.appointments
for each row execute function public.capture_request_customer();
revoke all on function public.capture_request_customer() from public,anon,authenticated;
grant execute on function public.capture_request_customer() to service_role;

-- Admin-approved consolidation only. Public requests cannot choose an existing customer.
-- Original submitted contact details and archived customer records remain intact.
create function public.merge_customer_records(source_id uuid, target_id uuid) returns uuid
language plpgsql security invoker set search_path=public as $$
declare v record; existing_vehicle uuid;
begin
 if source_id=target_id then raise exception 'Kies een andere klantenfiche'; end if;
 perform id from public.customers where id in(source_id,target_id) order by id for update;
 if (select count(*) from public.customers where id in(source_id,target_id) and merged_into is null)<>2 then
  raise exception 'Klant bestaat niet of is al gekoppeld';
 end if;
 -- Exclude concurrent edits to requests/vehicles while relinking the history.
 perform id from public.appointments where customer_id=source_id order by id for update;
 for v in select * from public.vehicles where customer_id=source_id order by created_at,id for update loop
  existing_vehicle := null;
  if v.registration_search<>'' then
   select id into existing_vehicle from public.vehicles
    where customer_id=target_id and registration_search=v.registration_search
    order by created_at,id limit 1 for update;
  end if;
  if existing_vehicle is null then
   update public.vehicles set customer_id=target_id where id=v.id;
  else
   update public.appointments set vehicle_id=existing_vehicle where vehicle_id=v.id and customer_id=source_id;
  end if;
 end loop;
 update public.appointments set customer_id=target_id where customer_id=source_id;
 update public.customers set merged_into=target_id where id=source_id;
 return target_id;
end; $$;
revoke all on function public.merge_customer_records(uuid,uuid) from public,anon,authenticated;
grant execute on function public.merge_customer_records(uuid,uuid) to service_role;
commit;
