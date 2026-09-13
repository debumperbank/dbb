'use client';

import { useState } from 'react';
import { DateAvailabilityPicker } from '@/components/DateAvailabilityPicker';

type Status = 'idle' | 'submitting' | 'done' | 'error';

// Generieke/onbekende herstellingen krijgen nu het VEILIGE MAXIMUM (2u) als
// schatting, niet het minimum — zo lopen we niet het risico dat een klus
// uitloopt en het volgende slot in de knel komt.
const DEFAULT_HOURS = 2;

export function WorkshopBookingForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [selectedDate, setSelectedDate] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    data.requested_date = selectedDate;
    data.large_vehicle = form.querySelector<HTMLInputElement>('[name="large_vehicle"]')?.checked ? 'true' : 'false';

    try {
      const res = await fetch('/api/workshop-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('done');
      form.reset();
      setSelectedDate('');
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-orange';

  if (status === 'done') {
    return (
      <p className="font-mono text-sm text-orange">
        Bedankt — we nemen contact op om de definitieve datum en tijd te bevestigen.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />
      <input required name="name" placeholder="Naam" className={inputClass} />
      <input required type="email" name="email" placeholder="E-mailadres" className={inputClass} />
      <input name="phone" placeholder="Telefoon (optioneel)" className={inputClass} />
      <input name="service_type" placeholder="Type herstelling" className={inputClass} />
      <input required name="address" placeholder="Adres waar we naartoe moeten komen" className={inputClass} />

      <DateAvailabilityPicker
        requiredHours={DEFAULT_HOURS}
        value={selectedDate}
        onChange={setSelectedDate}
      />

      <textarea name="notes" placeholder="Omschrijving van het probleem" rows={3} className={inputClass} />

      <label className="flex items-start gap-2 text-[12.5px] text-muted">
        <input type="checkbox" name="large_vehicle" className="accent-orange mt-0.5" />
        <span>Dit is een grote wagen (SUV, bestelbus, camper, ...) — hiervoor rekenen we een toeslag van €59.</span>
      </label>

      <p className="text-[11px] text-muted leading-relaxed border-t border-[color:var(--line-dark)] pt-3">
        Op elke factuur wordt daarnaast een recyclagetoeslag van 21% van het gefactureerde bedrag aangerekend.
      </p>

      <button
        type="submit"
        disabled={status === 'submitting' || !selectedDate}
        className="btn btn-primary w-fit disabled:opacity-60"
      >
        {status === 'submitting' ? 'Bezig met versturen…' : 'Afspraak aanvragen'}
      </button>
      {status === 'error' && (
        <p className="font-mono text-xs text-orange-bright">Er ging iets mis. Probeer het opnieuw.</p>
      )}
    </form>
  );
}