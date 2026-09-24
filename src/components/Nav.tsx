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
    <header onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); event.currentTarget.querySelector<HTMLButtonElement>('[aria-controls="mobile-nav"]')?.focus(); } }} className="site-header sticky top-0 z-50 border-b border-white/10 bg-[#08090a]/95 backdrop-blur-xl">
      <nav aria-label="Hoofdnavigatie" className="mx-auto max-w-[1480px] px-4 md:px-8">
        <div className="flex min-h-[92px] items-center justify-between gap-2 sm:gap-5 lg:min-h-[104px]">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="De Bumperbank — home"
            className="group shrink-0"
          >
            <BrandLogo className="w-20 min-[360px]:w-28 sm:w-[208px] lg:w-[238px] 2xl:w-[180px] transition-transform duration-300 group-hover:scale-[1.015]" priority />
          </Link>

          <div className="hidden 2xl:flex flex-1 items-center justify-center gap-3">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? "page" : undefined}
                className={`nav-link relative whitespace-nowrap py-3 text-[12px] font-medium transition-colors hover:text-orange ${
                  path === href ? "text-orange" : "text-paper/75"
                }`}
              >
                {label}
                {path === href && <span className="absolute bottom-0 left-0 h-[2px] w-full bg-orange" />}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2.5">
            <Link
              href="/afspraak"
              onClick={() => setOpen(false)}
              className="btn btn-primary !hidden md:!inline-flex !min-h-[46px] !px-2 sm:!px-5 !text-xs sm:!text-[12.5px] whitespace-nowrap"
            >
              <span className="sm:hidden">Afspraak →</span>
              <span className="hidden sm:inline">Afspraak aanvragen&nbsp; →</span>
            </Link>
            <CartLink onClick={() => setOpen(false)} />
            <button
              aria-label={open ? "Menu sluiten" : "Menu openen"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="2xl:hidden flex h-[46px] w-[46px] items-center justify-center rounded-md border border-white/20 bg-white/[0.02] transition-colors hover:border-orange hover:text-orange"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                {open ? <path d="m4 4 12 12M16 4 4 16" /> : <path d="M2 5h16M2 10h16M2 15h16" />}
              </svg>
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          hidden={!open}
          className="2xl:hidden border-t border-white/10 pb-5 max-h-[72vh] overflow-y-auto"
        >
          <Link
            href="/afspraak"
            onClick={() => setOpen(false)}
            className="btn btn-primary md:!hidden w-full justify-center my-4"
          >
            Afspraak aanvragen →
          </Link>
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={path === href ? "page" : undefined}
              className={`flex min-h-12 items-center justify-between border-b border-white/5 py-3 font-medium ${
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
