'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Openingsvensters en totale beschikbare werkuren per dag.
// Date.getDay(): 0 = zondag, 5 = vrijdag, 6 = zaterdag.
const OPENING_DAYS: Record<number, { open: string; close: string; capacityHours: number }> = {
  5: { open: '18:00', close: '22:00', capacityHours: 4 },
  6: { open: '10:00', close: '22:00', capacityHours: 12 },
  0: { open: '12:00', close: '18:00', capacityHours: 6 },
};

interface DateOption {
  value: string; // YYYY-MM-DD
  label: string; // "Vrijdag 19 sep"
  dayOfWeek: number;
  capacityHours: number;
}

// De eerstvolgende vrijdagen, zaterdagen en zondagen binnen 2 weken (6 dagen).
function getUpcomingDates(): DateOption[] {
  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  const options: DateOption[] = [];
  const now = new Date();

  for (let i = 0; i < 14 && options.length < 6; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dow = d.getDay();
    const config = OPENING_DAYS[dow];
    if (config) {
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const value = `${y}-${m}-${day}`;
      const dateLabel = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
      options.push({ value, label: `${dayNames[dow]} ${dateLabel}`, dayOfWeek: dow, capacityHours: config.capacityHours });
    }
  }

  return options;
}

export function DateAvailabilityPicker({
  requiredHours,
  value,
  onChange,
}: {
  requiredHours: number;
  value: string;
  onChange: (date: string) => void;
}) {
  const [dateOptions] = useState<DateOption[]>(() => getUpcomingDates());
  const [remaining, setRemaining] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const supabase = createClient();
    Promise.all(
      dateOptions.map((d) =>
        supabase
          .rpc('get_booked_hours', { check_date: d.value })
          .then(({ data, error }) => ({
            value: d.value,
            booked: error ? 0 : Number(data ?? 0),
          }))
      )
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, number> = {};
      results.forEach((r) => {
        const opt = dateOptions.find((d) => d.value === r.value)!;
        map[r.value] = opt.capacityHours - r.booked;
      });
      setRemaining(map);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // dateOptions komt uit een useState-initializer en verandert niet meer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <label className="text-[11px] text-muted font-mono uppercase mb-1 block">Gewenste dag</label>
      {loading ? (
        <p className="text-[13px] text-muted">Beschikbaarheid ophalen...</p>
      ) : (
        <select
          name="requested_date"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm w-full"
        >
          <option value="" disabled>Kies een dag</option>
          {dateOptions.map((d) => {
            const rem = remaining[d.value] ?? d.capacityHours;
            const full = rem < requiredHours;
            return (
              <option key={d.value} value={d.value} disabled={full}>
                {d.label} {full ? '— volzet' : `— nog ${rem} uur beschikbaar`}
              </option>
            );
          })}
        </select>
      )}
      <p className="text-[11px] text-muted mt-1">
        We rijden op vrijdag, zaterdag en zondag naar uw locatie. De exacte tijd binnen de dag spreken we telefonisch af.
      </p>
    </div>
  );
}
