import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPriceCents } from '@/lib/format';
import type { ListingWithCar } from '@/lib/types';
import { StatusForm, DeleteForm } from './row-actions';

async function getAllListings(): Promise<ListingWithCar[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('listings')
    .select('*, cars(*)')
    .order('created_at', { ascending: false });
  return (data ?? []) as unknown as ListingWithCar[];
}

export default async function AdminListingsPage() {
  const listings = await getAllListings();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
          <h1 className="text-2xl">Voorraad</h1>
        </div>
        <Link href="/admin/listings/new" className="btn btn-primary">+ Nieuwe wagen</Link>
      </div>

      <div className="border border-[color:var(--line-dark)] rounded-[4px] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg text-muted text-left font-mono text-[11px] uppercase">
            <tr>
              <th className="px-4 py-3">Wagen</th>
              <th className="px-4 py-3">Afdeling</th>
              <th className="px-4 py-3">Prijs</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t border-[color:var(--line-dark)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/listings/${listing.id}`} className="hover:text-orange">
                    {listing.cars.make} {listing.cars.model} <span className="text-muted">({listing.cars.build_year})</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{listing.department}</td>
                <td className="px-4 py-3 font-mono">{formatPriceCents(listing.price_cents)}</td>
                <td className="px-4 py-3">
                  <StatusForm listingId={listing.id} currentStatus={listing.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteForm listingId={listing.id} carId={listing.car_id} />
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted font-mono text-sm">
                  Nog geen wagens toegevoegd.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
