-- Requires 011–013. Private admin-only work progress; no public access.
begin;
alter table public.request_photos drop constraint request_photos_stage_check;
alter table public.request_photos add constraint request_photos_stage_check check(stage in ('request','before','during','after','intake','preparation','disassembly','painting','assembly','finishing','cleaning','result'));
create table public.work_phase_checks (
 appointment_id uuid not null references public.appointments(id) on delete cascade,
 phase text not null check(phase in ('intake','preparation','disassembly','painting','assembly','finishing','cleaning','result')),
 answers jsonb not null default '{}' check(jsonb_typeof(answers)='object'),
 notes text not null default '' check(length(notes)<=10000),
 revision integer not null default 1 check(revision>0), updated_at timestamptz not null default now(),
 primary key(appointment_id,phase)
);
alter table public.work_phase_checks enable row level security;
revoke all on public.work_phase_checks from public,anon,authenticated;
grant all on public.work_phase_checks to service_role;
-- Serializes per-job edits; stale screens cannot silently overwrite another device.
create function public.save_work_phase(job_id uuid,phase_key text,new_answers jsonb,new_notes text,expected_revision integer) returns integer
language plpgsql security invoker set search_path=public as $$
declare actual_revision integer; allowed_keys text[];
begin
 perform id from public.appointments where id=job_id for update;
 if not found then raise exception 'Afspraak niet gevonden'; end if;
 allowed_keys := case phase_key
 when 'intake' then array['wishes','damage','belongings']
 when 'preparation' then array['clean','sand','mask']
 when 'disassembly' then array['parts','label','damage']
 when 'painting' then array['colour','surface','finish']
 when 'assembly' then array['parts','fixings','function']
 when 'finishing' then array['edges','defects','quality']
 when 'cleaning' then array['outside','inside','polish']
 when 'result' then array['photos','agreed','handover']
 else null end;
 if allowed_keys is null or new_answers is null or jsonb_typeof(new_answers)<>'object' or expected_revision is null or expected_revision<0 or new_notes is null or length(new_notes)>10000 then raise exception 'Ongeldige checklist'; end if;
 if exists(select 1 from jsonb_each_text(new_answers) a where not(a.key=any(allowed_keys)) or a.value is null or a.value not in ('yes','no','na')) then raise exception 'Ongeldig antwoord'; end if;
 select revision into actual_revision from public.work_phase_checks where appointment_id=job_id and phase=phase_key;
 if coalesce(actual_revision,0)<>expected_revision then raise exception 'Deze fase is op een ander scherm gewijzigd'; end if;
 insert into public.work_phase_checks(appointment_id,phase,answers,notes,revision)
 values(job_id,phase_key,new_answers,new_notes,1)
 on conflict(appointment_id,phase) do update set answers=excluded.answers,notes=excluded.notes,revision=work_phase_checks.revision+1,updated_at=now()
 returning revision into actual_revision;
 return actual_revision;
end; $$;
revoke all on function public.save_work_phase(uuid,text,jsonb,text,integer) from public,anon,authenticated;
grant execute on function public.save_work_phase(uuid,text,jsonb,text,integer) to service_role;
-- Manual intake does not imply the customer submitted/consented to a website form.
alter table public.appointments alter column consent_at drop not null;
alter table public.appointments add column intake_source text not null default 'website' check(intake_source in ('website','admin'));
create function public.create_admin_job(payload jsonb) returns uuid
language plpgsql security invoker set search_path=public as $$
declare cid uuid; vid uuid; rid uuid;
begin
 cid:=(payload->>'customer_id')::uuid;
 perform id from public.customers where id=cid and merged_into is null for update;
 if not found then raise exception 'Actieve klant niet gevonden'; end if;
 if coalesce(payload->>'vehicle_id','')<>'' then
  vid:=(payload->>'vehicle_id')::uuid;
  perform id from public.vehicles where id=vid and customer_id=cid for update;
  if not found then raise exception 'Voertuig hoort niet bij deze klant'; end if;
 else
  if length(regexp_replace(upper(payload->>'registration'),'[^A-Z0-9]','','g'))<1 or length(trim(payload->>'make_model'))<1 then raise exception 'Voertuiggegevens ontbreken'; end if;
  select id into vid from public.vehicles where customer_id=cid and registration_search=regexp_replace(upper(payload->>'registration'),'[^A-Z0-9]','','g') order by created_at,id limit 1;
  if vid is null then
   insert into public.vehicles(customer_id,registration,make_model) values(cid,upper(payload->>'registration'),payload->>'make_model') returning id into vid;
  end if;
 end if;
 insert into public.appointments(customer_id,vehicle_id,service,location_type,requested_date,requested_time,description,consent_at,intake_source)
 values(cid,vid,payload->>'service','discuss',(now() at time zone 'Europe/Amsterdam')::date,'flexible',payload->>'description',null,'admin') returning id into rid;
 return rid;
end; $$;
revoke all on function public.create_admin_job(jsonb) from public,anon,authenticated;
grant execute on function public.create_admin_job(jsonb) to service_role;
commit;
