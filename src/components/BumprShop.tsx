'use client';

import { useState } from 'react';
import type { BumprProduct } from '@/lib/types';
import { formatPriceCents } from '@/lib/format';
import { CartProvider, useCart } from '@/contexts/CartContext';

function ProductGrid({ products }: { products: BumprProduct[] }) {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (p: BumprProduct) => {
    addItem({ productId: p.id, name: p.name, unitPriceCents: p.price_cents });
    setAddedId(p.id);
    window.setTimeout(() => setAddedId((current) => (current === p.id ? null : current)), 1200);
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[color:var(--line-dark)] border border-[color:var(--line-dark)] mt-10">
      {products.map((p) => (
        <div key={p.id} className={`relative px-5.5 py-6.5 flex flex-col ${p.is_bundle ? 'bg-bg-soft-2' : 'bg-bg-soft'}`}>
          {p.is_bundle && (
            <div className="absolute top-4 right-4 font-mono text-[9.5px] tracking-wide uppercase text-orange border border-orange px-2 py-0.5 rounded-[2px]">
              Bundel
            </div>
          )}
          <h3 className="text-[17px] font-semibold font-display mb-2">{p.name.replace('BUMPR ', '')}</h3>
          <p className="text-[12.8px] text-muted leading-relaxed">{p.description}</p>
          <div className="mt-4.5 flex items-baseline justify-between border-t border-[color:var(--line-dark)] pt-3.5">
            <span className={`font-display text-[19px] ${p.is_bundle ? 'text-orange-bright' : 'text-orange'}`}>
              {formatPriceCents(p.price_cents)}
            </span>
            <span className="text-[11px] text-muted">
              {p.size_ml ? `${p.size_ml} ml` : '3 × 500 ml'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleAdd(p)}
            className="mt-4 w-full font-mono text-[12px] uppercase tracking-wide py-2.5 rounded-[3px] border border-orange text-orange hover:bg-orange hover:text-white transition-colors"
          >
            {addedId === p.id ? 'Toegevoegd ✓' : 'In winkelmandje'}
          </button>
        </div>
      ))}
    </div>
  );
}

function CartDrawer() {
  const { items, updateQuantity, removeItem, clearCart, totalCents, totalCount } = useCart();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openDrawer = () => {
    setView('cart');
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      address_line: form.get('address_line'),
      postal_code: form.get('postal_code'),
      city: form.get('city'),
      country: form.get('country') || 'NL',
      notes: form.get('notes'),
      company: form.get('company'), // honeypot
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        unitPriceCents: i.unitPriceCents,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await fetch('/api/bumpr-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.error ?? 'Er ging iets mis. Probeer het opnieuw.');
        setSubmitting(false);
        return;
      }

      clearCart();
      setView('success');
    } catch {
      setErrorMsg('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-orange text-white font-mono text-[12px] uppercase tracking-wide px-5 py-3.5 rounded-full shadow-lg hover:bg-orange-bright transition-colors"
      >
        Winkelmandje
        {totalCount > 0 && (
          <span className="bg-white text-orange rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">
            {totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Sluiten"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md h-full bg-bg border-l border-[color:var(--line-dark)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">
                {view === 'cart' && 'Winkelmandje'}
                {view === 'checkout' && 'Gegevens'}
                {view === 'success' && 'Bedankt!'}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[color:var(--line-dark)] hover:bg-bg-soft"
              >
                ×
              </button>
            </div>

            {view === 'cart' && (
              <>
                {items.length === 0 ? (
                  <p className="text-muted text-sm">Je winkelmandje is nog leeg.</p>
                ) : (
                  <div className="grid gap-5">
                    {items.map((i) => (
                      <div key={i.productId} className="flex items-start justify-between gap-3 border-b border-[color:var(--line-dark)] pb-4">
                        <div className="flex-1">
                          <div className="text-[14px] font-semibold">{i.name.replace('BUMPR ', '')}</div>
                          <div className="text-[12px] text-muted mt-0.5">{formatPriceCents(i.unitPriceCents)} per stuk</div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(i.productId, i.quantity - 1)}
                              aria-label="Aantal verminderen"
                              className="w-7 h-7 rounded-[3px] border border-[color:var(--line-dark)] hover:bg-bg-soft"
                            >
                              −
                            </button>
                            <span className="font-mono text-[13px] w-6 text-center">{i.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(i.productId, i.quantity + 1)}
                              aria-label="Aantal vermeerderen"
                              className="w-7 h-7 rounded-[3px] border border-[color:var(--line-dark)] hover:bg-bg-soft"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-orange text-[15px]">
                            {formatPriceCents(i.unitPriceCents * i.quantity)}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(i.productId)}
                            className="text-[11px] text-muted underline mt-2 hover:text-orange"
                          >
                            Verwijderen
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[14px]">Totaal</span>
                      <span className="font-display text-xl text-orange">{formatPriceCents(totalCents)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setView('checkout')}
                      className="mt-2 w-full font-mono text-[12px] uppercase tracking-wide py-3 rounded-[3px] bg-orange text-white hover:bg-orange-bright transition-colors"
                    >
                      Bestellen
                    </button>
                  </div>
                )}
              </>
            )}

            {view === 'checkout' && (
              <form onSubmit={handleSubmit} className="grid gap-3">
                {/* Honeypot — hidden from real visitors via CSS. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute -left-[9999px]"
                  aria-hidden="true"
                />

                <input name="name" required placeholder="Naam" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
                <input name="email" type="email" required placeholder="E-mail" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
                <input name="phone" placeholder="Telefoon (optioneel)" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
                <input name="address_line" required placeholder="Straat en huisnummer" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input name="postal_code" required placeholder="Postcode" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
                  <input name="city" required placeholder="Plaats" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
                </div>
                <input name="country" defaultValue="NL" placeholder="Land" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
                <textarea name="notes" placeholder="Opmerkingen (optioneel)" rows={3} className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm resize-none" />

                {errorMsg && <p className="text-orange text-[13px]">{errorMsg}</p>}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[14px]">Totaal</span>
                  <span className="font-display text-xl text-orange">{formatPriceCents(totalCents)}</span>
                </div>

                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setView('cart')}
                    className="flex-1 font-mono text-[12px] uppercase tracking-wide py-3 rounded-[3px] border border-[color:var(--line-dark)] hover:bg-bg-soft"
                  >
                    Terug
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 font-mono text-[12px] uppercase tracking-wide py-3 rounded-[3px] bg-orange text-white hover:bg-orange-bright transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Versturen...' : 'Bestelling plaatsen'}
                  </button>
                </div>
              </form>
            )}

            {view === 'success' && (
              <div className="grid gap-4">
                <p className="text-sm text-muted">
                  Bedankt voor je bestelling! We hebben &apos;m ontvangen en nemen contact op om de betaling en verzending af te ronden.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full font-mono text-[12px] uppercase tracking-wide py-3 rounded-[3px] border border-[color:var(--line-dark)] hover:bg-bg-soft"
                >
                  Sluiten
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function BumprShop({ products }: { products: BumprProduct[] }) {
  return (
    <CartProvider>
      <ProductGrid products={products} />
      <CartDrawer />
    </CartProvider>
  );
}