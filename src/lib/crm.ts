import { isAdminUser } from "@/lib/admin-access";
import "server-only";
import { needsAdminMfa } from "@/lib/admin-mfa";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function crmContext() {
  const auth = await createClient();
  const {
    data: { user },
    error,
  } = await auth.auth.getUser();
  if (!user || error || !isAdminUser(user)) redirect("/admin/login");
  if (await needsAdminMfa(auth)) redirect("/admin/security");
  return {db:createAdminClient(), userId:user.id};
}
export async function crmClient(){return (await crmContext()).db;}
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};
export type Vehicle = {
  id: string;
  customer_id: string;
  registration: string;
  make_model: string;
  mileage_km: number | null;
  customers: Customer;
};
export type Appointment = {
  archived_at?: string | null;
  dossier_number?: string | null;
  submitted_customer?: { name: string; email: string; phone: string } | null;
  id: string;
  status: string;
  service: string;
  description: string;
  location_type: string;
  service_address: string | null;
  requested_date: string;
  requested_time: string;
  scheduled_at: string | null;
  duration_minutes: number;
  travel_minutes: number;
  work_notes: string;
  estimated_price_cents: number | null;
  final_price_cents: number | null;
  created_at: string;
  customers: Customer;
  vehicles: Vehicle;
};
export type TradeIn = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registration: string;
  mileage_km: number;
  condition: string;
  maintenance: string;
  damage: string;
  asking_price_cents: number | null;
  status: string;
  notes: string;
  created_at: string;
};
export const displayDate = (value: string) =>
  new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
export const euro = (value: number | null) =>
  value === null
    ? "—"
    : new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(value / 100);
