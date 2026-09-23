import Image from "next/image";
import Link from "next/link";
import type { BumprProduct } from "@/lib/types";

export function BumprSection({
  products: _products,
}: {
  products: BumprProduct[];
}) {
  return (
    <section id="bumpr" className="relative overflow-hidden border-y border-white/10 bg-[#090a0c] px-5 py-20 md:px-8 md:py-24">
      <div className="hero-grid absolute inset-0 opacity-[0.12]" />
      <div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-orange/[0.06] blur-3xl" />

      <div className="relative mx-auto grid max-w-[1480px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-[620px]">
          <div className="eyebrow"><span className="dot" /> Ons eigen verzorgingsmerk</div>
          <h2 className="mt-5 text-5xl tracking-[-0.05em] md:text-7xl">
            BUMPR<span className="text-orange">.</span>
          </h2>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.27em] text-orange">
            Premium car care / developed for real use
          </p>
          <p className="mt-7 max-w-[53ch] text-[15px] leading-7 text-muted md:text-base">
            Ceramic Coating, Fast Detailer en Polish. Ontdek onze complete lijn voor bescherming,
            glans en onderhoud — ontwikkeld als verlengstuk van De Bumperbank.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/bumpr" className="btn btn-primary">Ontdek BUMPR →</Link>
            <Link href="/bumpr" className="btn btn-ghost">Bekijk producten</Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper/45">
            <span>Coating</span>
            <span>Detailing</span>
            <span>Polish</span>
            <span>Microvezel</span>
          </div>
        </div>

        <Link
          href="/bumpr"
          className="group relative overflow-hidden rounded-xl border border-orange/20 bg-[#101216] p-3 shadow-[0_28px_80px_rgba(0,0,0,.35)]"
        >
          <div className="absolute left-5 top-5 z-10 rounded-full border border-orange/40 bg-black/55 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-orange backdrop-blur-sm">
            BUMPR performance line
          </div>
          <Image
            src="/bumpr/ceramic-coating-original.png"
            alt="BUMPR Ceramic Coating met spons en microvezeldoek"
            width={1254}
            height={1254}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[16/10] w-full rounded-lg object-cover transition duration-500 group-hover:scale-[1.015]"
          />
          <div className="pointer-events-none absolute inset-x-3 bottom-3 h-1/3 rounded-b-lg bg-gradient-to-t from-black/65 to-transparent" />
        </Link>
      </div>
    </section>
  );
}
