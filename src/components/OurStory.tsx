import Image from "next/image";
import Link from "next/link";
import { storyIntro, storySections } from "@/lib/our-story";
export function OurStory({full = false}: {full?: boolean}) {
  return <section className="bg-bg-soft px-5 py-16 md:px-8 md:py-24"><div className="mx-auto max-w-site">
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
      <div><div className="eyebrow">Het gezin achter De Bumperbank</div>
        <h2 className="mt-5 max-w-xl text-4xl md:text-5xl">Een eigen droom.<br /><span className="text-orange">Met ons gezin als thuisbasis.</span></h2>
        {storyIntro.map(paragraph => <p key={paragraph} className="mt-6 text-muted leading-8">{paragraph}</p>)}
        {!full && <Link href="/over-ons" className="btn btn-ghost mt-7">Leer ons kennen →</Link>}
      </div>
      <figure className="min-w-0"><Image src="/ons-verhaal-black-hornet.png" width={1448} height={1086} alt="Visualisatie van onze eigen auto naast de zwart-gele Black Hornet die we in de toekomst willen bouwen" sizes="(max-width: 1023px) 100vw, 55vw" className="w-full h-auto rounded-xl border border-white/10" /><figcaption className="mt-4 text-xs text-muted leading-6">Onze eigen auto naast het toekomstbeeld van de Black Hornet. De E36-basis hebben we al; de afgebeelde Black Hornet is een visualisatie van wat we willen bouwen.</figcaption>
        <div className="mt-6 border-l-2 border-orange pl-5"><p className="font-display text-xl">Grote plannen beginnen met iets kleins.</p><p className="mt-2 text-sm text-muted leading-7">Vandaag bouwen we aan detailing, de webshop en BUMPR. De Black Hornet is één van de projecten waar we voor de toekomst van dromen.</p></div>
      </figure>
    </div>
    {full && <div className="mt-12 max-w-3xl">{storySections.map(section => <section key={section.title} className="border-t border-white/10 pt-9 mt-9"><h3 className="text-2xl md:text-3xl">{section.title}</h3>{section.paragraphs.map(paragraph => <p key={paragraph} className="mt-5 text-muted leading-8">{paragraph}</p>)}</section>)}<Link href="/contact" className="btn btn-primary mt-9">Stuur ons een bericht →</Link></div>}
  </div></section>;
}
