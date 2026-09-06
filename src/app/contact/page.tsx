import { ContactTabs } from '@/components/ContactTabs';

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
      </div>
    </main>
  );
}
