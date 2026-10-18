import Link from "next/link";
import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { StripBar, ServiceGrid } from "@/components/ServiceSections";
export default function HomePage() {
  return <main className="overflow-hidden">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"LocalBusiness",name:"De Bumperbank",url:process.env.NEXT_PUBLIC_SITE_URL || "https://debumperbank.nl",areaServed:"Regio Hulst",description:"Auto detailing op afspraak, locatie in overleg. Webshop en productadvies voor autoverzorging."}).replace(/</g,"\\u003c")}} />
    <Hero /><ServiceGrid /><StripBar />
    <section className="px-5 py-20 md:px-8 md:py-24 border-b border-white/10"><div className="mx-auto max-w-site">
      <div className="eyebrow">Voor de auto waar je zuinig op bent</div>
      <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20"><h2 className="max-w-xl text-4xl md:text-5xl">De juiste verzorging.<br /><span className="text-orange">Ook voor thuis.</span></h2><div><p className="text-muted leading-7">Van shampoo en microvezel tot polijstmiddelen en bescherming. Bekijk de catalogus van DRIFT, GECKO en Cartec, of vraag welk product past bij jouw auto.</p><p className="mt-4 text-sm leading-7 text-muted">DRIFT leveren we voorlopig op bestelling. Uitvoering en beschikbaarheid bevestigen we vooraf. Rechtstreeks online afrekenen wordt nog voorbereid.</p><Link href="/webshop#producten" className="btn btn-primary mt-7">Bekijk de producten →</Link></div></div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">{["DRIFT","GECKO","Cartec"].map(brand=><Link key={brand} href={`/webshop?merk=${brand}#producten`} className="panel group flex items-center justify-between"><span className="text-2xl font-semibold">{brand}</span><span className="text-orange">→</span></Link>)}</div>
      <div className="mt-8 rounded-xl border border-white/10 p-7 md:p-9 flex flex-wrap items-center justify-between gap-6"><div><div className="eyebrow">Ons eigen merk · in ontwikkeling</div><h3 className="mt-3 text-3xl">BUMPR.</h3><p className="mt-3 max-w-2xl text-sm text-muted leading-7">We bouwen aan onze eigen lijn voor autoverzorging. De microvezeldoeken wachten op de definitieve productieopdracht; onze verzorgingsmiddelen ontwikkelen we stap voor stap.</p></div><Link href="/bumpr" className="btn btn-ghost">Ontdek het verhaal →</Link></div>
    </div></section><OurStory />
  </main>;
}
