"use client";

import { useEffect, useMemo, useState } from "react";
import { EnquiryCard } from "./EnquiryCard";
import { buildSupplierItems, filterSupplierItems, normalize, readShopFilters, shopFilterUrl, SHOP_BRANDS, SHOP_CATEGORIES, SHOP_STATUSES, type ShopFilters } from "@/lib/supplier-shop";

const EMPTY_FILTERS: ShopFilters = {brand:"", category:"", query:"", status:"", sort:"category"};
export function SupplierCatalogue({initialFilters, existingProducts = []}: {initialFilters: ShopFilters; existingProducts?: {slug:string;name:string;brand?:string}[]}) {
  const [filters, setFilters] = useState(initialFilters);
  const [limit, setLimit] = useState(24);
  const items = useMemo(() => buildSupplierItems(existingProducts), [existingProducts]);
  const brands = [...SHOP_BRANDS, ...Array.from(new Set(items.map(p => p.brand))).filter(b => !SHOP_BRANDS.some(known => normalize(known) === normalize(b))).sort()];
  const categories = [...SHOP_CATEGORIES, ...Array.from(new Set(items.map(p => p.category))).filter(c => !SHOP_CATEGORIES.includes(c)).sort()];
  const visible = filterSupplierItems(items, filters);
  const activeFilters = Boolean(filters.brand || filters.category || filters.query || filters.status);

  useEffect(() => {
    function restore() {
      const values = Object.fromEntries(new URLSearchParams(window.location.search));
      // Keep old shared brand anchors useful after merging the shop into one catalogue.
      if (!values.merk && window.location.hash === "#drift") values.merk = "DRIFT";
      if (!values.merk && window.location.hash === "#gecko") values.merk = "GECKO";
      setFilters(readShopFilters(values));
      setLimit(24);
    }
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  function update(changes: Partial<ShopFilters>) {
    const next = {...filters, ...changes};
    setFilters(next);
    setLimit(24);
    window.history.replaceState(null, "", shopFilterUrl(next));
  }
  function reset() { setLimit(24); setFilters(EMPTY_FILTERS); window.history.replaceState(null, "", shopFilterUrl(EMPTY_FILTERS)); }

  return <section id="producten" className="px-5 py-12 md:px-8 md:py-16 scroll-mt-28"><div className="max-w-site mx-auto">
    <div className="eyebrow">DRIFT, GECKO & Cartec</div>
    <h2 className="mt-4 text-3xl md:text-5xl">Ontdek onze aanvullende merken.</h2>
    <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">Van wassen en polijsten tot beschermen: ontdek ook pads, borstels, sponzen en complete merkpakketten. DRIFT leveren we voorlopig op bestelling. De DRIFT-prijzen zijn afgestemd op de fabrikantprijzen. Uitvoering en leverbaarheid bevestigen we vooraf; een aanvraag is nog geen aankoop.</p>
    <div role="group" aria-label="Kies een merk" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {["", ...brands].map(brand => {
        const count = brand ? items.filter(p => normalize(p.brand) === normalize(brand)).length : items.length;
        const selected = filters.brand === brand;
        return <button type="button" key={brand} aria-pressed={selected} onClick={() => update({brand})}
          className={`min-h-24 min-w-0 rounded-xl border px-4 py-4 text-left transition-colors ${selected ? "border-orange bg-orange/[0.10]" : "border-white/10 bg-bg-soft hover:border-orange/60"}`}>
          <span className={`block font-display text-lg font-semibold ${selected ? "text-orange" : "text-paper"}`}>{brand || "Alle merken"}</span>
          <span className="mt-2 block text-xs text-muted">{`${count} ${count === 1 ? "product" : "producten"}`}</span>
        </button>;
      })}
    </div>

    <div className="mt-8 grid items-start gap-7 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside aria-label="Productfilters" className="panel min-w-0 lg:sticky lg:top-32">
        <label htmlFor="shop-search" className="text-sm font-medium">Zoek een product</label>
        <input id="shop-search" type="search" value={filters.query} onChange={e => update({query:e.target.value})} placeholder="Naam, merk of categorie" className="field min-w-0" maxLength={200} />
        <fieldset className="mt-7"><legend className="mb-3 font-semibold">Categorie</legend>
          <div className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {["", ...categories].map(category => {
              const count = items.filter(p => (!filters.brand || normalize(p.brand) === normalize(filters.brand)) && (!category || p.category === category)).length;
              return <button key={category} type="button" aria-pressed={filters.category === category} onClick={() => update({category})}
                className={`flex min-h-11 min-w-0 items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm ${filters.category === category ? "bg-orange/10 text-orange" : "text-muted hover:text-paper"}`}>
                <span className="min-w-0 break-words">{category || "Alle categorieën"}</span><span className="shrink-0 text-xs opacity-70">{count}</span>
              </button>;
            })}
          </div>
        </fieldset>
        <label htmlFor="shop-status" className="mt-6 block text-sm font-medium">Beschikbaarheid</label>
        <select id="shop-status" className="field" value={filters.status} onChange={e => update({status:e.target.value})}>{SHOP_STATUSES.map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select>
        {activeFilters && <button type="button" onClick={reset} className="mt-5 min-h-11 text-sm text-orange underline">Wis alle filters</button>}
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div><h3 className="text-2xl">{filters.category || "Alle producten"}{filters.brand && <span className="text-orange"> · {filters.brand}</span>}</h3>
            <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 text-sm text-muted">{visible.length} {visible.length === 1 ? "product gevonden" : "producten gevonden"}</p>
          </div>
          <label className="text-sm">Sorteer op<select className="field !mt-2" value={filters.sort} onChange={e => update({sort:e.target.value})}>
            <option value="category">Categorie</option><option value="name">Naam A–Z</option><option value="price_asc">Prijs laag–hoog</option><option value="price_desc">Prijs hoog–laag</option>
          </select></label>
        </div>
        {!visible.length ? <div className="panel"><h4 className="text-xl">{filters.category ? "Voor deze selectie staan nog geen producten klaar." : "Geen producten gevonden voor deze selectie."}</h4><p className="mt-4 text-sm text-muted leading-7">Kies een ander merk of een andere categorie, of wis de filters. We breiden het assortiment uit zodra producten en beschikbaarheid bevestigd zijn.</p><button type="button" onClick={reset} className="btn btn-ghost mt-5">Toon alle producten</button></div> :
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.slice(0, limit).map(item => <EnquiryCard key={item.slug} item={item} />)}</div>}

        {visible.length > limit && <div className="mt-8 flex flex-wrap items-center gap-5"><button type="button" className="btn btn-ghost" onClick={() => setLimit(value => value + 24)}>Toon meer producten</button><p className="text-sm text-muted">{Math.min(limit, visible.length)} van {visible.length} getoond</p></div>}
        <p className="mt-7 text-xs text-muted leading-6">Producten zonder bevestigde prijs zijn nog niet direct af te rekenen. Pakketten staan per merk onder voordeelpakketten. Bij DRIFT gebruiken we de reguliere adviesprijzen en de aparte fabrikantpakkettarieven, inclusief btw. Artikelen zonder prijs staan bij prijssortering onderaan; bij meerdere uitvoeringen sorteren we op de vanafprijs. Leverbaarheid van deze artikelen wordt eerst persoonlijk bevestigd.</p>
      </div>
    </div>
  </div></section>;
}
