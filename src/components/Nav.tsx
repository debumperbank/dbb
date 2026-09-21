import Image from "next/image";
import Link from "next/link";
const links = [
  ["Mobiele autoservice", "/mobiele-autoservice"],
  ["Werkplaats", "/werkplaats"],
  ["Detailing", "/detailing"],
  ["Occasions", "/occasions"],
  ["Auto verkopen", "/auto-verkopen"],
  ["Over ons", "/over-ons"],
  ["Contact", "/contact"],
];
export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur border-b border-white/10">
      <nav
        aria-label="Hoofdnavigatie"
        className="max-w-site mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-4"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-display font-bold"
        >
          <Image src="/logo.png" alt="" width={42} height={42} />
          DE <span className="text-orange">BUMPER</span>BANK
        </Link>
        <Link href="/afspraak" className="btn btn-primary">
          Afspraak aanvragen →
        </Link>
        <div className="hidden lg:flex w-full gap-7 text-sm text-muted">
          {links.map(([name, href]) => (
            <Link key={href} href={href} className="hover:text-orange">
              {name}
            </Link>
          ))}
        </div>
        <details className="lg:hidden w-full">
          <summary className="cursor-pointer text-sm">Menu</summary>
          <div className="grid gap-4 pt-5">
            {links.map(([name, href]) => (
              <Link key={href} href={href}>
                {name}
              </Link>
            ))}
          </div>
        </details>
      </nav>
    </header>
  );
}
