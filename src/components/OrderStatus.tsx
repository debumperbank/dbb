"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPriceCents } from "@/lib/format";
import type { CartItem } from "@/lib/cart";
type Result = {
  id: string;
  status: string;
  items: CartItem[];
  total_cents: number;
  test: boolean;
};
export function OrderStatus({ id, token }: { id: string; token: string }) {
  const [result, setResult] = useState<Result | null>(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
  const { removePurchased, ready } = useCart();
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    async function poll() {
      try {
        const response = await fetch(
          `/api/shop/orders/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`,
          { cache: "no-store" },
        );
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        if (cancelled) return;
        setResult(body);
        setError("");
        if (
          !["paid", "failed", "canceled", "expired"].includes(body.status) &&
          ++attempts < 12
        )
          timer = setTimeout(poll, 5000);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Status ophalen mislukt.");
      }
    }
    void poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, token, retry]);
  useEffect(() => {
    if (ready && result?.status === "paid") removePurchased(result.items, id);
  }, [ready, result, id, removePurchased]);
  const paid = result?.status === "paid",
    stopped =
      result && ["failed", "canceled", "expired"].includes(result.status);
  return (
    <div className="panel max-w-2xl mx-auto">
      <div className="eyebrow">BUMPR bestelling</div>
      <h1 className="text-3xl md:text-4xl mt-5">
        {paid
          ? "Bedankt voor je bestelling."
          : stopped
            ? "Je betaling is niet afgerond."
            : "We controleren je betaling."}
      </h1>
      <p className="text-muted leading-relaxed mt-6">
        {paid
          ? "Mollie heeft je betaling bevestigd. We gaan met je bestelling aan de slag."
          : stopped
            ? "Er is geen bevestigde betaling. Je producten blijven in je mandje; je kunt opnieuw afrekenen."
            : "De verwerking kan even duren. Deze pagina controleert de status automatisch gedurende één minuut."}
      </p>
      {result?.test && (
        <p className="text-orange mt-5">
          Dit is een testbetaling. Er wordt niets verzonden.
        </p>
      )}
      {result && (
        <p className="mt-5">Totaal: {formatPriceCents(result.total_cents)}</p>
      )}
      <p className="text-xs text-muted break-all mt-4">
        Bestelreferentie: {id}
      </p>
      {error && (
        <p role="alert" className="text-orange mt-5">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3 mt-8">
        {!paid && !stopped && (
          <button
            onClick={() => setRetry((n) => n + 1)}
            className="btn btn-primary"
          >
            Status vernieuwen
          </button>
        )}
        {stopped && (
          <Link href="/bumpr/mandje" className="btn btn-primary">
            Terug naar je mandje
          </Link>
        )}
        <Link href="/bumpr" className="btn btn-ghost">
          Verder naar BUMPR
        </Link>
      </div>
    </div>
  );
}
