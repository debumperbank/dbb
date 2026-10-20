import Image from "next/image";
import Link from "next/link";
import { EXAMPLE_MODE } from "@/lib/public-offering";
export function Hero() {
  return <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#08090a]">
    <Image src="/detailing-hero.png" alt="Glanzende donkere sportwagen als sfeerbeeld voor autoverzorging" fill priority sizes="100vw" className="-z-20 object-cover object-[62%_center] md:object-center" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/75 to-black/15 md:via-black/35 md:to-transparent" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#08090a] to-transparent" />
    <div className="mx-auto min-h-[650px] max-w-site px-5 pb-20 pt-16 md:px-8 md:py-24 lg:min-h-[740px] lg:py-28">
      <div className="eyebrow">{EXAMPLE_MODE ? "De Bumperbank · In opbouw" : "De Bumperbank · Detailing & webshop"}</div>
      <h1 className="mt-7 max-w-[10ch] text-[clamp(3.6rem,6.8vw,6.7rem)] font-bold uppercase leading-[0.94] tracking-[-0.05em]">Aandacht voor<br /><span className="text-orange">elk detail.</span></h1>
      <p className="mt-7 max-w-[44ch] text-base leading-7 text-paper/80 md:text-lg md:leading-8">{EXAMPLE_MODE ? "Een kijkje in onze plannen en onze passie voor auto’s. Deze website is voorlopig een presentatie van De Bumperbank." : "Persoonlijke detailing voor jouw auto. Zorgvuldig gekozen producten voor thuis. Samen houden we jouw auto op zijn mooist."}</p>
      <div className="mt-9 flex flex-wrap gap-3"><Link href="/detailing" className="btn btn-primary">Ontdek detailing →</Link>{EXAMPLE_MODE ? <Link href="/over-ons" className="btn btn-ghost bg-black/35">Ons verhaal →</Link> : <Link href="/webshop" className="btn btn-ghost bg-black/35">Bekijk de webshop →</Link>}</div>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-paper/65">{EXAMPLE_MODE ? "In opbouw · nog geen verkoop of afspraken" : "Detailing op afspraak · locatie in overleg"}</p>
    </div>
  </section>;
}
