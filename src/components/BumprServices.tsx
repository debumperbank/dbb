'use client';

import { useState } from 'react';
import { formatPriceCents } from '@/lib/format';

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

// Openingsuren — Date.getDay(): 0 = zondag, 5 = vrijdag, 6 = zaterdag.
// Update deze uren gerust naarmate er meer openingstijden bijkomen.
const OPENING_DAYS: { dayOfWeek: number; label: string; open: string; close: string }[] = [
  { dayOfWeek: 5, label: 'Vrijdag', open: '18:00', close: '22:00' },
  { dayOfWeek: 6, label: 'Zaterdag', open: '09:00', close: '20:00' },
  { dayOfWeek: 0, label: 'Zondag', open: '12:00', close: '18:00' },
];

// Volgende kalenderdatum (YYYY-MM-DD) voor een gegeven weekdag, zodat de
// aanvraag een concrete datum krijgt in plaats van enkel "vrijdag".
function nextDateForWeekday(dayOfWeek: number): string {
  const now = new Date();
  const diff = (dayOfWeek - now.getDay() + 7) % 7;
  const target = new Date(now);
  target.setDate(now.getDate() + diff);
  const y = target.getFullYear();
  const m = (target.getMonth() + 1).toString().padStart(2, '0');
  const d = target.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
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

function DayTimePicker() {
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [time, setTime] = useState('');

  const selectedDay = OPENING_DAYS.find((d) => d.dayOfWeek.toString() === dayOfWeek);
  const timeSlots = selectedDay ? generateHourlySlots(selectedDay.open, selectedDay.close) : [];
  const requestedDate = selectedDay ? nextDateForWeekday(selectedDay.dayOfWeek) : '';

  const handleDayChange = (value: string) => {
    setDayOfWeek(value);
    setTime('');
  };

  return (
    <>
      <div>
        <label className="text-[11px] text-muted font-mono uppercase mb-1 block">Gewenste dag</label>
        <select
          value={dayOfWeek}
          onChange={(e) => handleDayChange(e.target.value)}
          className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm w-full"
        >
          <option value="" disabled>Kies een dag</option>
          {OPENING_DAYS.map((d) => (
            <option key={d.dayOfWeek} value={d.dayOfWeek}>
              {d.label} ({d.open}–{d.close})
            </option>
          ))}
        </select>
        <p className="text-[11px] text-muted mt-1">
          We zijn enkel open op vrijdag, zaterdag en zondag.
        </p>
      </div>

      {selectedDay && (
        <div>
          <label className="text-[11px] text-muted font-mono uppercase mb-1 block">Gewenste tijd</label>
          <select
            name="requested_time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm w-full"
          >
            <option value="" disabled>Kies een tijdstip</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}

      {/* Verborgen veld met de concrete eerstvolgende datum voor de gekozen dag. */}
      <input type="hidden" name="requested_date" value={requestedDate} />
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
              Je aanvraag voor <strong>{service.name}</strong> is ontvangen. We nemen zo snel mogelijk contact op om de afspraak te bevestigen.
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

            <DayTimePicker />

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
      <div className="eyebrow"><span className="dot" />Diensten</div>
      <h2 className="mt-2.5 text-2xl md:text-3xl">Blikvangers</h2>

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