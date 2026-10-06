import type { Metadata } from "next";
import { ContactTabs } from '@/components/ContactTabs';

export const metadata: Metadata = {
  title: "Contact in Hulst | De Bumperbank",
  description: "Neem contact op met De Bumperbank in Hulst voor vragen over voertuigen, herstellingen of mobiele car wash. Stuur een bericht of vraag een afspraak aan.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="px-8 py-20 bg-bg min-h-screen">
      <div className="max-w-site mx-auto">
        <div className="eyebrow"><span className="dot" />Contact</div>
        <h1 className="mt-2.5 text-3xl md:text-4xl mb-3">Stuur ons een bericht</h1>
        <p className="text-muted text-[15px] max-w-[60ch] mb-10">
          Vraag over een wagen, een herstelling, of de mobiele car wash — laat het ons weten en we
          nemen zo snel mogelijk contact op.
        </p>
        <ContactTabs />
        <section aria-label="Bedrijfsgegevens" className="mt-10 border-t border-white/10 pt-6">
          <h2 className="text-lg">De Bumperbank</h2>
          <p className="mt-2 text-muted">KvK-nummer: <span className="text-paper">42171617</span></p>
          <p className="mt-2 text-muted">Btw-identificatienummer: <span className="text-paper">NL005557496B77</span></p>
        </section>
      </div>
    </main>
  );
}
