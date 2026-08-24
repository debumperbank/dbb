'use client';

import { useTransition } from 'react';
import { updateListingStatus, deleteListing } from './actions';

const STATUSES = ['draft', 'active', 'reserved', 'sold'];

export function StatusForm({ listingId, currentStatus }: { listingId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateListingStatus(listingId, e.target.value))}
      className="bg-bg border border-[color:var(--line-dark)] rounded-[3px] px-2 py-1 text-xs font-mono focus:outline-none focus:border-orange"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

export function DeleteForm({ listingId, carId }: { listingId: string; carId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm('Deze wagen en zijn dossier definitief verwijderen?')) {
          startTransition(() => deleteListing(listingId, carId));
        }
      }}
      className="font-mono text-xs text-muted hover:text-orange-bright"
    >
      Verwijderen
    </button>
  );
}
