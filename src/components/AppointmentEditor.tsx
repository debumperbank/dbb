"use client";
import { useState } from "react";
import type { Appointment } from "@/lib/crm";
import { statuses } from "@/lib/services";
import { saveAppointment } from "@/app/admin/appointments/actions";
function localDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export function AppointmentEditor({
  appointment: a,
}: {
  appointment: Appointment;
}) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [scheduled, setScheduled] = useState(() => localDate(a.scheduled_at));
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData(e.currentTarget);
      form.set(
        "scheduled_at",
        scheduled ? new Date(scheduled).toISOString() : "",
      );
      const result = await saveAppointment(a.id, form);
      setMessage(
        result.error ||
          "Opgeslagen. Neem zelf contact op met de klant om wijzigingen te bevestigen.",
      );
    } catch {
      setMessage("Opslaan is mislukt. Probeer het opnieuw.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="panel space-y-5">
      <h2 className="text-2xl">Planning & werkorder</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <label>
          Status
          <select className="field" name="status" defaultValue={a.status}>
            {Object.entries(statuses).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label>
          Geplande start (tijdzone van dit apparaat)
          <input
            type="datetime-local"
            className="field"
            value={scheduled}
            onChange={(e) => setScheduled(e.target.value)}
          />
        </label>
        <label>
          Werktijd in minuten
          <input
            className="field"
            name="duration_minutes"
            type="number"
            min="1"
            max="1440"
            required
            defaultValue={a.duration_minutes}
          />
        </label>
        <label>
          Reistijd vooraf in minuten
          <input
            className="field"
            name="travel_minutes"
            type="number"
            min="0"
            max="1440"
            required
            defaultValue={a.travel_minutes}
          />
        </label>
        <label>
          Geschatte prijs (€)
          <input
            className="field"
            name="estimated_price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={
              a.estimated_price_cents === null
                ? ""
                : a.estimated_price_cents / 100
            }
          />
        </label>
        <label>
          Eindprijs (€)
          <input
            className="field"
            name="final_price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={
              a.final_price_cents === null ? "" : a.final_price_cents / 100
            }
          />
        </label>
      </div>
      <label className="block">
        Interne werknotities
        <textarea
          className="field"
          rows={7}
          name="work_notes"
          maxLength={20000}
          defaultValue={a.work_notes}
        />
      </label>
      <p className="text-muted text-sm">
        Controleer beschikbare werktijd en reistijd voordat je bevestigt.
        Opslaan verstuurt geen bericht naar de klant.
      </p>
      <button disabled={busy} className="btn btn-primary disabled:opacity-50">
        {busy ? "Opslaan…" : "Wijzigingen opslaan"}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
