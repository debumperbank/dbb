import Link from "next/link";

function BenefitIcon({ type }: { type: "check" | "star" | "clock" }) {
  if (type === "check") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }
  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="hero-shell relative isolate overflow-hidden border-b border-white/10">
      <div className="hero-grid absolute inset-0 -z-30" />
      <div className="absolute inset-y-0 right-0 -z-20 hidden w-[58%] lg:block">
        <img
          src="/hero-garage.jpg"
          alt="De Bumperbank mobiele autoservice"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0e] via-[#0b0c0e]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e]/85 via-transparent to-[#0b0c0e]/15" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_30%,rgba(245,208,40,0.08),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1480px] px-5 md:px-8 py-16 md:py-20 lg:min-h-[675px] lg:py-24">
        <div className="max-w-[730px] pt-3 lg:pt-8">
          <div className="eyebrow">
            <span className="dot" />
            Mobiele autoservice <span className="text-paper/25">/</span> Regio Hulst
          </div>

          <h1 className="hero-title mt-6 max-w-[12ch] text-[clamp(3rem,6vw,6rem)] font-bold uppercase leading-[0.92] tracking-[-0.055em]">
            De garage die <span className="text-orange">naar je toe komt.</span>
          </h1>

          <p className="mt-7 max-w-[620px] text-base leading-relaxed text-paper/70 md:text-lg">
            Onderhoud, reparatie en detailing op locatie. Persoonlijk geregeld,
            met aandacht voor jouw auto. Ook voor occasions en de verkoop van je auto.
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
            <Link href="/afspraak" className="btn btn-primary justify-center !px-7 !py-4">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4M16 3v4M4 10h16" />
              </svg>
              Afspraak aanvragen →
            </Link>
            <Link href="#diensten" className="btn btn-ghost justify-center !px-7 !py-4 bg-black/20">
              Ontdek onze diensten
            </Link>
          </div>

          <div className="mt-10 grid max-w-[710px] gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            {[
              ["check", "Op locatie", "Wij komen naar jou toe"],
              ["star", "Persoonlijke service", "Eerlijk en betrouwbaar"],
              ["clock", "Flexibel & snel", "Afspraak wanneer het jou past"],
            ].map(([type, title, text]) => (
              <div key={title} className="flex items-start gap-3">
                <div className="mt-0.5 text-orange">
                  <BenefitIcon type={type as "check" | "star" | "clock"} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-paper">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
