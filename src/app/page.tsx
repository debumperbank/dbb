import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { StripBar, ServiceGrid } from "@/components/ServiceSections";
import { StockGrid } from "@/components/StockGrid";
import { BumprSection } from "@/components/BumprSection";
import { OldtimerTeaser } from "@/components/OldtimerAndGuestbook";
import type { BumprProduct, ListingWithCar } from "@/lib/types";

export const revalidate = 60;

async function getFeaturedListings(): Promise<ListingWithCar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*, cars(*)")
    .eq("status", "active")
    .eq("department", "verkoop")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to load listings:", error.message);
    return [];
  }
  return (data ?? []) as unknown as ListingWithCar[];
}

async function getBumprProducts(): Promise<BumprProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bumpr_products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load BUMPR products:", error.message);
    return [];
  }
  return (data ?? []) as BumprProduct[];
}

export default async function HomePage() {
  const [listings, bumprProducts] = await Promise.all([
    getFeaturedListings(),
    getBumprProducts(),
  ]);

  return (
    <main className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoRepair",
            name: "De Bumperbank",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://debumperbank.nl",
            areaServed: "Regio Hulst",
            description:
              "Mobiele autoservice, onderhoud, reparatie en detailing in regio Hulst.",
          }).replace(/</g, "\\u003c"),
        }}
      />

      <Hero />
      <ServiceGrid />
      <StripBar />

      <section id="voorraad" className="relative bg-[#111317] px-5 py-20 md:px-8 md:py-24">
        <div className="hero-grid absolute inset-0 opacity-[0.18]" />
        <div className="relative mx-auto max-w-[1480px]">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-7">
            <div>
              <div className="eyebrow"><span className="dot" /> Uitgelicht</div>
              <h2 className="mt-3 text-3xl md:text-5xl">Ontdek onze occasions</h2>
            </div>
            <p className="max-w-[43ch] text-sm leading-relaxed text-muted">
              Bekijk een selectie uit onze actuele voorraad. Persoonlijk geselecteerd en helder aangeboden.
            </p>
          </div>
          <StockGrid listings={listings} />
        </div>
      </section>

      <BumprSection products={bumprProducts} />
      <OldtimerTeaser />
      <OurStory />
    </main>
  );
}
