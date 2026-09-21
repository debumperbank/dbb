import Image from "next/image";
import Link from "next/link";
export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 90% 20%, #ff5a1f25, transparent 65%)",
        }}
      />
      <div className="relative max-w-site mx-auto grid md:grid-cols-[1.3fr_0.7fr] items-center gap-12">
        <div>
          <div className="eyebrow">Mobiele autoservice · Regio Hulst</div>
          <h1 className="mt-6 text-5xl md:text-7xl max-w-[15ch]">
            De garage die <span className="text-orange">naar je toe komt.</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed mt-7 max-w-xl">
            Onderhoud, reparatie en detailing op locatie in regio Hulst. Ook
            voor geselecteerde occasions en de verkoop van je auto ben je bij De
            Bumperbank aan het juiste adres.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/afspraak" className="btn btn-primary">
              Afspraak aanvragen →
            </Link>
            <Link href="#diensten" className="btn btn-ghost">
              Onze diensten
            </Link>
          </div>
          <p className="mt-7 text-sm text-muted">
            Jij vertelt wat er nodig is. Wij bespreken de mogelijkheden en
            bevestigen je afspraak persoonlijk.
          </p>
        </div>
        <div className="border border-white/10 bg-bg-soft rounded-xl p-8 text-center">
          <Image
            src="/logo.png"
            alt="De Bumperbank"
            width={320}
            height={320}
            priority
            className="mx-auto object-contain"
          />
          <p className="eyebrow justify-center mt-6">Jouw auto. Onze zorg.</p>
        </div>
      </div>
    </section>
  );
}
