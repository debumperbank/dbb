-- Migration: consent tracking for the required Terms & Privacy checkbox.
-- Safe to run on your existing, live database.

alter table inquiries
  add column if not exists consent_given boolean not null default false,
  add column if not exists consent_at timestamptz;

alter table car_wash_bookings
  add column if not exists consent_given boolean not null default false,
  add column if not exists consent_at timestamptz;

alter table workshop_bookings
  add column if not exists consent_given boolean not null default false,
  add column if not exists consent_at timestamptz;
