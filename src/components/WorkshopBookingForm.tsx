'use client';

import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'done' | 'error';

export function WorkshopBookingForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/workshop-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('done');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-orange';

  if (status === 'done') {
    return <p className="font-mono text-sm text-orange">Bedankt — we nemen contact op om de afspraak te bevestigen.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
      <input required name="name" placeholder="Naam" className={inputClass} />
      <input required type="email" name="email" placeholder="E-mailadres" className={inputClass} />
      <input name="phone" placeholder="Telefoon (optioneel)" className={inputClass} />
      <input name="service_type" placeholder="Type herstelling" className={inputClass} />
      <input type="date" name="requested_date" className={inputClass} />
      <textarea name="notes" placeholder="Omschrijving van het probleem" rows={3} className={inputClass} />
      <button type="submit" disabled={status === 'submitting'} className="btn btn-primary w-fit disabled:opacity-60">
        {status === 'submitting' ? 'Bezig met versturen…' : 'Afspraak aanvragen'}
      </button>
      {status === 'error' && <p className="font-mono text-xs text-orange-bright">Er ging iets mis. Probeer het opnieuw.</p>}
    </form>
  );
}
