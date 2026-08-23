'use client';

import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'done' | 'error';

export function ContactForm({ listingId }: { listingId?: string }) {
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
      <p className="font-mono text-sm text-orange">
        Bedankt — we nemen zo snel mogelijk contact op.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
      <input
        required
        name="name"
        placeholder="Naam"
        className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-orange"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="E-mailadres"
        className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-orange"
      />
      <input
        name="phone"
        placeholder="Telefoon (optioneel)"
        className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-orange"
      />
      <textarea
        name="message"
        placeholder="Uw bericht"
        rows={4}
        className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-orange"
      />
      <button type="submit" disabled={status === 'submitting'} className="btn btn-primary w-fit disabled:opacity-60">
        {status === 'submitting' ? 'Bezig met versturen…' : 'Versturen'}
      </button>
      {status === 'error' && (
        <p className="font-mono text-xs text-orange-bright">
          Er ging iets mis. Probeer het opnieuw of bel ons rechtstreeks.
        </p>
      )}
    </form>
  );
}
