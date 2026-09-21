"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function JobPhotoUpload({ id }: { id: string }) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <form
      className="panel space-y-4 mt-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setBusy(true);
        setMessage("");
        try {
          const response = await fetch("/api/job-photos", {
            method: "POST",
            body: new FormData(form),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          form.reset();
          setMessage("Foto toegevoegd.");
          router.refresh();
        } catch (e) {
          setMessage(e instanceof Error ? e.message : "Upload mislukt.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-xl">Foto’s van het werk</h2>
      <input type="hidden" name="appointment_id" value={id} />
      <label className="block">
        Fase
        <select className="field" name="stage">
          <option value="before">Voor de werkzaamheden</option>
          <option value="during">Tijdens de werkzaamheden</option>
          <option value="after">Na de werkzaamheden</option>
        </select>
      </label>
      <label className="block">
        Foto · JPG, PNG of WebP, maximaal 1 MB
        <input
          name="photo"
          className="field"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
        />
      </label>
      <button className="btn btn-ghost" disabled={busy}>
        {busy ? "Uploaden…" : "Foto toevoegen"}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
