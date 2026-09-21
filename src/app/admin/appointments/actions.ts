"use server";
import { revalidatePath } from "next/cache";
import { crmClient } from "@/lib/crm";
import { statuses } from "@/lib/services";
export async function saveAppointment(id: string, form: FormData) {
  const db = await crmClient();
  const status = String(form.get("status") || ""),
    raw = String(form.get("scheduled_at") || ""),
    work_notes = String(form.get("work_notes") || "");
  const duration_minutes = Number(form.get("duration_minutes")),
    travel_minutes = Number(form.get("travel_minutes"));
  if (
    !Object.hasOwn(statuses, status) ||
    !Number.isInteger(duration_minutes) ||
    duration_minutes < 1 ||
    duration_minutes > 1440 ||
    !Number.isInteger(travel_minutes) ||
    travel_minutes < 0 ||
    travel_minutes > 1440 ||
    work_notes.length > 20000
  )
    return { error: "Controleer status, duur, reistijd en notities." };
  if (
    (raw && !Number.isFinite(Date.parse(raw))) ||
    (!raw && ["confirmed", "in_progress", "completed"].includes(status))
  )
    return {
      error: "Kies een datum en tijd voordat je de afspraak bevestigt.",
    };
  const money = (key: string) => {
    const raw = String(form.get(key) || "").replace(",", ".");
    if (!raw) return null;
    if (!/^\d+(\.\d{1,2})?$/.test(raw) || Number(raw) > 10000000)
      throw new Error("Ongeldige prijs.");
    return Math.round(Number(raw) * 100);
  };
  try {
    const { data, error } = await db
      .from("appointments")
      .update({
        status,
        scheduled_at: raw ? new Date(raw).toISOString() : null,
        duration_minutes,
        travel_minutes,
        work_notes,
        estimated_price_cents: money("estimated_price"),
        final_price_cents: money("final_price"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .single();
    if (error || !data) return { error: "Opslaan is mislukt." };
  } catch {
    return { error: "Vul geldige prijzen in." };
  }
  for (const path of [
    "/admin",
    "/admin/appointments",
    "/admin/work-orders",
    `/admin/appointments/${id}`,
  ])
    revalidatePath(path);
  return { ok: true };
}
export async function saveTradeIn(id: string, form: FormData) {
  const db = await crmClient();
  const status = String(form.get("status")),
    notes = String(form.get("notes") || "");
  if (!["new", "contacted", "closed"].includes(status) || notes.length > 20000)
    return { error: "Controleer de status en notities." };
  const { data, error } = await db
    .from("trade_ins")
    .update({ status, notes })
    .eq("id", id)
    .select("id")
    .single();
  if (error || !data) return { error: "Opslaan is mislukt." };
  revalidatePath("/admin/trade-ins");
  revalidatePath("/admin");
  return { ok: true };
}
