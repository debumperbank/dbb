import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { synchronizePayment } from "@/lib/shop-payments";
import type { ShopOrder } from "@/lib/shop";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("token");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !token || !/^[0-9a-f]{64}$/.test(token))
    return NextResponse.json(
      { error: "Bestelling niet gevonden." },
      { status: 404 },
    );
  const db = createAdminClient();
  const { data, error } = await db
    .from("shop_orders")
    .select("*")
    .eq("id", id)
    .eq("view_token", token)
    .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "Status tijdelijk niet beschikbaar." },
      { status: 503 },
    );
  if (!data)
    return NextResponse.json(
      { error: "Bestelling niet gevonden." },
      { status: 404 },
    );
  let order = data as unknown as ShopOrder;
  if (order.payment_id && order.status !== "paid") {
    try {
      await synchronizePayment(order.payment_id);
    } catch {
      /* Webhook retries payment/mail failures; never report a guessed success. */
    }
    const fresh = await db
      .from("shop_orders")
      .select("*")
      .eq("id", id)
      .eq("view_token", token)
      .single();
    if (!fresh.error) order = fresh.data as unknown as ShopOrder;
  }
  return NextResponse.json(
    {
      id: order.id,
      status: order.status,
      items: order.items.map((i) => ({ id: i.id, quantity: i.quantity })),
      total_cents: order.total_cents,
      test: order.payment_mode === "test",
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}
