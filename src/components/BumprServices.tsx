'use client';

import { useEffect, useState } from 'react';
import { formatPriceCents } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';

interface Service {
  id: string;
  name: string;
  priceCents: number;
  features: string[];
  excluded?: string[];
  isBundle?: boolean;
}

// Hand-maintained for now — same pattern as bumpr_products but these are
// bookable services, not shippable items, so they don't need a table yet.
// Move to a `bumpr_services` table later if these start changing often.
const SERVICES: Service[] = [
  {
    id: 'full-detail',
    name: 'BUMPR Full Detail',
    priceCents: 22900,
    features: [
      'Dieptereiniging interieur',
      'Complete exterieur behandeling',
      'Kleien & glanscorrectie',
    ],
    excluded: ['Geen lakbescherming/wax inbegrepen'],
  },
  {
    id: 'hydro-coat',
    name: 'BUMPR Hydro Coat (6 mnd)',
    priceCents: 14900,
    features: [
      'Exterieurwas & lakpreparatie',
      '6-maands keramische spraycoating',
      'Extreme glans & waterafstotendheid',
    ],
  },
  {
    id: 'ultimate-combi',
    name: 'Ultimate BUMPR Combi',
    priceCents: 34900,
    features: [
      'BUMPR Full Detail + 6-maands Hydro Coat',
      'De perfecte combinatie: nieuwstaat & bescherming',
    ],
    isBundle: true,
  },
];

// Beschikbaarheid van de mobiele service — Date.getDay(): 0 = zondag,
// 5 = vrijdag, 6 = zaterdag. Update deze uren gerust naarmate er meer
// beschikbaarheid bijkomt.
const OPENING_DAYS: Record<number, { open: string; close: string }> = {
  5: { open: '18:00', close: '22:00' },
  6: { open: '09:00', close: '20:00' },
  0: { open: '12:00', close: '18:00' },
};

interface DateOption {
  value: string; // YYYY-MM-DD
  label: string; // "Vrijdag 19 sep"
  dayOfWeek: number;
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
    if (dow in OPENING_DAYS) {
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const value = `${y}-${m}-${day}`;
      const dateLabel = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
      options.push({ value, label: `${dayNames[dow]} ${dateLabel}`, dayOfWeek: dow });
    }
  }

  return options;
}

