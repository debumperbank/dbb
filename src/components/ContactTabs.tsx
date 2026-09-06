'use client';

import { useState } from 'react';
import { ContactForm } from '@/components/ContactForm';
import { CarWashBookingForm } from '@/components/CarWashBookingForm';
import { WorkshopBookingForm } from '@/components/WorkshopBookingForm';

const TABS = [
  { key: 'general', label: 'Algemene vraag' },
  { key: 'carwash', label: 'Mobiele car wash' },
  { key: 'workshop', label: 'Werkplaats' },
] as const;

export function ContactTabs() {
  const [active, setActive] = useState<(typeof TABS)[number]['key']>('general');

  return (
    <div>
      <div className="flex gap-2 mb-8 border-b border-[color:var(--line-dark)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`font-mono text-xs px-4 py-3 border-b-2 transition-colors ${
              active === t.key ? 'border-orange text-orange' : 'border-transparent text-muted hover:text-paper'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {active === 'general' && <ContactForm />}
      {active === 'carwash' && <CarWashBookingForm />}
      {active === 'workshop' && <WorkshopBookingForm />}
    </div>
  );
}
