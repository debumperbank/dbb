import { createAdminClient } from '@/lib/supabase/admin';
import { LeadStatusSelect } from '../lead-status-select';
import { updateCarWashStatus, updateWorkshopBookingStatus } from '../leads-actions';

interface CarWashRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string;
  requested_date: string | null;
  notes: string | null;
  status: string;
}

interface WorkshopRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string | null;
  requested_date: string | null;
  notes: string | null;
  status: string;
}

async function getBookings() {
  const supabase = await createAdminClient();
  const [{ data: carWash }, { data: workshop }] = await Promise.all([
    supabase.from('car_wash_bookings').select('*').order('created_at', { ascending: false }),
    supabase.from('workshop_bookings').select('*').order('created_at', { ascending: false }),
  ]);
  return {
    carWash: (carWash ?? []) as CarWashRow[],
    workshop: (workshop ?? []) as WorkshopRow[],
  };
}

const STATUS_OPTIONS = ['new', 'scheduled', 'done', 'cancelled'];

export default async function AdminBookingsPage() {
  const { carWash, workshop } = await getBookings();

  return (
    <div>
      <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
      <h1 className="text-2xl mb-8">Boekingen</h1>

      <section className="mb-12">
        <h2 className="text-lg mb-4">Mobiele car wash</h2>
        <div className="grid gap-3">
          {carWash.map((b) => (
            <div key={b.id} className="border border-[color:var(--line-dark)] rounded-[4px] p-5 bg-bg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm">{b.name}</div>
                  <div className="text-muted text-xs font-mono mt-0.5">{b.email}{b.phone ? ` · ${b.phone}` : ''}</div>
                  <div className="text-xs text-muted mt-1">{b.address}{b.requested_date ? ` · gewenst: ${b.requested_date}` : ''}</div>
                </div>
                <LeadStatusSelect id={b.id} currentStatus={b.status} options={STATUS_OPTIONS} onChange={updateCarWashStatus} />
              </div>
              {b.notes && <p className="text-sm text-muted mt-3">{b.notes}</p>}
            </div>
          ))}
          {carWash.length === 0 && <p className="text-muted text-sm font-mono">Nog geen aanvragen.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-lg mb-4">Werkplaats</h2>
        <div className="grid gap-3">
          {workshop.map((b) => (
            <div key={b.id} className="border border-[color:var(--line-dark)] rounded-[4px] p-5 bg-bg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm">{b.name}</div>
                  <div className="text-muted text-xs font-mono mt-0.5">{b.email}{b.phone ? ` · ${b.phone}` : ''}</div>
                  <div className="text-xs text-muted mt-1">
                    {b.service_type ?? 'Algemeen'}{b.requested_date ? ` · gewenst: ${b.requested_date}` : ''}
                  </div>
                </div>
                <LeadStatusSelect id={b.id} currentStatus={b.status} options={STATUS_OPTIONS} onChange={updateWorkshopBookingStatus} />
              </div>
              {b.notes && <p className="text-sm text-muted mt-3">{b.notes}</p>}
            </div>
          ))}
          {workshop.length === 0 && <p className="text-muted text-sm font-mono">Nog geen aanvragen.</p>}
        </div>
      </section>
    </div>
  );
}
