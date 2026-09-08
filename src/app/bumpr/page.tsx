import { createClient } from '@/lib/supabase/server';
import type { BumprProduct } from '@/lib/types';
import { BumprServices } from '@/components/BumprServices';
import { BumprShop } from '@/components/BumprShop';

export const revalidate = 60;

async function getBumprProducts(): Promise<BumprProduct[]> {
  const supabase = await createClient();
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

        <div className="mt-14">
          <BumprServices />
        </div>

        <div className="mt-16">
          <div className="eyebrow"><span className="dot" />Producten</div>
          <h2 className="mt-2.5 text-2xl md:text-3xl">BUMPR verzorgingsproducten</h2>
          <BumprShop products={products} />
        </div>
      </div>
    </main>
  );
}