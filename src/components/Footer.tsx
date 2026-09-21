import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-bg border-t border-[color:var(--line-dark)] px-8 py-7">
      <div className="max-w-site mx-auto flex flex-wrap items-center justify-between gap-3.5">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="De Bumperbank"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-display font-bold text-[15px]">
            DE <span className="text-orange">BUMPER</span>BANK
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-5 font-mono text-[11px] text-muted">
          <Link href="/bumpr">BUMPR</Link>
          <Link href="/oldtimers">Oldtimers</Link>
          <Link
            href="/voorwaarden"
            className="hover:text-paper transition-colors"
          >
            Algemene Voorwaarden
          </Link>
          <Link
            href="/privacybeleid"
            className="hover:text-paper transition-colors"
          >
            Privacybeleid
          </Link>
          <span>© {new Date().getFullYear()} DE BUMPERBANK — REGIO HULST</span>
        </div>
      </div>
    </footer>
  );
}
