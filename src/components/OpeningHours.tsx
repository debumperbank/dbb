import { openingHours } from "@/lib/opening-hours";

export function OpeningHours() {
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
