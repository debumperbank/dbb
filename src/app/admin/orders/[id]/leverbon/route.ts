import { crmClient } from "@/lib/crm";
import { packingSlip } from "@/lib/packing-slip";
import type { ShopOrder } from "@/lib/shop";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const db = await crmClient();
  const { id } = await context.params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) return new Response("Ongeldige bestelling", { status: 400 });
  const { data, error } = await db.from("shop_orders").select("*").eq("id", id).maybeSingle();
  if (error) return new Response("Bestelling kon niet geladen worden", { status: 503 });
  if (!data) return new Response("Bestelling niet gevonden", { status: 404 });
  return new Response(packingSlip(data as unknown as ShopOrder), { headers: {
    "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer",
  } });
}
