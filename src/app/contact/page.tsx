import { EXAMPLE_MODE } from "@/lib/public-offering";
import { OpeningHours } from "@/components/OpeningHours";
import type { Metadata } from "next";
import { ContactTabs } from '@/components/ContactTabs';

export const metadata: Metadata = {
  title: "Contact in Hulst | De Bumperbank",
  description: EXAMPLE_MODE ? "Een algemene vraag over De Bumperbank of onze plannen? Stuur ons een bericht. De website is in opbouw." : "Neem contact op voor detailing op afspraak of advies over onze autoverzorgingsproducten. Locatie in overleg.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({searchParams}: {searchParams: Promise<{product?: string | string[]}>}) {
  const params = await searchParams;
  const product = typeof params.product === "string" ? params.product.trim().slice(0,200) : "";
  return (
    <main className="px-8 py-20 bg-bg min-h-screen">
      <div className="max-w-site mx-auto">
        <div className="eyebrow"><span className="dot" />Contact</div>
        <h1 className="mt-2.5 text-3xl md:text-4xl mb-3">Stuur ons een bericht</h1>
        <p className="text-muted text-[15px] max-w-[60ch] mb-10">
          {EXAMPLE_MODE ? "Onze website is in opbouw. Je kunt ons een algemene vraag stellen over De Bumperbank of onze plannen. We nemen momenteel geen bestellingen, betalingen of afspraakaanvragen aan." : "Een vraag over detailing, onze producten of een mogelijke samenwerking? Laat het ons weten en we nemen zo snel mogelijk contact op."}
        </p>
        <ContactTabs product={product} />
        <div className="mt-10 border-t border-white/10 pt-6">
          <OpeningHours />
        </div>
        <section aria-label="Bedrijfsgegevens" className="mt-10 border-t border-white/10 pt-6">
          <h2 className="text-lg">De Bumperbank</h2>
          <p className="mt-2 text-muted">KvK-nummer: <span className="text-paper">42171617</span></p>
          <p className="mt-2 text-muted">Btw-identificatienummer: <span className="text-paper">NL005557496B77</span></p>
        </section>
      </div>
    </main>
  );
}
