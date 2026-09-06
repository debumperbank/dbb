-- Storage bucket + policies for car listing photos.
-- Run this after schema.sql in the Supabase SQL editor.

insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

-- Public read access to the photos (the bucket is public, but an explicit
-- policy is still required for the storage.objects table itself).
create policy "public read listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

-- No insert/update/delete policy is defined for anon or authenticated
-- roles on purpose: photo uploads happen exclusively through the admin
-- server actions, which use the service-role key and therefore bypass
-- storage RLS entirely. This keeps the upload path admin-only without
-- needing Supabase Auth roles wired into storage policies.
