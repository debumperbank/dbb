import { createClient } from "@/lib/supabase/server";
import { CartPage } from "@/components/CartPage";
import type { BumprProduct } from "@/lib/types";
export const metadata = {
  title: "Winkelmandje | BUMPR",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const db = await createClient();
  const { data, error } = await db.from("bumpr_products").select("*");
  return (
    <main className="px-5 md:px-8 py-14 md:py-20">
      <div className="max-w-site mx-auto">
        <div className="eyebrow">BUMPR webshop</div>
        <h1 className="text-4xl md:text-5xl mt-4 mb-10">Je winkelmandje.</h1>
        {error ? (
          <p role="alert">
            De productprijzen kunnen niet geladen worden. Probeer het later
            opnieuw.
          </p>
        ) : (
          <CartPage products={(data || []) as unknown as BumprProduct[]} />
        )}
      </div>
    </main>
  );
}
