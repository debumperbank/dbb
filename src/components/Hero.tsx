import Image from "next/image";
import Link from "next/link";
import { EXAMPLE_MODE } from "@/lib/public-offering";
export function Hero() {
  return <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#08090a]">
    <Image src="/detailing-hero.png" alt="Glanzende donkere sportwagen als sfeerbeeld voor autoverzorging" fill priority fetchPriority="high" sizes="100vw" quality={65} className="-z-20 object-cover object-[62%_center] md:object-center" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/82 to-black/55 md:via-black/35 md:to-transparent" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#08090a] to-transparent" />
    <div className="mx-auto max-w-site px-5 pb-12 pt-10 md:min-h-[650px] md:px-8 md:py-24 lg:min-h-[740px] lg:py-28">
      <div className="eyebrow">{EXAMPLE_MODE ? "De Bumperbank · In opbouw" : "De Bumperbank · Detailing & webshop"}</div>
      <h1 className="mt-5 max-w-[10ch] text-[clamp(2.55rem,13.5vw,3.35rem)] font-bold uppercase leading-[0.94] tracking-[-0.05em] md:mt-7 md:text-[clamp(3.6rem,6.8vw,6.7rem)]">Aandacht voor<br /><span className="text-orange">elk detail.</span></h1>
      <p className="mt-5 max-w-[44ch] text-base leading-7 text-paper/90 md:mt-7 md:text-lg md:leading-8 md:text-paper/80">{EXAMPLE_MODE ? "Een kijkje in onze plannen en onze passie voor auto’s. Deze website is voorlopig een presentatie van De Bumperbank." : "Persoonlijke detailing voor jouw auto. Zorgvuldig gekozen producten voor thuis. Samen houden we jouw auto op zijn mooist."}</p>
      <div className="mt-7 flex flex-wrap gap-3 md:mt-9"><Link href="/detailing" className="btn btn-primary">Ontdek detailing →</Link>{EXAMPLE_MODE ? <Link href="/over-ons" className="btn btn-ghost bg-[#08090a]/85">Ons verhaal →</Link> : <Link href="/webshop" className="btn btn-ghost bg-[#08090a]/85">Bekijk de webshop →</Link>}</div>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-paper/90 md:mt-8 md:tracking-[0.16em] md:text-paper/65">{EXAMPLE_MODE ? "In opbouw · nog geen verkoop of afspraken" : "Detailing op afspraak · locatie in overleg"}</p>
    </div>
  </section>;
}
