import { openingHours } from "@/lib/opening-hours";

import { EXAMPLE_MODE } from "@/lib/public-offering";
export function OpeningHours() {
  if (EXAMPLE_MODE) return <section aria-label="In opbouw"><h2 className="text-base text-paper">In opbouw</h2><p className="mt-2 max-w-sm text-sm text-muted">Voorlopig geen verkoop, betalingen of afspraken.</p></section>;
  return (
    <section aria-label="Openingstijden">
      <h2 className="text-base text-paper">Openingstijden</h2>
      <dl className="mt-2 space-y-2 text-sm text-muted">
        {openingHours.map(({ label, time, note }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              <span className="text-paper">{time}</span>
              {note && <span className="block text-xs mt-1">{note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
