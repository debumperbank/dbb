"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartLink } from "./CartLink";
import { BrandLogo } from "./BrandLogo";

const links = [
  ["Home", "/"],
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090a0b]/95 backdrop-blur-xl">
      <nav aria-label="Hoofdnavigatie" className="max-w-[1480px] mx-auto px-4 md:px-7">
        <div className="flex min-h-[92px] items-center justify-between gap-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="De Bumperbank — home"
            className="shrink-0"
          >
            <BrandLogo className="w-[188px] sm:w-[215px] lg:w-[245px]" priority />
          </Link>

          <div className="hidden 2xl:flex flex-1 items-center justify-center gap-5 2xl:gap-7">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? "page" : undefined}
                className={`relative whitespace-nowrap text-[13px] font-medium transition-colors hover:text-orange ${
                  path === href ? "text-orange" : "text-paper/80"
                }`}
              >
                {label}
                {path === href && (
                  <span className="absolute -bottom-3 left-0 h-[2px] w-full bg-orange" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/afspraak"
              onClick={() => setOpen(false)}
              className="btn btn-primary !px-3 sm:!px-5 !text-xs sm:!text-sm whitespace-nowrap"
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
              className="2xl:hidden flex h-11 w-11 items-center justify-center rounded-md border border-white/20 hover:border-orange transition-colors"
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

        <div
          id="mobile-nav"
          hidden={!open}
          className="2xl:hidden border-t border-white/10 pb-5 max-h-[70vh] overflow-y-auto"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={path === href ? "page" : undefined}
              className={`flex min-h-12 items-center justify-between border-b border-white/5 py-3 ${
                path === href ? "text-orange" : "text-paper"
              }`}
            >
              {label}
              <span aria-hidden="true" className="text-orange">↗</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
