import Image from "next/image";
import Link from "next/link";

function BenefitIcon({ type }: { type: "check" | "star" | "clock" }) {
  if (type === "check") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

const benefits = [
  { icon: "check" as const, title: "Op locatie", text: "Wij komen naar jou toe" },
  { icon: "star" as const, title: "Persoonlijke service", text: "Eerlijk en duidelijk" },
  { icon: "clock" as const, title: "Flexibel gepland", text: "Afspraak wanneer het past" },
];

export function Hero() {
  return (
    <section className="home-hero relative isolate overflow-hidden border-b border-white/10">
      <div className="hero-grid absolute inset-0 -z-30 opacity-70" />
      <div className="hero-racing-stripes absolute left-0 top-0 -z-20 h-full w-48 opacity-80" />

      <div className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[59%]">
        <Image
          src="/hero-garage.jpg"
          alt="De Bumperbank mobiele autoservice met servicewagen"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 59vw"
          className="object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08090b_0%,rgba(8,9,11,.97)_14%,rgba(8,9,11,.72)_36%,rgba(8,9,11,.18)_72%,rgba(8,9,11,.12)_100%)] lg:bg-[linear-gradient(90deg,#08090b_0%,rgba(8,9,11,.93)_3%,rgba(8,9,11,.52)_28%,rgba(8,9,11,.05)_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/90 via-transparent to-[#08090b]/25" />
      </div>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_28%_28%,rgba(245,208,40,.12),transparent_31%)]" />
      <div className="absolute right-[5%] top-10 hidden h-px w-44 bg-gradient-to-r from-transparent via-orange/80 to-transparent lg:block" />

      <div className="relative mx-auto flex min-h-[650px] max-w-[1480px] items-center px-5 py-16 md:px-8 md:py-20 lg:min-h-[720px] lg:py-24">
        <div className="max-w-[760px] pb-10 pt-3 lg:pb-20 lg:pt-4">
          <div className="eyebrow mb-6">
            <span className="dot" />
            Mobiele autoservice
            <span className="text-paper/25">/</span>
            Regio Hulst
          </div>

          <h1 className="hero-title max-w-[11.5ch] text-[clamp(3.45rem,6.5vw,6.7rem)] font-bold uppercase leading-[0.88] tracking-[-0.065em]">
            De garage die <span className="text-orange">naar je toe komt.</span>
          </h1>

          <p className="mt-7 max-w-[650px] text-[15px] leading-7 text-paper/70 md:text-[17px] md:leading-8">
            Onderhoud, reparatie en detailing op locatie. Persoonlijk geregeld,
            met aandacht voor jouw auto. Ook voor occasions en de verkoop van je auto.
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
            <Link href="/afspraak" className="btn btn-primary hero-cta justify-center !px-7 !py-4">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4M16 3v4M4 10h16" />
              </svg>
              Afspraak aanvragen
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="#diensten" className="btn btn-ghost justify-center !px-7 !py-4 bg-black/30 backdrop-blur-sm">
              Ontdek onze diensten
            </Link>
          </div>

          <div className="mt-10 grid max-w-[720px] gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3">
                <div className="mt-0.5 text-orange">
                  <BenefitIcon type={benefit.icon} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-paper">{benefit.title}</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden items-end gap-3 xl:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-paper/35">Driven by passion</span>
          <span className="mb-1 h-px w-16 bg-orange/70" />
        </div>
      </div>
    </section>
  );
}
