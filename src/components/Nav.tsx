"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartLink } from "./CartLink";
import { BrandLogo } from "./BrandLogo";
const links = [
  ["Mobiele autoservice", "/mobiele-autoservice"],
  ["Werkplaats", "/werkplaats"],
  ["Detailing", "/detailing"],
  ["BUMPR", "/bumpr"],
  ["Occasions", "/occasions"],
  ["Auto verkopen", "/auto-verkopen"],
  ["Over ons", "/over-ons"],
  ["Contact", "/contact"],
];
export function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-xl border-b border-white/10">
      <nav
        aria-label="Hoofdnavigatie"
        className="max-w-site mx-auto px-5 md:px-8"
      >
        <div className="flex items-center justify-between gap-1 sm:gap-3 py-2 md:py-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="De Bumperbank — home"
          >
            <BrandLogo className="w-20 sm:w-24" priority />
          </Link>
          <p className="hidden md:block text-xs font-mono uppercase tracking-widest text-muted">
            Mobiele autoservice <span className="text-orange">/</span> Regio
            Hulst
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/afspraak"
              onClick={() => setOpen(false)}
              className="btn btn-primary !px-2 sm:!px-4 !text-xs sm:!text-sm"
            >
              <span className="sm:hidden">Afspraak →</span>
              <span className="hidden sm:inline">Afspraak aanvragen →</span>
            </Link>
            <CartLink onClick={() => setOpen(false)} />
            <button
              aria-label={open ? "Menu sluiten" : "Menu openen"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="lg:hidden flex items-center justify-center w-11 h-11 border border-white/20 rounded-md"
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                {open ? (
                  <path d="m4 4 12 12M16 4 4 16" />
                ) : (
                  <path d="M2 5h16M2 10h16M2 15h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className="hidden lg:flex justify-between gap-4 border-t border-white/10 py-4">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              className={`text-sm transition-colors hover:text-orange ${path === href ? "text-orange" : "text-muted"}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div
          id="mobile-nav"
          hidden={!open}
          className="lg:hidden border-t border-white/10 pb-5 max-h-[65vh] overflow-y-auto"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={path === href ? "page" : undefined}
              className={`flex items-center justify-between min-h-12 py-3 border-b border-white/5 ${path === href ? "text-orange" : "text-paper"}`}
            >
              {label}
              <span aria-hidden="true" className="text-orange">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
