'use client';

import { useId, useState } from 'react';
import { ConsentCheckbox } from '@/components/ConsentCheckbox';

type Status = 'idle' | 'submitting' | 'done' | 'error';

export function ContactForm({ listingId }: { listingId?: string }) {
  const formId = useId();
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (listingId) data.listing_id = listingId;

    try {
      const res = await fetch('/api/inquiries', {
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

  if (status === 'done') {
    return (
      <p role="status" className="font-mono text-sm text-orange">
        Bedankt — we nemen zo snel mogelijk contact op.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
      {/* Honeypot — invisible to people, but a bot that fills every field
          will fill this too. The API route silently drops the submission
          if it's non-empty. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />
      <label htmlFor={`${formId}-name`} className="text-sm font-medium -mb-2">Naam</label>
      <input
        required
        id={`${formId}-name`}
        autoComplete="name"
        name="name"
        placeholder="Naam"
        className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-base placeholder:text-muted focus:outline-none focus:border-orange"
      />
      <label htmlFor={`${formId}-email`} className="text-sm font-medium -mb-2">E-mailadres</label>
      <input
        required
        type="email"
        id={`${formId}-email`}
        autoComplete="email"
        name="email"
        placeholder="E-mailadres"
        className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-base placeholder:text-muted focus:outline-none focus:border-orange"
      />
      <label htmlFor={`${formId}-phone`} className="text-sm font-medium -mb-2">Telefoon (optioneel)</label>
      <input
        id={`${formId}-phone`}
        autoComplete="tel"
        type="tel"
        name="phone"
        placeholder="Telefoon (optioneel)"
        className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-base placeholder:text-muted focus:outline-none focus:border-orange"
      />
      <label htmlFor={`${formId}-message`} className="text-sm font-medium -mb-2">Je bericht</label>
      <textarea
        id={`${formId}-message`}
        autoComplete="off"
        name="message"
        placeholder="Uw bericht"
        rows={4}
        className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-base placeholder:text-muted focus:outline-none focus:border-orange"
      />
      <ConsentCheckbox />
      <button type="submit" disabled={status === 'submitting'} className="btn btn-primary w-fit disabled:opacity-60">
        {status === 'submitting' ? 'Bezig met versturen…' : 'Versturen'}
      </button>
      {status === 'error' && (
        <p role="alert" className="font-mono text-xs text-orange-bright">
          Er ging iets mis. Probeer het opnieuw of bel ons rechtstreeks.
        </p>
      )}
    </form>
  );
}
