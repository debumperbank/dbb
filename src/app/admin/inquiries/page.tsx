import { createAdminClient } from '@/lib/supabase/admin';
import { LeadStatusSelect } from '../lead-status-select';
import { updateInquiryStatus } from '../leads-actions';

interface InquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

async function getInquiries(): Promise<InquiryRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as InquiryRow[];
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
      <h1 className="text-2xl mb-8">Interesses</h1>

      <div className="grid gap-3">
        {inquiries.map((i) => (
          <div key={i.id} className="border border-[color:var(--line-dark)] rounded-[4px] p-5 bg-bg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-sm">{i.name}</div>
                <div className="text-muted text-xs font-mono mt-0.5">{i.email}{i.phone ? ` · ${i.phone}` : ''}</div>
              </div>
              <LeadStatusSelect
                id={i.id}
                currentStatus={i.status}
                options={['new', 'contacted', 'closed']}
                onChange={updateInquiryStatus}
              />
            </div>
            {i.message && <p className="text-sm text-muted mt-3">{i.message}</p>}
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="text-muted text-sm font-mono">Nog geen interesses binnengekomen.</p>
        )}
      </div>
    </div>
  );
}
