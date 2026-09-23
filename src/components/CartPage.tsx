"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import type { BumprProduct } from "@/lib/types";
import { formatPriceCents } from "@/lib/format";
import { productImage } from "@/lib/bumpr";
export function CartPage({ products }: { products: BumprProduct[] }) {
  const { items, ready, setQuantity } = useCart();
  if (!ready) return <p role="status">Je winkelmandje wordt geladen…</p>;
  if (!items.length)
    return (
      <div className="panel">
        <h2 className="text-2xl">Je mandje is nog leeg.</h2>
        <p className="text-muted mt-4">
          Ontdek de BUMPR-verzorgingslijn en kies je producten.
        </p>
        <Link href="/bumpr" className="btn btn-primary mt-7">
          Naar de producten →
        </Link>
      </div>
    );
  let total = 0;
  const unavailable = items.some((i) => !products.some((p) => p.id === i.id && p.is_available !== false));
  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-7">
      <div className="space-y-4">
        {items.map((item) => {
          const p = products.find((p) => p.id === item.id);
          if (!p || p.is_available === false)
            return (
              <div className="panel" key={item.id}>
                <p>Een product is niet meer beschikbaar.</p>
                <button
                  className="text-orange underline mt-3"
                  onClick={() => setQuantity(item.id, 0)}
                >
                  Verwijder uit mandje
                </button>
              </div>
            );
          total += p.price_cents * item.quantity;
          const photo = productImage(p);
          return (
            <article
              key={p.id}
              className="panel flex flex-wrap sm:flex-nowrap items-center gap-5"
            >
              {photo && (
                <Image
                  src={photo}
                  unoptimized={!photo.startsWith("/")}
                  alt={p.name}
                  width={96}
                  height={96}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg">{p.name}</h2>
                <p className="text-muted text-sm mt-2">
                  {formatPriceCents(p.price_cents)} per stuk
                </p>
                <div className="flex flex-wrap gap-4 items-center mt-4">
                  <label className="text-sm flex items-center gap-3">
                    Aantal
                    <select
                      className="field !mt-0 !w-20"
                      value={item.quantity}
                      onChange={(e) =>
                        setQuantity(p.id, Number(e.target.value))
                      }
                      aria-label={`Aantal ${p.name}`}
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="text-sm text-muted underline min-h-11"
                    onClick={() => setQuantity(p.id, 0)}
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
              <strong className="text-orange">
                {formatPriceCents(p.price_cents * item.quantity)}
              </strong>
            </article>
          );
        })}
      </div>
      <aside className="panel h-fit lg:sticky lg:top-40">
        <h2 className="text-2xl">Jouw bestelling</h2>
        <div className="flex justify-between border-y border-white/10 py-5 my-6">
          <span>Producten</span>
          <strong>{formatPriceCents(total)}</strong>
        </div>
        <p className="text-muted text-sm">
          Verzendkosten worden bij het afrekenen getoond. Je betaalt veilig via
          Mollie.
        </p>
        {unavailable ? (
          <p role="alert" className="mt-5 text-orange">
            Verwijder eerst het niet-beschikbare product.
          </p>
        ) : (
          <Link
            href="/bumpr/afrekenen"
            className="btn btn-primary w-full justify-center mt-6"
          >
            Naar afrekenen →
          </Link>
        )}
        <Link
          href="/bumpr"
          className="block text-sm text-muted text-center mt-5"
        >
          Verder winkelen
        </Link>
      </aside>
    </div>
  );
}
