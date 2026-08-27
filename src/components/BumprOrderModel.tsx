'use client';

import { useState } from 'react';
import type { BumprProduct } from '@/lib/types';
import { formatPriceCents } from '@/lib/format';

type Props = {
  product: BumprProduct;
};

export function BumprOrderButton({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // TODO: hier kun je later een Server Action aanroepen
    // Voor nu simuleren we succes
    await new Promise((r) => setTimeout(r, 800));

    setLoading(false);
    setSuccess(true);

    // Modal sluiten na 2 seconden
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
    }, 2000);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full py-2.5 text-[13px] font-medium tracking-wide uppercase
                   bg-orange text-white hover:bg-orange-bright transition-colors rounded-[2px]"
      >
        Bestel
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-bg-soft w-full max-w-md rounded-sm border border-[color:var(--line-dark)] p-6 shadow-xl">
            {success ? (
              <div className="text-center py-8">
                <p className="text-lg font-display text-orange">Bestelling ontvangen!</p>
                <p className="mt-2 text-sm text-muted">We nemen zo snel mogelijk contact met je op.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-lg font-display font-semibold">
                      {product.name.replace('BUMPR ', '')}
                    </h3>
                    <p className="text-orange font-display text-[18px] mt-1">
                      {formatPriceCents(product.price_cents)}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-muted hover:text-fg text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[12px] text-muted mb-1">Naam *</label>
                    <input
                      name="name"
                      required
                      className="w-full px-3 py-2.5 bg-bg border border-[color:var(--line-dark)] rounded-[2px] text-sm outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-muted mb-1">Telefoonnummer *</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="w-full px-3 py-2.5 bg-bg border border-[color:var(--line-dark)] rounded-[2px] text-sm outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-muted mb-1">E-mail</label>
                    <input
                      name="email"
                      type="email"
                      className="w-full px-3 py-2.5 bg-bg border border-[color:var(--line-dark)] rounded-[2px] text-sm outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-muted mb-1">Aantal</label>
                    <input
                      name="quantity"
                      type="number"
                      min={1}
                      defaultValue={1}
                      className="w-full px-3 py-2.5 bg-bg border border-[color:var(--line-dark)] rounded-[2px] text-sm outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-muted mb-1">Opmerking</label>
                    <textarea
                      name="note"
                      rows={2}
                      className="w-full px-3 py-2.5 bg-bg border border-[color:var(--line-dark)] rounded-[2px] text-sm outline-none focus:border-orange resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-2 bg-orange text-white text-[13px] font-medium tracking-wide uppercase
                               hover:bg-orange-bright transition-colors rounded-[2px] disabled:opacity-60"
                  >
                    {loading ? 'Versturen…' : 'Bestelling plaatsen'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}