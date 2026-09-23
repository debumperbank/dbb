import { NextResponse } from "next/server";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateCheckout, quoteOrder, type ShopOrder } from "@/lib/shop";
import {
  mollieMode,
  mollieRequest,
  shopOrigin,
  checkoutUrl,
} from "@/lib/mollie";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 20000)
    return NextResponse.json(
      { error: "De bestelling is te groot." },
      { status: 413 },
    );
  let input: ReturnType<typeof validateCheckout>;
  try {
    input = validateCheckout(await request.json());
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Controleer je bestelling." },
      { status: 400 },
    );
  }
  try {
    const mode = mollieMode(),
      base = shopOrigin(),
      db = createAdminClient();
    const hash = createHash("sha256")
      .update(JSON.stringify(input))
      .digest("hex");
    let { data, error } = await db
      .from("shop_orders")
      .select("*")
      .eq("checkout_key", input.checkout_key)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      const { data: products, error: productError } = await db
        .from("bumpr_products")
        .select("id,name,price_cents,is_available")
        .in(
          "id",
          input.items.map((i) => i.id),
        );
      if (productError) throw productError;
      let quote: ReturnType<typeof quoteOrder>;
      try {
        quote = quoteOrder(
          input.items,
          products as unknown as Parameters<typeof quoteOrder>[1],
          input.customer.country,
        );
      } catch (e) {
        return NextResponse.json(
          {
            error: e instanceof Error ? e.message : "Controleer je producten.",
          },
          { status: 400 },
        );
      }
      if (quote.total_cents !== input.expected_total_cents)
        return NextResponse.json(
          {
            error:
              "De productprijs is gewijzigd. Ververs je mandje en controleer het nieuwe totaal.",
          },
          { status: 409 },
        );
      const row = {
        id: randomUUID(),
        checkout_key: input.checkout_key,
        request_hash: hash,
        view_token: randomBytes(32).toString("hex"),
        customer: input.customer,
        ...quote,
        payment_mode: mode,
      };
      const { error: insertError } = await db.from("shop_orders").insert(row);
      if (insertError && insertError.code !== "23505") throw insertError;
      const loaded = await db
        .from("shop_orders")
        .select("*")
        .eq("checkout_key", input.checkout_key)
        .single();
      if (loaded.error) throw loaded.error;
      data = loaded.data;
    }
    const order = data as unknown as ShopOrder;
    if (order.request_hash !== hash)
      return NextResponse.json(
        {
          error: "De bestelgegevens zijn gewijzigd. Probeer opnieuw.",
          resetAttempt: true,
        },
        { status: 409 },
      );
    const resultUrl = `${base}/bumpr/bestelling/${order.id}?token=${order.view_token}`;
    if (order.status === "paid") return NextResponse.json({ url: resultUrl });
    if (
      ["failed", "expired", "canceled"].includes(order.status) ||
      Date.now() - Date.parse(order.created_at) > 23 * 3600000
    )
      return NextResponse.json(
        {
          error: "Deze betaalpoging is verlopen of gestopt. Probeer opnieuw.",
          resetAttempt: true,
        },
        { status: 409 },
      );
    if (order.payment_mode !== mode)
      throw new Error("Betaalomgeving is gewijzigd.");
    if (order.payment_id) {
      const payment = await mollieRequest(`/${order.payment_id}`);
      if (["paid", "authorized", "pending"].includes(payment.status))
        return NextResponse.json({ url: resultUrl });
      if (["failed", "expired", "canceled"].includes(payment.status))
        return NextResponse.json(
          {
            error: "Betaling niet afgerond. Probeer opnieuw.",
            resetAttempt: true,
          },
          { status: 409 },
        );
      return NextResponse.json({ url: checkoutUrl(payment) });
    }
    const payment = await mollieRequest(
      "",
      {
        amount: {
          currency: "EUR",
          value: (order.total_cents / 100).toFixed(2),
        },
        description: `BUMPR ${order.id}`,
        redirectUrl: resultUrl,
        cancelUrl: resultUrl,
        webhookUrl: `${base}/api/shop/webhook`,
        metadata: { order_id: order.id },
        locale: order.customer.country === "BE" ? "nl_BE" : "nl_NL",
        shippingAddress: {
          givenName: order.customer.name,
          streetAndNumber: order.customer.street,
          postalCode: order.customer.postal_code,
          city: order.customer.city,
          country: order.customer.country,
          email: order.customer.email,
        },
      },
      order.id,
    );
    const url = checkoutUrl(payment);
    const { error: saveError } = await db
      .from("shop_orders")
      .update({ payment_id: payment.id, checkout_url: url })
      .eq("id", order.id);
    if (saveError) throw saveError;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      {
        error:
          "Afrekenen is tijdelijk niet beschikbaar. Je mandje blijft bewaard. Probeer het opnieuw of neem contact op.",
      },
      { status: 503 },
    );
  }
}
