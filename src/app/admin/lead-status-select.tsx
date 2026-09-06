'use client';

import { useTransition } from 'react';

export function LeadStatusSelect({
  id,
  currentStatus,
  options,
  onChange,
}: {
  id: string;
  currentStatus: string;
  options: string[];
  onChange: (id: string, status: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => startTransition(() => onChange(id, e.target.value))}
      className="bg-bg border border-[color:var(--line-dark)] rounded-[3px] px-2 py-1 text-xs font-mono focus:outline-none focus:border-orange"
    >
      {options.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
