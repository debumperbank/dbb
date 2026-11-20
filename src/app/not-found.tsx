import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagina niet gevonden | De Bumperbank",
  robots: { index: false, follow: false },
};

const links = [
  ["Detailing", "/detailing"],
  ["Over ons", "/over-ons"],
] as const;

export default function NotFound() {
  return (
    <main className="px-5 py-16 md:px-8 md:py-28">
      <div className="mx-auto max-w-site">
        <p className="eyebrow"><span className="dot" />404</p>
        <h1 className="mt-5 max-w-3xl text-4xl md:text-6xl">Pagina niet gevonden.</h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted">
          Deze pagina bestaat niet. Ga terug naar de startpagina of kies een onderdeel hieronder.
        </p>
        <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
          <Link href="/" className="btn btn-primary justify-center">Naar de startpagina →</Link>
          <Link href="/contact" className="btn btn-ghost justify-center">Contact</Link>
        </div>
        <ul className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="panel flex min-h-12 items-center justify-between text-sm font-medium hover:border-orange/70">
                {label}
                <span aria-hidden="true" className="text-orange">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
