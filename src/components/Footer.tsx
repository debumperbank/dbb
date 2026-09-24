import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#08090a] px-5 py-9 md:px-8">
      <div className="hero-grid absolute inset-0 opacity-[0.12]" />
      <div className="relative mx-auto max-w-[1480px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" aria-label="De Bumperbank home">
              <BrandLogo className="w-28 sm:w-[190px]" sizes="(max-width: 639px) 112px, 190px" />
            </Link>
            <div className="hidden h-10 w-px bg-white/10 sm:block" />
            <div className="hidden sm:block">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-orange">Mobiele autoservice</p>
              <p className="mt-1 text-xs text-muted">Hulst · Nederland</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
            <Link href="/bumpr" className="inline-flex min-h-11 items-center hover:text-orange">BUMPR</Link>
            <Link href="/oldtimers" className="inline-flex min-h-11 items-center hover:text-orange">Oldtimers</Link>
            <Link href="/voorwaarden" className="inline-flex min-h-11 items-center hover:text-orange">Algemene voorwaarden</Link>
            <Link href="/privacybeleid" className="inline-flex min-h-11 items-center hover:text-orange">Privacybeleid</Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">
          <span>© {new Date().getFullYear()} De Bumperbank</span>
          <span className="text-orange/70">Jouw auto. Onze zorg.</span>
        </div>
      </div>
    </footer>
  );
}
