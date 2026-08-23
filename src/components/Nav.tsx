import Image from 'next/image';
import Link from 'next/link';

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-[color:var(--line-dark)]">
      <nav className="max-w-site mx-auto px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="De Bumperbank" width={40} height={40} className="object-contain" />
          <span className="font-display font-bold text-[17px]">
            DE <span className="text-orange">BUMPER</span>BANK
          </span>
        </Link>
        <div className="hidden md:flex gap-7 text-[13.5px] text-muted">
          <Link href="/voorraad" className="hover:text-paper transition-colors">Voorraad</Link>
          <Link href="/#diensten" className="hover:text-paper transition-colors">Herstelling</Link>
          <Link href="/bumpr" className="hover:text-paper transition-colors">BUMPR</Link>
          <Link href="/oldtimers" className="hover:text-paper transition-colors">Oldtimers</Link>
          <Link href="/contact" className="hover:text-paper transition-colors">Contact</Link>
        </div>
        <Link href="/contact" className="btn bg-orange text-[#101113] hover:bg-orange-bright">
          Plan een afspraak
        </Link>
      </nav>
    </header>
  );
}
