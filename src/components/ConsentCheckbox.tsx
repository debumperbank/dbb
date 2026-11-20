export function ConsentCheckbox() {
  return (
    <label className="flex items-start gap-2.5 text-[13px] text-muted leading-snug">
      <input
        required
        type="checkbox"
        name="consent"
        // Never checked by default — under AVG/GDPR a consent checkbox
        // must start unticked; the visitor has to actively agree.
        defaultChecked={false}
        className="mt-0.5 h-6 w-6 shrink-0 accent-orange"
      />
      <span>
        Ik ga akkoord met de{' '}
        <a
          href="/voorwaarden"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange underline decoration-orange/70 underline-offset-2 hover:decoration-orange"
        >
          Algemene Voorwaarden
        </a>{' '}
        en het{' '}
        <a
          href="/privacybeleid"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange underline decoration-orange/70 underline-offset-2 hover:decoration-orange"
        >
          Privacybeleid
        </a>{' '}
        van De Bumperbank. (Verplicht)
      </span>
    </label>
  );
}
