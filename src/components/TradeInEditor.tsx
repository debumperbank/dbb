"use client";
import { useState } from "react";
import { saveTradeIn } from "@/app/admin/appointments/actions";
export function TradeInEditor({
  id,
  status,
  notes,
}: {
  id: string;
  status: string;
  notes: string;
}) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      className="space-y-4 mt-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          const r = await saveTradeIn(id, new FormData(e.currentTarget));
          setMessage(r.error || "Opgeslagen.");
        } catch {
          setMessage("Opslaan is mislukt.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Status
        <select className="field" name="status" defaultValue={status}>
          <option value="new">Nieuw</option>
          <option value="contacted">Contact opgenomen</option>
          <option value="closed">Afgerond</option>
        </select>
      </label>
      <label className="block">
        Interne notities
        <textarea
          className="field"
          name="notes"
          defaultValue={notes}
          maxLength={20000}
        />
      </label>
      <button className="btn btn-ghost" disabled={busy}>
        {busy ? "Opslaan…" : "Opslaan"}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
