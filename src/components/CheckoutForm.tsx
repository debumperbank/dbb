"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { ConsentCheckbox } from "./ConsentCheckbox";
import { shippingRates, quoteOrder, type ShopCustomer } from "@/lib/shop";
import type { BumprProduct } from "@/lib/types";
import { formatPriceCents } from "@/lib/format";
export function CheckoutForm({ products }: { products: BumprProduct[] }) {
  const { items, ready } = useCart();
  const [country, setCountry] = useState<"NL" | "BE">("NL"),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const lock = useRef(false);
  if (!ready) return <p>Je mandje wordt geladen…</p>;
  if (!items.length)
    return (
      <div className="panel">
        <p>Je mandje is nog leeg.</p>
        <Link href="/bumpr" className="btn btn-primary mt-5">
          Kies je producten
        </Link>
      </div>
    );
  let quote;
  try {
    quote = quoteOrder(items, products, country);
  } catch {
    return (
      <div className="panel">
        <p>Een product in je mandje is niet beschikbaar.</p>
        <Link href="/bumpr/mandje" className="btn btn-primary mt-5">
          Pas je mandje aan
        </Link>
      </div>
    );
  }
  const total = quote.total_cents;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData(event.currentTarget);
      const customer = Object.fromEntries(
        [
          "name",
          "email",
          "phone",
          "street",
          "postal_code",
          "city",
          "country",
        ].map((k) => [k, String(form.get(k) || "").trim()]),
      ) as ShopCustomer;
      const payload = {
        customer,
        items,
        consent: form.get("consent") === "on",
        expected_total_cents: total,
      };
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(JSON.stringify(payload)),
      );
      const fingerprint = Array.from(new Uint8Array(digest), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("");
      let attempt: { fingerprint: string; key: string } | null = null;
      try {
        attempt = JSON.parse(
          sessionStorage.getItem("bumpr-checkout-attempt") || "null",
        );
      } catch {}
      if (!attempt || attempt.fingerprint !== fingerprint) {
        attempt = { fingerprint, key: crypto.randomUUID() };
        try {
          sessionStorage.setItem(
            "bumpr-checkout-attempt",
            JSON.stringify(attempt),
          );
        } catch {}
      }
      const response = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, checkout_key: attempt.key }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.resetAttempt)
          try {
            sessionStorage.removeItem("bumpr-checkout-attempt");
          } catch {}
        throw new Error(result.error || "Afrekenen is niet gelukt.");
      }
      window.location.assign(result.url);
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Afrekenen is niet gelukt. Probeer het opnieuw.",
      );
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="grid lg:grid-cols-[1.25fr_0.75fr] gap-7 items-start"
    >
      <fieldset disabled={busy} className="panel !p-6 md:!p-8">
        <legend className="text-2xl px-2">Verzendgegevens</legend>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            ["name", "Volledige naam", "name", "text"],
            ["email", "E-mailadres", "email", "email"],
            ["phone", "Telefoon (optioneel)", "tel", "tel"],
            ["street", "Straat en huisnummer", "street-address", "text"],
            ["postal_code", "Postcode", "postal-code", "text"],
            ["city", "Plaats", "address-level2", "text"],
          ].map(([name, label, auto, type]) => (
            <label
              key={name}
              className={name === "street" ? "sm:col-span-2" : ""}
            >
              {label}
              <input
                name={name}
                type={type}
                autoComplete={auto}
                className="field"
                required={name !== "phone"}
                maxLength={name === "email" ? 254 : 200}
              />
            </label>
          ))}
          <label className="sm:col-span-2">
            Land
            <select
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value as "NL" | "BE")}
              className="field"
            >
              {Object.entries(shippingRates).map(([code, rate]) => (
                <option key={code} value={code}>
                  {rate.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-muted text-sm mt-6">
          Alleen verzending. Gratis vanaf €50 aan producten; daaronder €4,99
          naar Nederland en €6,99 naar België.
        </p>
      </fieldset>
      <aside className="panel lg:sticky lg:top-40">
        <h2 className="text-2xl mb-6">Controleer je bestelling</h2>
        <div className="space-y-4">
          {quote.items.map((i) => (
            <div key={i.id} className="flex justify-between gap-4 text-sm">
              <span>
                {i.quantity} × {i.name}
              </span>
              <span className="shrink-0">
                {formatPriceCents(i.quantity * i.unit_price_cents)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-y border-white/10 py-5 my-5 space-y-3">
          <div className="flex justify-between">
            <span>Producten</span>
            <span>{formatPriceCents(quote.subtotal_cents)}</span>
          </div>
          <div className="flex justify-between">
            <span>Verzending</span>
            <span>
              {quote.shipping_cents === 0
                ? "Gratis"
                : formatPriceCents(quote.shipping_cents)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xl font-display mb-6">
          <span>Totaal</span>
          <strong className="text-orange">{formatPriceCents(total)}</strong>
        </div>
        <ConsentCheckbox />
        <button
          disabled={busy}
          className="btn btn-primary w-full justify-center mt-6 disabled:opacity-50"
        >
          {busy
            ? "Naar Mollie…"
            : `Bestellen en betalen · ${formatPriceCents(total)}`}
        </button>
        <p className="text-muted text-xs leading-relaxed mt-4">
          Je kiest je betaalmethode bij Mollie. Een bestelling is pas betaald na
          bevestiging van de betaling.
        </p>
        {message && (
          <p role="alert" className="text-orange mt-5">
            {message}
          </p>
        )}
        <Link
          href="/bumpr/mandje"
          className="block text-sm text-muted mt-5 underline"
        >
          Terug naar je mandje
        </Link>
      </aside>
    </form>
  );
}
