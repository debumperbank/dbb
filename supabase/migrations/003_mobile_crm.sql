-- Additive migration: run after 001 and 002. Existing stock/bookings stay intact.
begin;
create table public.customers (
 id uuid primary key default gen_random_uuid(), name text not null, email text not null,
 phone text not null, created_at timestamptz not null default now()
);
create table public.vehicles (
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id),
 registration text not null, make_model text not null, mileage_km integer check(mileage_km >= 0),
 created_at timestamptz not null default now()
);
create table public.appointments (
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id),
 vehicle_id uuid not null references public.vehicles(id),
 service text not null check(service in ('onderhoud','reparatie','diagnose','remmen','banden','detailing','overig')),
 location_type text not null check(location_type in ('mobile','discuss')), service_address text,
 requested_date date not null, requested_time text not null,
 description text not null, status text not null default 'new' check(status in ('new','contacted','confirmed','in_progress','completed','cancelled')),
 scheduled_at timestamptz, duration_minutes integer not null default 60 check(duration_minutes > 0),
 travel_minutes integer not null default 0 check(travel_minutes >= 0),
 work_notes text not null default '', estimated_price_cents integer check(estimated_price_cents >= 0),
 final_price_cents integer check(final_price_cents >= 0), consent_at timestamptz not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(location_type <> 'mobile' or length(trim(service_address)) > 0),
 check(status not in ('confirmed','in_progress','completed') or scheduled_at is not null)
);
create table public.trade_ins (
 id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text not null,
 registration text not null, mileage_km integer not null check(mileage_km >= 0),
 condition text not null, maintenance text not null, damage text not null,
 asking_price_cents integer check(asking_price_cents >= 0),
 status text not null default 'new' check(status in ('new','contacted','closed')),
 notes text not null default '', consent_at timestamptz not null, created_at timestamptz not null default now()
);
create table public.request_photos (
 id uuid primary key default gen_random_uuid(), appointment_id uuid references public.appointments(id) on delete cascade,
 trade_in_id uuid references public.trade_ins(id) on delete cascade, storage_path text not null unique,
 stage text not null default 'request' check(stage in ('request','before','during','after')),
 created_at timestamptz not null default now(), check(num_nonnulls(appointment_id,trade_in_id)=1)
);
alter table public.customers enable row level security;
alter table public.vehicles enable row level security;
alter table public.appointments enable row level security;
alter table public.trade_ins enable row level security;
alter table public.request_photos enable row level security;
-- No public policies: all writes go through validated server endpoints;
-- all reads/updates through explicitly authenticated admin code.
revoke all on public.customers,public.vehicles,public.appointments,public.trade_ins,public.request_photos from anon, authenticated;
grant all on public.customers,public.vehicles,public.appointments,public.trade_ins,public.request_photos to service_role;
create index on public.appointments (scheduled_at);
create index on public.appointments (status,created_at);
create index on public.appointments (customer_id);
create index on public.vehicles (customer_id);
create index on public.request_photos (appointment_id);
create index on public.request_photos (trade_in_id);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('request-photos','request-photos',false,1048576,array['image/jpeg','image/png','image/webp']);
-- A single transaction creates the customer, vehicle, request and photo records.
-- Customers are intentionally not merged by unverified public email/registration.
create function public.submit_mobile_request(payload jsonb, photo_paths text[]) returns uuid
language plpgsql security invoker set search_path = public as $$
declare cid uuid; vid uuid; rid uuid; photo text;
begin
 if payload->>'kind' = 'appointment' then
  insert into customers(name,email,phone) values(payload->>'name',payload->>'email',payload->>'phone') returning id into cid;
  insert into vehicles(customer_id,registration,make_model,mileage_km)
   values(cid,payload->>'registration',payload->>'make_model',(payload->>'mileage_km')::integer) returning id into vid;
  insert into appointments(customer_id,vehicle_id,service,location_type,service_address,requested_date,requested_time,description,consent_at)
   values(cid,vid,payload->>'service',payload->>'location_type',payload->>'service_address',(payload->>'requested_date')::date,payload->>'requested_time',payload->>'description',now()) returning id into rid;
 else
  if payload->>'kind' <> 'trade_in' then raise exception 'Invalid request kind'; end if;
  insert into trade_ins(name,email,phone,registration,mileage_km,condition,maintenance,damage,asking_price_cents,consent_at)
   values(payload->>'name',payload->>'email',payload->>'phone',payload->>'registration',(payload->>'mileage_km')::integer,payload->>'condition',payload->>'maintenance',payload->>'damage',(payload->>'asking_price_cents')::integer,now()) returning id into rid;
 end if;
 foreach photo in array photo_paths loop
  insert into request_photos(appointment_id,trade_in_id,storage_path)
   values(case when payload->>'kind'='appointment' then rid end,case when payload->>'kind'='trade_in' then rid end,photo);
 end loop;
 return rid;
end; $$;
revoke all on function public.submit_mobile_request(jsonb,text[]) from public,anon,authenticated;
grant execute on function public.submit_mobile_request(jsonb,text[]) to service_role;
commit;
