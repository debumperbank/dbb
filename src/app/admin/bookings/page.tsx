import { createAdminClient } from '@/lib/supabase/admin';
import { updateCarWashStatus, updateWorkshopBookingStatus } from '@/app/admin/leads-actions';
import { LeadStatusSelect } from '@/app/admin/lead-status-select';

const BOOKING_STATUSES = ['new', 'contacted', 'completed', 'cancelled'];

async function getBookings() {
  const supabase = createAdminClient();

  const [{ data: carWash }, { data: workshop }] = await Promise.all([
    supabase.from('car_wash_bookings').select('*').order('created_at', { ascending: false }),
    supabase.from('workshop_bookings').select('*').order('created_at', { ascending: false }),
  ]);

  return {
    carWash: carWash ?? [],
    workshop: workshop ?? [],
  };
}

export default async function AdminBookingsPage() {
  const { carWash, workshop } = await getBookings();

  return (
    <div>
      <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
      <h1 className="text-2xl mb-8">Boekingen</h1>

      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4 text-orange">Carwash Afspraken</h2>
        <div className="bg-bg border border-[color:var(--line-dark)] rounded-[4px] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-soft-2 text-xs font-mono border-b border-[color:var(--line-dark)]">
              <tr>
                <th className="p-3">Naam</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Pakket</th>
                <th className="p-3">Datum/Tijd</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--line-dark)]">
              {carWash.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-muted text-xs font-mono">Geen carwash boekingen gevonden.</td>
                </tr>
              ) : (
                carWash.map((b: any) => (
                  <tr key={b.id}>
                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3 text-xs font-mono">{b.email}<br />{b.phone}</td>
                    <td className="p-3">{b.package_name ?? b.package}</td>
                    <td className="p-3 text-xs font-mono">{b.preferred_date} ({b.preferred_time})</td>
                    <td className="p-3">
                      <LeadStatusSelect
                        id={b.id}
                        currentStatus={b.status}
                        options={BOOKING_STATUSES}
                        onChange={updateCarWashStatus}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 text-orange">Werkplaats Afspraken</h2>
        <div className="bg-bg border border-[color:var(--line-dark)] rounded-[4px] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-soft-2 text-xs font-mono border-b border-[color:var(--line-dark)]">
              <tr>
                <th className="p-3">Naam</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Dienst</th>
                <th className="p-3">Datum</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--line-dark)]">
              {workshop.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-muted text-xs font-mono">Geen werkplaats boekingen gevonden.</td>
                </tr>
              ) : (
                workshop.map((b: any) => (
                  <tr key={b.id}>
                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3 text-xs font-mono">{b.email}<br />{b.phone}</td>
                    <td className="p-3">{b.service}</td>
                    <td className="p-3 text-xs font-mono">{b.preferred_date}</td>
                    <td className="p-3">
                      <LeadStatusSelect
                        id={b.id}
                        currentStatus={b.status}
                        options={BOOKING_STATUSES}
                        onChange={updateWorkshopBookingStatus}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}