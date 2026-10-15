-- Requires 014. No changes to public access or financial integrations.
begin;
create table public.workshop_settings (
 worker_id uuid primary key references auth.users(id),
 default_phase text not null default 'intake' check(default_phase in ('intake','preparation','disassembly','painting','assembly','finishing','cleaning','result')),
 hourly_rate_cents integer check(hourly_rate_cents between 0 and 100000),
 reminder_minutes integer not null default 120 check(reminder_minutes between 15 and 720),
 show_completed boolean not null default false
);
create table public.work_time_entries (
 id uuid primary key, worker_id uuid not null references auth.users(id), appointment_id uuid not null references public.appointments(id),
 phase text not null check(phase in ('intake','preparation','disassembly','painting','assembly','finishing','cleaning','result')),
 started_at timestamptz not null default now(), ended_at timestamptz,
 revision integer not null default 1, note text not null default '',
 check(ended_at is null or ended_at>=started_at)
);
create unique index work_one_active_timer on public.work_time_entries(worker_id) where ended_at is null;
create index work_time_by_job on public.work_time_entries(appointment_id,started_at);
create table public.work_time_adjustments (
 id uuid primary key default gen_random_uuid(), entry_id uuid not null references public.work_time_entries(id), worker_id uuid not null references auth.users(id),
 old_start timestamptz not null,old_end timestamptz not null,new_start timestamptz not null,new_end timestamptz not null,reason text not null,created_at timestamptz not null default now()
);
alter table public.workshop_settings enable row level security;
alter table public.work_time_entries enable row level security;
alter table public.work_time_adjustments enable row level security;
revoke all on public.workshop_settings,public.work_time_entries,public.work_time_adjustments from public,anon,authenticated;
grant all on public.workshop_settings,public.work_time_entries,public.work_time_adjustments to service_role;
create function public.clock_work(p_worker uuid,p_job uuid,p_phase text,p_action text,p_entry uuid) returns uuid
language plpgsql security invoker set search_path=public as $$
declare active_entry public.work_time_entries%rowtype;
begin
 if p_worker is null or p_entry is null or p_action not in ('start','stop') or p_action is null then raise exception 'Invalid timer request'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_worker::text,0));
 if p_action='stop' then
  update public.work_time_entries set ended_at=now(),revision=revision+1 where id=p_entry and worker_id=p_worker and ended_at is null;
  if not found and not exists(select 1 from public.work_time_entries where id=p_entry and worker_id=p_worker) then raise exception 'Timer not found'; end if;
  return p_entry;
 end if;
 -- Stable client operation ID makes retrying a start safe, even after it was stopped.
 if exists(select 1 from public.work_time_entries where id=p_entry and worker_id=p_worker and appointment_id=p_job and phase=p_phase) then return p_entry; end if;
 select * into active_entry from public.work_time_entries where worker_id=p_worker and ended_at is null;
 if found then
  if active_entry.appointment_id=p_job and active_entry.phase=p_phase then return active_entry.id; end if;
  raise exception 'Stop eerst de lopende timer';
 end if;
 perform id from public.appointments where id=p_job and dossier_number is not null and archived_at is null and status in ('confirmed','in_progress') for update;
 if not found then raise exception 'Kies een bevestigd of lopend werkdossier'; end if;
 insert into public.work_time_entries(id,worker_id,appointment_id,phase) values(p_entry,p_worker,p_job,p_phase);
 return p_entry;
end; $$;
create function public.correct_work_time(p_worker uuid,p_entry uuid,p_revision integer,p_start timestamptz,p_end timestamptz,p_reason text) returns integer
language plpgsql security invoker set search_path=public as $$
declare previous public.work_time_entries%rowtype;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_worker::text,0));
 select * into previous from public.work_time_entries where id=p_entry and worker_id=p_worker for update;
 if not found or previous.ended_at is null or previous.revision<>p_revision or p_revision is null then raise exception 'Stop de timer of herlaad de gewijzigde registratie'; end if;
 if p_start is null or p_end is null or p_end<=p_start or p_end>now()+interval '5 seconds' or p_end-p_start>interval '7 days' or coalesce(length(trim(p_reason)),0)=0 or length(p_reason)>2000 then raise exception 'Ongeldige correctie'; end if;
 if exists(select 1 from public.work_time_entries where worker_id=p_worker and id<>p_entry and started_at<p_end and coalesce(ended_at,'infinity'::timestamptz)>p_start) then raise exception 'Deze tijden overlappen een andere registratie'; end if;
 insert into public.work_time_adjustments(entry_id,worker_id,old_start,old_end,new_start,new_end,reason) values(p_entry,p_worker,previous.started_at,previous.ended_at,p_start,p_end,p_reason);
 update public.work_time_entries set started_at=p_start,ended_at=p_end,note=p_reason,revision=revision+1 where id=p_entry;
 return previous.revision+1;
end; $$;
revoke all on function public.clock_work(uuid,uuid,text,text,uuid),public.correct_work_time(uuid,uuid,integer,timestamptz,timestamptz,text) from public,anon,authenticated;
grant execute on function public.clock_work(uuid,uuid,text,text,uuid),public.correct_work_time(uuid,uuid,integer,timestamptz,timestamptz,text) to service_role;
alter table public.request_photos
 add column caption text not null default '' check(length(caption)<=2000),
 add column rotation integer not null default 0 check(rotation in (0,90,180,270)),
 add column marks jsonb not null default '[]' check(jsonb_typeof(marks)='array' and jsonb_array_length(marks)<=100),
 add column revision integer not null default 1,
 add column archived_at timestamptz;
create function public.work_time_summary(p_job uuid) returns jsonb
language sql stable security invoker set search_path=public as $$
 select coalesce(jsonb_object_agg(phase,seconds),'{}'::jsonb) from (
 select phase, sum(greatest(0,extract(epoch from (coalesce(ended_at,now())-started_at))))::bigint as seconds
 from public.work_time_entries where appointment_id=p_job group by phase
 ) totals;
$$;
revoke all on function public.work_time_summary(uuid) from public,anon,authenticated;
grant execute on function public.work_time_summary(uuid) to service_role;
create function public.require_stopped_work_timer() returns trigger
language plpgsql set search_path=public as $$
begin
 if (NEW.status in ('completed','cancelled') or NEW.archived_at is not null)
 and exists(select 1 from public.work_time_entries where appointment_id=NEW.id and ended_at is null) then
  raise exception 'Klok eerst uit voordat je deze klus afsluit of archiveert';
 end if;
 return NEW;
end; $$;
create trigger require_stopped_work_timer before update on public.appointments for each row execute function public.require_stopped_work_timer();
revoke all on function public.require_stopped_work_timer() from public,anon,authenticated;
grant execute on function public.require_stopped_work_timer() to service_role;
commit;
