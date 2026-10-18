import type { ReactNode } from "react";
import Link from "next/link";
import { SHOP_CLOSED_MESSAGE } from "@/lib/shop-status";
export function ShopClosed({children}: {children?: ReactNode}) {
  return <main className="px-5 py-16 md:px-8 md:py-24"><div className="max-w-site mx-auto">
    <div className="eyebrow">De Bumperbank · webshop</div>
    <h1 className="mt-5 text-4xl md:text-6xl">We bereiden onze winkel voor.</h1>
    <p className="mt-6 max-w-2xl text-muted leading-relaxed">{SHOP_CLOSED_MESSAGE} Je kunt de catalogus bekijken en een productaanvraag doen; we bevestigen de uitvoering en leverbaarheid persoonlijk.</p>
    <p className="mt-4 max-w-2xl text-muted leading-relaxed">{children ? "Hieronder kun je de producten van DRIFT, GECKO en Cartec alvast bekijken en de leverbaarheid aanvragen. Bestellen en betalen blijven voorlopig gepauzeerd." : "Hier vind je straks BUMPR, ons eigen autoverzorgingsmerk, en een selectie aanvullende merken. Het assortiment wordt nog samengesteld."}</p>
    <div className="mt-8 flex flex-wrap gap-3"><Link className="btn btn-primary" href="/bumpr">Ontdek BUMPR →</Link><Link className="btn btn-ghost" href="/contact">Neem contact op</Link></div>
    <p className="mt-8 text-sm text-muted">Al een bestelling geplaatst? Je bestaande bestellink blijft beschikbaar. Neem bij vragen contact met ons op.</p>
  </div>{children}</main>;
}
