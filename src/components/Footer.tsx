import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="bg-bg border-t border-white/10 px-6 py-7">
      <div className="max-w-site mx-auto flex flex-wrap items-center justify-between gap-6">
        <Link href="/">
          <BrandLogo className="w-32" />
        </Link>
        <div className="flex flex-wrap items-center gap-5 font-mono text-[11px] text-muted">
          <Link href="/bumpr" className="hover:text-orange">
            BUMPR
          </Link>
          <Link href="/oldtimers" className="hover:text-orange">
            Oldtimers
          </Link>
          <Link href="/voorwaarden" className="hover:text-orange">
            Algemene Voorwaarden
          </Link>
          <Link href="/privacybeleid" className="hover:text-orange">
            Privacybeleid
          </Link>
          <span>© {new Date().getFullYear()} DE BUMPERBANK — REGIO HULST</span>
        </div>
      </div>
    </footer>
  );
}