function generateHourlySlots(open: string, close: string): string[] {
  const [oh] = open.split(':').map(Number);
  const [ch] = close.split(':').map(Number);
  const slots: string[] = [];
  for (let h = oh; h < ch; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

function DateTimePicker() {
  const [dateOptions] = useState<DateOption[]>(() => getUpcomingDates());
  const [selectedDate, setSelectedDate] = useState('');
  const [time, setTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const selectedOption = dateOptions.find((d) => d.value === selectedDate);
  const hours = selectedOption ? OPENING_DAYS[selectedOption.dayOfWeek] : null;
  const allSlots = hours ? generateHourlySlots(hours.open, hours.close) : [];
  const availableSlots = allSlots.filter((t) => !bookedTimes.includes(t));

  useEffect(() => {
    if (!selectedDate) {
      setBookedTimes([]);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    setTime('');

    const supabase = createClient();
    supabase
      .rpc('get_booked_slots', { check_date: selectedDate })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Failed to load booked slots:', error.message);
          setBookedTimes([]);
        } else {
          setBookedTimes((data ?? []).map((r: { requested_time: string }) => r.requested_time));
        }
        setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  return (
    <>
      <div>
        <label className="text-[11px] text-muted font-mono uppercase mb-1 block">Gewenste dag</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm w-full"
        >
          <option value="" disabled>Kies een dag</option>
          {dateOptions.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        <p className="text-[11px] text-muted mt-1">
          We rijden op vrijdag, zaterdag en zondag naar uw locatie.
        </p>
      </div>

      {selectedDate && (
        <div>
          <label className="text-[11px] text-muted font-mono uppercase mb-1 block">Gewenste tijd</label>
          {loadingSlots ? (
            <p className="text-[13px] text-muted">Beschikbaarheid ophalen...</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-[13px] text-orange">Alle tijdstippen op deze dag zijn volzet — kies een andere dag.</p>
          ) : (
            <select
              name="requested_time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm w-full"
            >
              <option value="" disabled>Kies een tijdstip</option>
              {availableSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <input type="hidden" name="requested_date" value={selectedDate} />
    </>
  );
}

function BookingForm({ service, onClose }: { service: Service; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      service_type: service.name,
      address: form.get('address'),
      requested_date: form.get('requested_date') || null,
      requested_time: form.get('requested_time') || null,
      notes: form.get('notes'),
      company: form.get('company'), // honeypot
    };

    try {
      const res = await fetch('/api/workshop-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.error ?? 'Er ging iets mis. Probeer het opnieuw.');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setErrorMsg('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Sluiten"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative w-full max-w-md h-full bg-bg border-l border-[color:var(--line-dark)] p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">{success ? 'Bedankt!' : 'Aanvraag'}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[color:var(--line-dark)] hover:bg-bg-soft"
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted">
              Je aanvraag voor <strong>{service.name}</strong> is ontvangen. We nemen zo snel mogelijk contact op om de definitieve datum en tijd te bevestigen.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full font-mono text-[12px] uppercase tracking-wide py-3 rounded-[3px] border border-[color:var(--line-dark)] hover:bg-bg-soft"
            >
              Sluiten
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-3">
            <div className="mb-2">
              <div className="font-mono text-[11px] uppercase text-muted">Dienst</div>
              <div className="text-[15px] font-semibold">{service.name}</div>
              <div className="font-display text-orange text-[17px] mt-1">{formatPriceCents(service.priceCents)}</div>
            </div>

            {/* Honeypot — hidden from real visitors via CSS. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px]"
              aria-hidden="true"
            />

            <input name="name" required placeholder="Naam" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
            <input name="email" type="email" required placeholder="E-mail" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
            <input name="phone" placeholder="Telefoon (optioneel)" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />
            <input name="address" required placeholder="Adres waar we naartoe moeten komen" className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm" />

            <DateTimePicker />

            <textarea name="notes" placeholder="Opmerkingen (optioneel)" rows={3} className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm resize-none" />

            {errorMsg && <p className="text-orange text-[13px]">{errorMsg}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full font-mono text-[12px] uppercase tracking-wide py-3 rounded-[3px] bg-orange text-white hover:bg-orange-bright transition-colors disabled:opacity-60"
            >
              {submitting ? 'Versturen...' : 'Aanvraag versturen'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function BumprServices() {
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <div>
      <div className="eyebrow"><span className="dot" />Mobiele diensten</div>
      <h2 className="mt-2.5 text-2xl md:text-3xl">Blikvangers</h2>
      <p className="mt-2 max-w-[50ch] text-muted text-sm leading-relaxed">
        Wij komen met onze volledig uitgeruste bus naar uw locatie — geen werkplaats nodig.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--line-dark)] border border-[color:var(--line-dark)] mt-8">
        {SERVICES.map((s) => (
          <div key={s.id} className={`relative px-5.5 py-6.5 flex flex-col ${s.isBundle ? 'bg-bg-soft-2' : 'bg-bg-soft'}`}>
            {s.isBundle && (
              <div className="absolute top-4 right-4 font-mono text-[9.5px] tracking-wide uppercase text-orange border border-orange px-2 py-0.5 rounded-[2px]">
                Combi
              </div>
            )}
            <h3 className="text-[17px] font-semibold font-display mb-3">{s.name}</h3>

            <ul className="grid gap-1.5 text-[12.8px] text-muted leading-relaxed flex-1">
              {s.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-orange">•</span>
                  <span>{f}</span>
                </li>
              ))}
              {s.excluded?.map((f) => (
                <li key={f} className="flex gap-2 text-muted/70">
                  <span>✕</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4.5 flex items-baseline justify-between border-t border-[color:var(--line-dark)] pt-3.5">
              <span className={`font-display text-[19px] ${s.isBundle ? 'text-orange-bright' : 'text-orange'}`}>
                {formatPriceCents(s.priceCents)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveService(s)}
              className="mt-4 w-full font-mono text-[12px] uppercase tracking-wide py-2.5 rounded-[3px] border border-orange text-orange hover:bg-orange hover:text-white transition-colors"
            >
              Aanvragen
            </button>
          </div>
        ))}
      </div>

      {activeService && (
        <BookingForm service={activeService} onClose={() => setActiveService(null)} />
      )}
    </div>
  );
}
