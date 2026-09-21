"use client";
import { useRef, useState } from "react";
import { ConsentCheckbox } from "./ConsentCheckbox";
import { services } from "@/lib/services";
function Field({
  name,
  label,
  type = "text",
  required = true,
  ...props
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: string;
  maxLength?: number;
  step?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      {label}
      <input
        className="field"
        name={name}
        type={type}
        required={required}
        maxLength={200}
        {...props}
      />
    </label>
  );
}
export function RequestForm({ kind }: { kind: "appointment" | "trade_in" }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false),
    [location, setLocation] = useState("mobile");
  const sending = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const photos = data
      .getAll("photos")
      .filter((f): f is File => f instanceof File && f.size > 0);
    try {
      if (photos.length > 3 || photos.some((f) => f.size > 1048576))
        throw new Error("Kies maximaal 3 foto’s, elk maximaal 1 MB.");
      const response = await fetch("/api/requests", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Opslaan is niet gelukt.");
      setDone(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Verzenden is niet gelukt. Probeer het opnieuw.",
      );
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="panel" role="status">
        <h2 className="text-2xl">Bedankt voor je aanvraag.</h2>
        <p className="mt-4 text-muted">
          We nemen contact met je op om de mogelijkheden te bespreken.{" "}
          {kind === "appointment"
            ? "Je afspraak is pas definitief nadat we die persoonlijk hebben bevestigd."
            : "Je aanvraag verplicht je niet tot verkoop."}
        </p>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-8">
      <input type="hidden" name="kind" value={kind} />
      <div className="hidden" aria-hidden="true">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <fieldset className="panel">
        <legend className="text-xl px-2">1. Jouw gegevens</legend>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field name="name" label="Naam" autoComplete="name" />
          <Field
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
          />
          <Field name="phone" label="Telefoon" type="tel" autoComplete="tel" />
        </div>
      </fieldset>
      <fieldset className="panel">
        <legend className="text-xl px-2">2. Je voertuig</legend>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field name="registration" label="Kenteken" maxLength={20} />
          {kind === "appointment" && (
            <Field name="make_model" label="Merk en model" />
          )}
          <Field
            name="mileage_km"
            label={
              kind === "appointment"
                ? "Kilometerstand (optioneel)"
                : "Kilometerstand"
            }
            type="number"
            min="0"
            step="1"
            required={kind === "trade_in"}
          />
        </div>
      </fieldset>
      {kind === "appointment" ? (
        <>
          <fieldset className="panel">
            <legend className="text-xl px-2">3. Werkzaamheden</legend>
            <label className="block">
              Waarmee kunnen we helpen?
              <select className="field" name="service" required defaultValue="">
                <option value="" disabled>
                  Kies een dienst
                </option>
                {Object.entries(services).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block mt-5">
              Beschrijf de werkzaamheden of klachten
              <textarea
                className="field"
                name="description"
                rows={4}
                maxLength={2000}
                required
              />
            </label>
          </fieldset>
          <fieldset className="panel">
            <legend className="text-xl px-2">4. Locatie en voorkeur</legend>
            <label>
              Waar wil je geholpen worden?
              <select
                name="location_type"
                className="field"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="mobile">Werkzaamheden op mijn locatie</option>
                <option value="discuss">
                  Eerst overleggen wat mogelijk is
                </option>
              </select>
            </label>
            <div className="mt-5">
              <Field
                name="service_address"
                label={
                  location === "mobile"
                    ? "Straat, huisnummer, postcode en plaats"
                    : "Locatie of plaats (optioneel)"
                }
                required={location === "mobile"}
                maxLength={500}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5 mt-5">
              <Field name="requested_date" label="Voorkeursdatum" type="date" />
              <label>
                Voorkeurstijd
                <select name="requested_time" className="field">
                  <option value="flexible">Flexibel</option>
                  <option value="morning">Ochtend</option>
                  <option value="afternoon">Middag</option>
                </select>
              </label>
            </div>
            <p className="text-muted text-sm mt-5">
              We houden rekening met werkzaamheden, reistijd en locatie. Dit is
              een aanvraag, nog geen definitieve afspraak.
            </p>
          </fieldset>
        </>
      ) : (
        <fieldset className="panel">
          <legend className="text-xl px-2">3. Over je auto</legend>
          <div className="space-y-5">
            {[
              ["condition", "Algemene staat"],
              ["maintenance", "Onderhoudshistorie"],
              [
                "damage",
                "Schade en gebreken (vul “geen” in indien niet van toepassing)",
              ],
            ].map(([name, label]) => (
              <label className="block" key={name}>
                {label}
                <textarea
                  name={name}
                  className="field"
                  required
                  maxLength={2000}
                  rows={3}
                />
              </label>
            ))}
            <Field
              name="asking_price"
              label="Gewenste prijs in euro (optioneel)"
              type="number"
              min="0"
              step="0.01"
              required={false}
            />
          </div>
        </fieldset>
      )}
      <div className="panel">
        <label>
          Foto’s (optioneel)
          <input
            className="field"
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            aria-describedby="photo-help"
          />
        </label>
        <p id="photo-help" className="text-sm text-muted mt-3">
          Maximaal 3 JPG-, PNG- of WebP-foto’s, elk maximaal 1 MB. De foto’s
          zijn alleen zichtbaar voor ons beheerteam.
        </p>
      </div>
      <ConsentCheckbox />
      {error && (
        <p role="alert" className="text-orange">
          {error}
        </p>
      )}
      <button disabled={busy} className="btn btn-primary disabled:opacity-50">
        {busy
          ? "Bezig met verzenden…"
          : kind === "appointment"
            ? "Afspraak aanvragen →"
            : "Auto aanbieden →"}
      </button>
    </form>
  );
}
