import Image from "next/image";
import Link from "next/link";
export const metadata = {
  title: "BUMPR — ons eigen autoverzorgingsmerk | De Bumperbank",
  description: "Maak kennis met BUMPR, het autoverzorgingsmerk van De Bumperbank. Onze collectie is in ontwikkeling; verkoop start zodra de producten beschikbaar zijn.",
  alternates: { canonical: "/bumpr" },
};
export default function BumprPage() {
  return <main>
    <section className="px-5 py-16 md:px-8 md:py-24 bg-bg-soft border-b border-white/10">
      <div className="max-w-site mx-auto grid gap-10 lg:grid-cols-2 items-center">
        <div><div className="eyebrow">Het eigen merk van De Bumperbank</div>
          <h1 className="mt-5 text-6xl md:text-8xl tracking-[0.08em]">BUMPR<span className="text-orange">.</span></h1>
          <p className="mt-4 font-mono text-sm tracking-widest text-orange">PREMIUM CAR CARE</p>
          <h2 className="mt-8 text-3xl md:text-4xl">Voor de auto waar je zuinig op bent.</h2>
          <p className="mt-5 text-muted leading-relaxed">BUMPR is ons eigen merk voor autoverzorging. Vanuit De Bumperbank werken we aan een collectie voor wassen, verzorgen en beschermen, met aandacht voor praktisch gebruik.</p>
          <p className="mt-4 text-muted leading-relaxed">Onze microvezeldoeken zijn voorbereid voor productie met eigen logo. Na de definitieve goedkeuring en daadwerkelijke bestelling verwachten we ongeveer een maand tot levering; dit blijft een inschatting die we met de producent bevestigen. Voor onze verzorgingsmiddelen vergelijken we formules en productiepartners. Het definitieve assortiment volgt zodra de producten verkoopklaar zijn.</p>
          <Link href="/contact" className="btn btn-primary mt-7">Vragen over BUMPR? →</Link>
        </div>
        <figure><Image src="/bumpr/collection-2026/collectie.png" width={1672} height={941} priority sizes="(max-width: 1023px) 100vw, 50vw" alt="Conceptbeeld van de BUMPR-autoverzorgingslijn" className="w-full h-auto rounded-xl border border-white/10"/><figcaption className="mt-3 text-xs text-muted">Conceptvisualisatie: verpakking, samenstelling en assortiment kunnen nog wijzigen. Nog niet verkrijgbaar.</figcaption></figure>
      </div>
    </section>
    <section className="max-w-site mx-auto px-5 py-16 md:px-8">
      <div className="eyebrow">Ons merk, onze aandacht</div><h2 className="mt-4 text-3xl md:text-4xl">Van eerste idee naar een collectie die klopt.</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{[
        ["Microvezel", "We bereiden doeken voor met de herkenbare oranje BUMPR-accenten. Specificaties en beschikbaarheid worden bij de introductie bevestigd."],
        ["Verzorgingsmiddelen", "We zoeken passende bestaande formules die door een productiepartner onder het BUMPR-merk kunnen worden geleverd."],
        ["De Bumperbank webshop", "BUMPR krijgt een eigen plek naast toekomstige aanvullende merken. De winkel opent zodra er daadwerkelijk producten klaarstaan voor verkoop."],
      ].map(([title, text]) => <article className="panel" key={title}><h3 className="text-xl">{title}</h3><p className="mt-4 text-muted leading-relaxed">{text}</p></article>)}</div>
      <Link href="/webshop" className="btn btn-ghost mt-8">Webshop in voorbereiding →</Link>
    </section>
  </main>;
}
