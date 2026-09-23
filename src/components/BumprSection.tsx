import Image from "next/image";
import Link from "next/link";
import type { BumprProduct } from "@/lib/types";

export function BumprSection({
  products: _products,
}: {
  products: BumprProduct[];
}) {
  return (
    <section id="bumpr" className="px-6 py-20 border-y border-white/10 bg-bg">
      <div className="max-w-site mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="eyebrow">Ons eigen verzorgingsmerk</div>
          <h2 className="text-5xl md:text-6xl mt-5 tracking-wider">
            BUMPR<span className="text-orange">.</span>
          </h2>
          <p className="font-mono text-xs tracking-widest uppercase text-orange mt-4">
            Premium car care
          </p>
          <p className="text-lg text-muted leading-relaxed mt-7 max-w-lg">
            Ceramic Coating, Fast Detailer en Polish. Ontdek de producten, de
            verzorgingslijn en de complete Performance Set op onze BUMPR-pagina.
          </p>
          <Link href="/bumpr" className="btn btn-primary mt-8">
            Ontdek BUMPR →
          </Link>
        </div>
        <Link
          href="/bumpr"
          className="rounded-xl overflow-hidden border border-white/10"
        >
          <Image
            src="/bumpr/ceramic-coating-original.png"
            alt="BUMPR Ceramic Coating met spons en microvezeldoek"
            width={1254}
            height={1254}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto"
          />
        </Link>
      </div>
    </section>
  );
}
