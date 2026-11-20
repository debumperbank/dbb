"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="px-5 py-16 md:px-8 md:py-28">
      <div className="mx-auto max-w-site">
        <p className="eyebrow"><span className="dot" />Even niet beschikbaar</p>
        <h1 className="mt-5 max-w-3xl text-4xl md:text-6xl">Deze pagina kan nu niet worden geladen.</h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted">
          Probeer het opnieuw. Lukt dat niet, ga terug naar de startpagina.
        </p>
        <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
          <button type="button" onClick={() => reset()} className="btn btn-primary justify-center">
            Opnieuw proberen
          </button>
          <Link href="/" className="btn btn-ghost justify-center">Naar de startpagina</Link>
        </div>
      </div>
    </main>
  );
}
