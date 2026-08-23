import { createClient } from '@/lib/supabase/server';
import { Hero } from '@/components/Hero';
import { StripBar, ServiceGrid } from '@/components/ServiceSections';
import { StockGrid } from '@/components/StockGrid';
import { BumprSection } from '@/components/BumprSection';
import { OldtimerTeaser, Guestbook } from '@/components/OldtimerAndGuestbook';
import type { BumprProduct, ListingWithCar } from '@/lib/types';

export const revalidate = 60;

async function getFeaturedListings(): Promise<ListingWithCar[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*, cars(*)')
    .eq('status', 'active')
    .eq('department', 'verkoop')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Failed to load listings:', error.message);
    return [];
  }
  return (data ?? []) as unknown as ListingWithCar[];
}

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

export default async function HomePage() {
  const [listings, bumprProducts] = await Promise.all([
    getFeaturedListings(),
    getBumprProducts(),
  ]);

  return (
    <main>
      <Hero />
      <StripBar />
      <ServiceGrid />
      <section id="voorraad" className="px-8 py-24 bg-bg-soft">
        <div className="max-w-site mx-auto">
          <div className="flex justify-between items-end gap-6 flex-wrap">
            <div>
              <div className="eyebrow"><span className="dot" />Uitgelicht</div>
              <h2 className="mt-2.5 text-3xl md:text-4xl">Deze week op het plein</h2>
            </div>
            <p className="max-w-[36ch] text-muted text-sm leading-relaxed">
              Een greep uit de actuele voorraad — volledige lijst in de winkel.
            </p>
          </div>
          <StockGrid listings={listings} />
        </div>
      </section>
      <BumprSection products={bumprProducts} />
      <OldtimerTeaser />
      <Guestbook />
    </main>
  );
}
