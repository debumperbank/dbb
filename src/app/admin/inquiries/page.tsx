import { createAdminClient } from '@/lib/supabase/admin';
import { updateInquiryStatus } from '@/app/admin/leads-actions';
import { LeadStatusSelect } from '@/app/admin/lead-status-select';

const INQUIRY_STATUSES = ['new', 'contacted', 'closed'];

async function getInquiries() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return data ?? [];
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
      <h1 className="text-2xl mb-8">Interesses</h1>

      <div className="bg-bg border border-[color:var(--line-dark)] rounded-[4px] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-soft-2 text-xs font-mono border-b border-[color:var(--line-dark)]">
            <tr>
              <th className="p-3">Naam</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Bericht / Auto</th>
              <th className="p-3">Datum</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--line-dark)]">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-muted text-xs font-mono">Geen interesses gevonden.</td>
              </tr>
            ) : (
              inquiries.map((inquiry: any) => (
                <tr key={inquiry.id}>
                  <td className="p-3 font-medium">{inquiry.name}</td>
                  <td className="p-3 text-xs font-mono">{inquiry.email}<br />{inquiry.phone}</td>
                  <td className="p-3 text-xs">{inquiry.message || inquiry.listing_title || '-'}</td>
                  <td className="p-3 text-xs font-mono">
                    {new Date(inquiry.created_at).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="p-3">
                    <LeadStatusSelect
                      id={inquiry.id}
                      currentStatus={inquiry.status}
                      options={INQUIRY_STATUSES}
                      onChange={updateInquiryStatus}
                    />
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