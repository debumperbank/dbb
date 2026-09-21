import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

async function getStats() {
  const supabase = createAdminClient();

  const [{ count: activeListings }, { count: newInquiries }, { count: newCarWash }, { count: newWorkshop }] =
    await Promise.all([
      supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('car_wash_bookings').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('workshop_bookings').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    ]);

  return {
    activeListings: activeListings ?? 0,
    newInquiries: newInquiries ?? 0,
    newBookings: (newCarWash ?? 0) + (newWorkshop ?? 0),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Actieve voorraad', value: stats.activeListings, href: '/admin/listings' },
    { label: 'Nieuwe interesses', value: stats.newInquiries, href: '/admin/inquiries' },
    { label: 'Nieuwe boekingen', value: stats.newBookings, href: '/admin/bookings' },
  ];

  return (
    <div>
      <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
      <h1 className="text-2xl mb-8">Overzicht</h1>
      <div className="grid sm:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-bg border border-[color:var(--line-dark)] hover:border-orange transition-colors rounded-[4px] p-6"
          >
            <div className="font-display text-4xl text-orange">{c.value}</div>
            <div className="text-sm text-muted mt-2">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
