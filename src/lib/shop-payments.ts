import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  mollieRequest,
  type MolliePayment,
  mollieMode,
  shopOrigin,
} from "@/lib/mollie";
import { notifyAdmin } from "@/lib/resend";
import type { ShopOrder } from "./shop";
export function paymentMatches(payment: MolliePayment, order: ShopOrder) {
  return (
    payment.metadata?.order_id === order.id &&
    payment.amount.currency === "EUR" &&
    payment.amount.value === (order.total_cents / 100).toFixed(2) &&
    payment.mode === order.payment_mode &&
    (!order.payment_id || order.payment_id === payment.id)
  );
}
export async function synchronizePayment(paymentId: string) {
  if (!/^tr_[A-Za-z0-9]+$/.test(paymentId))
    throw new Error("Ongeldige betaalreferentie.");
  const payment = await mollieRequest(`/${encodeURIComponent(paymentId)}`);
  const orderId = payment.metadata?.order_id;
  if (!orderId) return;
  const db = createAdminClient();
  const { data, error } = await db
    .from("shop_orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw new Error("Bestelling kon niet geladen worden.");
  if (!data) return;
  const order = data as unknown as ShopOrder;
  if (!paymentMatches(payment, order) || payment.mode !== mollieMode())
    throw new Error("Betaling komt niet overeen met bestelling.");
  const status =
    payment.status === "pending" ? "pending_payment" : payment.status;
  if (
    ![
      "open",
      "pending_payment",
      "authorized",
      "paid",
      "failed",
      "canceled",
      "expired",
    ].includes(status)
  )
    return;
  // A late or duplicate callback must never turn an already paid order into unpaid.
  const { error: updateError } = await db
    .from("shop_orders")
    .update({
      status,
      payment_id: payment.id,
      ...(status === "paid"
        ? { paid_at: payment.paidAt || new Date().toISOString() }
        : {}),
    })
    .eq("id", order.id)
    .neq("status", "paid");
  if (updateError) throw new Error("Betaalstatus opslaan is mislukt.");
  if (status === "paid" && !order.notified_at) {
    const c = order.customer;
    const text = [
      `Betaalde BUMPR-bestelling ${order.id}`,
      payment.mode === "test"
        ? "TESTBETALING — NIET VERZENDEN"
        : "Klaar om te verwerken",
      "",
      ...order.items.map(
        (i) =>
          `${i.quantity} × ${i.name} — € ${((i.quantity * i.unit_price_cents) / 100).toFixed(2)}`,
      ),
      `Verzending: € ${(order.shipping_cents / 100).toFixed(2)}`,
      `Totaal betaald: € ${(order.total_cents / 100).toFixed(2)}`,
      "",
      c.name,
      c.email,
      c.phone,
      c.street,
      `${c.postal_code} ${c.city}`,
      c.country,
      "",
      `${shopOrigin()}/admin/orders`,
    ].join("\n");
    const sent = await notifyAdmin(
      `${payment.mode === "test" ? "[TEST] " : ""}Betaalde BUMPR-bestelling · ${order.id.slice(0, 8)}`,
      text,
      { replyTo: c.email, idempotencyKey: `bumpr-paid/${order.id}` },
    );
    if (!sent)
      throw new Error("Bestelling betaald, beheermelding nog niet verstuurd.");
    const { error: notifyError } = await db
      .from("shop_orders")
      .update({ notified_at: new Date().toISOString() })
      .eq("id", order.id);
    if (notifyError) throw new Error("Meldingsstatus opslaan mislukt.");
  }
}
