"use client";
import { useState } from "react";
import Link from "next/link";
import type { SupplierItem } from "@/lib/supplier-shop";
import { formatPriceCents } from "@/lib/format";

export function EnquiryCard({item}: {item: SupplierItem}) {
  const [selected, setSelected] = useState("");
  const quote = item.priceQuote;
  const variant = quote?.variants?.find(v => v.label === selected);
  const price = variant?.priceCents ?? quote?.priceCents;
  const fromPrice = !variant && Boolean(quote?.fromPrice || quote?.variants?.length);
  const name = variant ? `${item.name} · ${variant.label}` : item.name;
  return <article id={item.slug} className="flex min-w-0 flex-col rounded-xl border border-white/10 bg-bg-soft p-6 scroll-mt-32">
    <p className="font-mono text-xs text-orange">{item.brand} · {item.category}</p><h4 className="mt-4 break-words text-2xl">{item.name}</h4>
    <div className="mt-auto pt-6">
      {quote && price ? <div>
        {quote.variants && <label htmlFor={`variant-${item.slug}`} className="mb-4 block text-sm text-muted">Inhoud / uitvoering<select id={`variant-${item.slug}`} value={selected} onChange={e => setSelected(e.target.value)} className="field w-full min-w-0"><option value="">Kies je uitvoering</option>{quote.variants.map(v => <option value={v.label} key={v.label}>{v.label}</option>)}</select></label>}
        <p className="text-2xl text-paper">{fromPrice && <span className="text-sm text-muted">Vanaf </span>}{formatPriceCents(price)}</p>
        <p className="mt-1 text-xs leading-6 text-muted">Inclusief btw · exclusief verzendkosten</p>
        <p className="mt-1 text-xs leading-6 text-muted">Prijs gecontroleerd op {new Date(`${quote.checkedOn}T12:00:00Z`).toLocaleDateString("nl-NL", {day:"numeric",month:"long",year:"numeric"})}</p>
      </div> : <p className="text-sm text-paper">{item.orderOnly ? "Prijs en leverbaarheid eerst bevestigen" : "Prijs en beschikbaarheid op aanvraag"}</p>}
      <span className="mt-4 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs text-muted">{item.orderOnly ? "Op bestelling" : "Op aanvraag"}</span>
      <p className="mt-3 text-xs leading-6 text-muted">{item.orderOnly ? "We bevestigen de uitvoering en leverbaarheid voordat je bestelt. Nog geen eigen voorraad of leverdatum bevestigd." : "Uitvoering, verpakking en leveranciersvoorraad worden eerst bevestigd."}</p>
      {item.professionalOnly && <p className="mt-2 text-xs leading-6 text-muted">Professionele productlijn: verkoopvoorwaarden en geschiktheid worden eerst nagevraagd.</p>}
      <Link href={`/contact?product=${encodeURIComponent(name)}`} className="btn btn-ghost mt-5 !px-4 !text-xs">{quote ? "Vraag leverbaarheid aan →" : item.category === "Voordeelpakketten" ? "Vraag een pakketofferte →" : "Vraag prijs en leverbaarheid →"}</Link>
    </div>
  </article>;
}
