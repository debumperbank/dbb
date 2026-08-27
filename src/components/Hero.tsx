import Image from 'next/image';
import Link from 'next/link';

const stats = [
  { num: '1 jr', lbl: 'actief sinds 2025' },
  { num: '2+', lbl: 'wagens verkocht' },
  { num: '4.7', lbl: 'gem. beoordeling' },
  { num: '6+', lbl: 'mobiele car wash' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-8 pt-20 pb-16">
      <div
        className="absolute -top-1/5 -right-[10%] w-3/5 h-[140%] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,90,31,0.14), transparent 65%)' }}
      />
      <div className="relative z-10 max-w-site mx-auto grid md:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <div>
          <div className="eyebrow"><span className="dot" />Onafhankelijke garage &amp; atelier — Hulst, sinds 2025</div>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-[54px] max-w-[15ch]">
            Uw auto in <span className="text-orange">vertrouwde</span> handen.
          </h1>
          <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-muted">
            De Bumperbank verkoopt eerlijke tweedehandswagens, herstelt ze in eigen werkplaats en
            houdt ze piekfijn — van mobiele car wash tot onze eigen BUMPR-verzorgingslijn.
          </p>
          <div className="mt-8 flex gap-3.5 flex-wrap">
            <Link href="/voorraad" className="btn btn-primary">Bekijk de voorraad →</Link>
            <Link href="/contact" className="btn btn-ghost">Plan de werkplaats</Link>
          </div>
          <div className="mt-13 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[color:var(--line-dark)] pt-6">
            {stats.map((s) => (
              <div key={s.lbl}>
                <div className="font-display text-[26px] text-orange">{s.num}</div>
                <div className="text-[11.5px] text-muted mt-1">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[10px] p-10 flex flex-col items-center gap-4.5 text-center">
          <Image src="/logo.png" alt="De Bumperbank" width={180} height={180} className="object-contain" />
          <div className="font-mono text-[11.5px] tracking-widest text-muted uppercase">
            Jouw auto, <span className="text-orange">onze zorg</span>
          </div>
        </div>
      </div>
    </section>
  );
}
