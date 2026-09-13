'use client';

import { useState } from 'react';
import { formatPriceCents } from '@/lib/format';
import { DateAvailabilityPicker } from '@/components/DateAvailabilityPicker';

interface Service {
  id: string;
  name: string;
  priceCents: number;
  features: string[];
  excluded?: string[];
  isBundle?: boolean;
  // Geschatte werkuren voor deze klus — startpunt, kan later per klus
  // handmatig bijgesteld worden zodra er een verfijnder systeem is.
  hoursEstimate: number;
}

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
    hoursEstimate: 1,
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
    hoursEstimate: 1,
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
    hoursEstimate: 3,
  },
];

function BookingForm({ service, onClose }: { service: Service; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

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
      requested_date: selectedDate || null,
      notes: form.get('notes'),
      large_vehicle: form.get('large_vehicle') === 'on',
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

            <DateAvailabilityPicker
              requiredHours={service.hoursEstimate}
              value={selectedDate}
              onChange={setSelectedDate}
            />

            <textarea name="notes" placeholder="Opmerkingen (optioneel)" rows={3} className="border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2.5 bg-bg-soft text-sm resize-none" />

            <label className="flex items-start gap-2 text-[12.5px] text-muted">
              <input type="checkbox" name="large_vehicle" className="accent-orange mt-0.5" />
              <span>Dit is een grote wagen (SUV, bestelbus, camper, ...) — hiervoor rekenen we een toeslag van €59.</span>
            </label>

            <p className="text-[11px] text-muted leading-relaxed border-t border-[color:var(--line-dark)] pt-3">
              Op elke factuur wordt daarnaast een recyclagetoeslag van 21% van het gefactureerde bedrag aangerekend.
            </p>

            {errorMsg && <p className="text-orange text-[13px]">{errorMsg}</p>}

            <button
              type="submit"
              disabled={submitting || !selectedDate}
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
