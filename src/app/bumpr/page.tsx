import { createClient } from '@/lib/supabase/server';
import type { BumprProduct } from '@/lib/types';
import { formatPriceCents } from '@/lib/format';

export const revalidate = 60;

async function getBumprProducts(): Promise<BumprProduct[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bumpr_products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Failed to load BUMPR products:', error.message);
    return [];
  }
  return (data ?? []) as BumprProduct[];
}

export default async function BumprPage() {
  const products = await getBumprProducts();

  return (
    <main className="px-8 py-20 bg-bg min-h-screen">
      <div className="max-w-site mx-auto">
        <div className="eyebrow"><span className="dot" />Eigen merk</div>
        <h1 className="mt-2.5 text-3xl md:text-4xl">BUMPR — verzorging uit de werkplaats</h1>
        <p className="mt-4 max-w-[60ch] text-muted text-[15px] leading-relaxed">
          Elk product getest op de wagens die dagelijks bij ons binnenrijden. Made in Holland.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[color:var(--line-dark)] border border-[color:var(--line-dark)] mt-10">
          {products.map((p) => (
            <div key={p.id} className={`relative px-5.5 py-6.5 ${p.is_bundle ? 'bg-bg-soft-2' : 'bg-bg-soft'}`}>
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
