import { createClient } from '@/lib/supabase/server';
import type { ListingWithCar } from '@/lib/types';
import { formatPriceCents } from '@/lib/format';
import Link from 'next/link';

export const revalidate = 60;

async function getOldtimers(): Promise<ListingWithCar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*, cars(*)')
    .eq('department', 'oldtimer')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load oldtimers:', error.message);
    return [];
  }
  return (data ?? []) as unknown as ListingWithCar[];
}

export default async function OldtimersPage() {
  const listings = await getOldtimers();

  return (
    <main className="px-8 py-20 bg-paper text-ink min-h-screen">
      <div className="max-w-site mx-auto">
        <div className="eyebrow text-orange-deep"><span className="dot" />Oldtimer afdeling</div>
        <h1 className="mt-2.5 text-3xl md:text-4xl">Klassiekers, met dossier</h1>
        <p className="mt-4 max-w-[60ch] text-muted-dark text-[15px] leading-relaxed">
          Elke klassieker in dit overzicht komt met een volledig herstellingsdossier: van eerste
          opzoeking tot laatste laklaag.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {listings.length === 0 && (
            <p className="text-muted-dark text-sm font-mono">Er staat momenteel geen klassieker in de etalage.</p>
          )}
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/voorraad/${listing.slug ?? listing.id}`}
              className="block bg-white border border-[color:var(--line-light)] hover:border-orange-deep transition-colors rounded-[4px] p-5.5"
            >
              <div className="font-mono text-[11px] text-orange-deep">{listing.cars.build_year}</div>
              <h3 className="text-lg font-semibold font-display mt-2">{listing.cars.make} {listing.cars.model}</h3>
              {listing.cars.description && (
                <p className="text-[12.5px] text-muted-dark mt-2 leading-relaxed">{listing.cars.description}</p>
              )}
              {listing.price_cents > 0 && (
                <div className="mt-3.5 font-display text-lg text-orange-deep">
                  {formatPriceCents(listing.price_cents)}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
