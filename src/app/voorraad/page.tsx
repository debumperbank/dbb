import { createClient } from '@/lib/supabase/server';
import { StockGrid } from '@/components/StockGrid';
import type { ListingWithCar } from '@/lib/types';

export const revalidate = 60;

async function getAllListings(): Promise<ListingWithCar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*, cars(*)')
    .eq('status', 'active')
    .eq('department', 'verkoop')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load listings:', error.message);
    return [];
  }
  return (data ?? []) as unknown as ListingWithCar[];
}

export default async function VoorraadPage() {
  const listings = await getAllListings();

  return (
    <main className="px-8 py-20 bg-bg-soft min-h-screen">
      <div className="max-w-site mx-auto">
        <div className="eyebrow"><span className="dot" />Volledige voorraad</div>
        <h1 className="mt-2.5 text-3xl md:text-4xl">Alle wagens op het plein</h1>
        <StockGrid listings={listings} />
      </div>
    </main>
  );
}
