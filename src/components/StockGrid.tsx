import Link from "next/link";
import type { ListingWithCar } from "@/lib/types";
import { formatPriceCents, formatMileage } from "@/lib/format";

function CarGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f5d028"
      strokeWidth={1.6}
      className="w-7"
    >
      <path d="M2 16h20M4 16l1-5h14l1 5M8 11V8h8v3" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  );
}

export function CarCard({ listing }: { listing: ListingWithCar }) {
  const { cars: car } = listing;
  return (
    <Link
      href={`/occasions/${listing.slug ?? listing.id}`}
      className="group block bg-[#0c0e10] border border-white/10 hover:border-orange/60 transition-all duration-300 rounded-xl p-6 relative overflow-hidden hover:-translate-y-1 shadow-[0_18px_55px_rgba(0,0,0,.18)]"
    >
      <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.12em] text-orange border border-orange/40 bg-orange/[0.04] px-2.5 py-1 rounded-full">
        {car.build_year}
      </div>
      <div className="w-14 h-14 rounded-lg border border-orange/20 bg-orange/[0.06] flex items-center justify-center mb-6">
        <CarGlyph />
      </div>
      <h3 className="text-xl font-semibold font-display group-hover:text-orange transition-colors">
        {car.make} {car.model}
      </h3>
      <p className="text-[12.5px] text-muted mt-1.5 font-mono uppercase">
        {formatMileage(car.mileage_km)} &middot; {car.fuel_type ?? "—"}
      </p>
      <div className="mt-3.5 font-display text-lg text-orange">
        {formatPriceCents(listing.price_cents)}
      </div>
    </Link>
  );
}

export function StockGrid({ listings }: { listings: ListingWithCar[] }) {
  if (listings.length === 0) {
    return (
      <p className="text-muted text-sm font-mono mt-9">
        Er staat momenteel niets in de voorraad. Kom snel terug.
      </p>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-9">
      {listings.map((listing) => (
        <CarCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
