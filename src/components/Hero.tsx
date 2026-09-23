import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 md:px-8 py-14 md:py-24">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 90% 20%, #f5d02815, transparent 65%)",
        }}
      />
      <div className="relative max-w-site mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
        <div>
          <div className="eyebrow">
            <span className="dot" />
            Mobiele autoservice · Regio Hulst
          </div>
          <h1 className="mt-6 text-[clamp(2.75rem,5.7vw,5.1rem)] max-w-[13ch]">
            De garage die <span className="text-orange">naar je toe komt.</span>
          </h1>
          <p className="text-muted text-base md:text-lg leading-relaxed mt-7 max-w-xl">
            Onderhoud, reparatie en detailing op locatie. Persoonlijk geregeld,
            met aandacht voor jouw auto. Ook voor occasions en de verkoop van je
            auto.
          </p>
          <div className="flex flex-col min-[420px]:flex-row gap-3 mt-8">
            <Link href="/afspraak" className="btn btn-primary justify-center">
              Afspraak aanvragen →
            </Link>
            <Link href="#diensten" className="btn btn-ghost justify-center">
              Ontdek onze diensten
            </Link>
          </div>
          <p className="text-muted text-xs leading-relaxed mt-5">
            Je kiest een voorkeur. Wij bespreken het werk en bevestigen de
            afspraak.
          </p>
        </div>
        <div className="relative panel !p-7 md:!p-10 border-t-2 !border-t-orange">
          <div className="eyebrow justify-between">
            <span>De Bumperbank</span>
            <span className="text-muted">01 / op locatie</span>
          </div>
          <BrandLogo className="w-full my-6" />
          <div className="space-y-4 border-t border-white/10 pt-6">
            {[
              ["01", "Vertel wat je auto nodig heeft"],
              ["02", "We stemmen locatie en planning af"],
              ["03", "Je krijgt een persoonlijke bevestiging"],
            ].map(([number, label]) => (
              <div key={number} className="flex gap-4 items-center text-sm">
                <span className="text-orange font-mono text-xs">{number}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
