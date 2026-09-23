import { AddToCart } from "@/components/AddToCart";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BumprProduct } from "@/lib/types";
import { formatPriceCents } from "@/lib/format";
import { productImage, productSize, productDescription } from "@/lib/bumpr";

export const metadata = {
  title: "BUMPR — Premium car care | De Bumperbank",
  description:
    "Ontdek BUMPR Ceramic Coating, Fast Detailer en Polish. Verzorging voor jouw auto, van De Bumperbank.",
};
export const revalidate = 60;

export default async function BumprPage() {
  const db = await createClient();
  const { data, error } = await db
    .from("bumpr_products")
    .select("*")
    .order("sort_order");
  const products = (data || []) as unknown as BumprProduct[];
  return (
    <main>
      <section className="px-6 py-16 md:py-24 border-b border-white/10 bg-bg-soft">
        <div className="max-w-site mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="eyebrow">De Bumperbank presenteert</div>
            <h1 className="text-6xl md:text-8xl tracking-[0.12em] mt-5">
              BUMPR<span className="text-orange">.</span>
            </h1>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-orange mt-4">
              Premium car care
            </p>
            <h2 className="text-3xl md:text-4xl mt-10 max-w-[18ch]">
              Voor de auto waar je zuinig op bent.
            </h2>
            <p className="text-muted leading-relaxed mt-5 max-w-xl">
              Van een snelle opfrisbeurt tot verzorging van je lak. Ontdek onze
              Ceramic Coating, Fast Detailer en Polish, los of samen in de
              Performance Set.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#producten" className="btn btn-primary">
                Ontdek de producten ↓
              </a>
              <Link href="/contact" className="btn btn-ghost">
                Vraag productadvies
              </Link>
            </div>
          </div>
          <a
            href="#ceramic-coating"
            className="block overflow-hidden rounded-xl border border-white/10"
          >
            <Image
              src="/bumpr/ceramic-coating-original.png"
              width={1254}
              height={1254}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="BUMPR Ceramic Coating van 200 ml, met applicatorspons en microvezeldoek"
              className="w-full h-auto"
            />
          </a>
        </div>
      </section>
      <div className="px-6 py-5 text-center text-sm border-b border-white/10 text-muted">Nederland €4,99 · België €6,99 · <strong className="text-orange">Gratis verzending vanaf €50</strong></div>
      <section id="producten" className="px-6 py-16 md:py-24 scroll-mt-40">
        <div className="max-w-site mx-auto">
          <div className="eyebrow">De collectie</div>
          <h2 className="text-4xl mt-4 mb-10">Kies jouw verzorging.</h2>
          {error || !products.length ? (
            <div className="panel">
              <p>
                De productinformatie is momenteel niet beschikbaar. Neem contact
                op voor ons assortiment en de actuele prijzen.
              </p>
              <Link href="/contact" className="btn btn-primary mt-5">
                Neem contact op
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {products.map((product, index) => {
                const photo = productImage(product);
                return (
                  <article
                    key={product.id}
                    id={product.slug}
                    className="scroll-mt-40 grid md:grid-cols-2 overflow-hidden border border-white/10 rounded-xl bg-bg-soft"
                  >
                    {photo ? (
                      <div className="bg-black">
                        <Image
                          src={photo}
                          width={1254}
                          height={1254}
                          unoptimized={!photo.startsWith("/")}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          alt={product.name}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="bg-bg-soft-2 min-h-64 flex flex-col justify-center items-center p-10">
                        <span className="text-orange font-mono text-xs tracking-widest">
                          BUMPR · PREMIUM CAR CARE
                        </span>
                        <p className="font-display text-4xl mt-6 text-center">
                          {product.name.replace("BUMPR ", "")}
                        </p>
                      </div>
                    )}
                    <div className="p-7 md:p-12 flex flex-col justify-center items-start">
                      <div className="eyebrow">
                        {product.is_bundle
                          ? "De complete set"
                          : `0${index + 1} · Car care`}
                      </div>
                      <h3 className="text-3xl md:text-4xl mt-5">
                        {product.name.replace("BUMPR ", "")}
                      </h3>
                      <p className="text-sm text-orange mt-4">
                        {productSize(product)}
                      </p>
                      <p className="text-muted leading-relaxed mt-6">
                        {productDescription(product)}
                      </p>
                      <p className="text-3xl font-display mt-8">
                        {formatPriceCents(product.price_cents)}
                      </p>
                      <AddToCart id={product.id} name={product.name} />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section id="microvezel-droogdoeken" className="px-6 pb-16 md:pb-24 scroll-mt-40">
        <article className="max-w-site mx-auto grid md:grid-cols-2 overflow-hidden border border-white/10 rounded-xl bg-bg-soft">
          <Image src="/bumpr/microvezel-droogdoeken.png" width={1312} height={1200}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="BUMPR microvezel droogdoeken: drie zwarte doeken met BUMPR-logo en verpakking"
            className="w-full h-auto object-contain self-center" />
          <div className="p-7 md:p-12 flex flex-col justify-center items-start">
            <div className="eyebrow">De finishing touch</div>
            <h2 className="text-3xl md:text-4xl mt-5">Microvezel droogdoeken</h2>
            <p className="text-sm text-orange mt-4">Set van 3 · 40 × 40 cm · 400 GSM</p>
            <p className="text-muted leading-relaxed mt-6">Zwarte microvezeldoeken met het BUMPR-logo, voor het drogen en verzorgen van je auto. Een bijpassende aanvulling op je car-carecollectie.</p>
            <Link href="/contact" className="btn btn-primary mt-8">Vraag prijs en beschikbaarheid →</Link>
          </div>
        </article>
      </section>
      <section className="px-6 pb-20">
        <div className="max-w-site mx-auto panel flex flex-wrap justify-between items-center gap-8">
          <div>
            <div className="eyebrow">Liever laten doen?</div>
            <h2 className="text-3xl mt-3">Geef je auto onze aandacht.</h2>
            <p className="text-muted mt-4">
              Bespreek een detailingbehandeling in regio Hulst.
            </p>
          </div>
          <Link href="/afspraak" className="btn btn-primary">
            Detailing aanvragen →
          </Link>
        </div>
      </section>
    </main>
  );
}
