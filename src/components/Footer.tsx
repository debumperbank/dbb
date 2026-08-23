import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-bg border-t border-[color:var(--line-dark)] px-8 py-7">
      <div className="max-w-site mx-auto flex flex-wrap items-center justify-between gap-3.5">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="De Bumperbank" width={28} height={28} className="object-contain" />
          <span className="font-display font-bold text-[15px]">
            DE <span className="text-orange">BUMPER</span>BANK
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted">
          © {new Date().getFullYear()} DE BUMPERBANK — TERNEUZEN — SINDS 1994
        </span>
      </div>
    </footer>
  );
}
