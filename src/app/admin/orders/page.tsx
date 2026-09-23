import { crmClient, euro, displayDate } from "@/lib/crm";
import type { ShopOrder } from "@/lib/shop";
import { markShipped } from "./actions";
export default async function Page() {
  const db = await crmClient();
  const { data, error } = await db
    .from("shop_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return (
    <div>
      <div className="eyebrow">BUMPR webshop</div>
      <h1 className="text-3xl mt-3 mb-8">Bestellingen</h1>
      {error ? (
        <p role="alert">
          Bestellingen konden niet worden geladen. Controleer de
          databaseverbinding en migratie 004_bumpr_shop.sql.
        </p>
      ) : !data?.length ? (
        <p className="text-muted">Nog geen bestellingen.</p>
      ) : (
        <div className="space-y-5">
          {(data as unknown as ShopOrder[]).map((o) => (
            <article key={o.id} className="panel">
              <div className="flex justify-between flex-wrap gap-4">
                <h2 className="text-xl">
                  {o.customer.name} · {euro(o.total_cents)}
                </h2>
                <span className="text-orange">
                  {o.payment_mode === "test" ? "TEST · " : ""}
                  {{
                    pending: "Aangemaakt",
                    open: "Betaling open",
                    pending_payment: "Betaling wordt verwerkt",
                    authorized: "Geautoriseerd",
                    paid: "Betaald",
                    failed: "Mislukt",
                    canceled: "Geannuleerd",
                    expired: "Verlopen",
                  }[o.status] || o.status}
                </span>
              </div>
              <p className="text-xs text-muted mt-3 break-all">
                {displayDate(o.created_at)} · {o.id}
              </p>
              <ul className="my-5 space-y-2">
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.quantity} × {i.name} ·{" "}
                    {euro(i.quantity * i.unit_price_cents)}
                  </li>
                ))}
              </ul>
              <p className="text-muted">Verzending: {euro(o.shipping_cents)}</p>
              <address className="not-italic my-5">
                {o.customer.street}
                <br />
                {o.customer.postal_code} {o.customer.city} ·{" "}
                {o.customer.country}
                <br />
                <a href={`mailto:${o.customer.email}`}>{o.customer.email}</a>
                {o.customer.phone && (
                  <>
                    <br />
                    {o.customer.phone}
                  </>
                )}
              </address>
              {o.fulfillment_status === "shipped" ? (
                <p className="text-orange">
                  Verzonden · {o.tracking_reference || "Geen referentie"}
                </p>
              ) : o.status === "paid" && o.payment_mode === "live" ? (
                <form
                  action={markShipped}
                  className="flex flex-wrap gap-3 items-end"
                >
                  <input name="id" value={o.id} type="hidden" />
                  <label>
                    Track & trace (optioneel)
                    <input name="tracking" className="field" maxLength={200} />
                  </label>
                  <button className="btn btn-primary">
                    Markeer als verzonden
                  </button>
                </form>
              ) : (
                <p className="text-muted text-sm">
                  {o.payment_mode === "test"
                    ? "Testbestelling — niet verzenden."
                    : "Nog niet vrijgegeven voor verzending."}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
