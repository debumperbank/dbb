import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

async function getAllListings() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  return data ?? [];
}

export default async function AdminListingsPage() {
  const listings = await getAllListings();

  return (
    <div>
      <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl">Voorraad</h1>
        <Link
          href="/admin/listings/new"
          className="bg-orange hover:bg-orange-dark text-bg font-bold px-4 py-2 rounded-[3px] text-xs transition-colors"
        >
          + Nieuwe auto
        </Link>
      </div>

      <div className="bg-bg border border-[color:var(--line-dark)] rounded-[4px] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-soft-2 text-xs font-mono border-b border-[color:var(--line-dark)]">
            <tr>
              <th className="p-3">Titel</th>
              <th className="p-3">Prijs</th>
              <th className="p-3">Status</th>
              <th className="p-3">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--line-dark)]">
            {listings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-muted text-xs font-mono">Geen voertuigen in voorraad.</td>
              </tr>
            ) : (
              listings.map((item: any) => (
                <tr key={item.id}>
                  <td className="p-3 font-medium">{item.title}</td>
                  <td className="p-3 font-mono text-xs">€ {item.price?.toLocaleString('nl-NL')}</td>
                  <td className="p-3 text-xs font-mono">{item.status}</td>
                  <td className="p-3">
                    <Link
                      href={`/admin/listings/${item.id}`}
                      className="text-xs text-orange hover:underline font-mono"
                    >
                      Bewerken
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}