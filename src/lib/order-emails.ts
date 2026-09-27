import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/resend";
import { shopOrigin } from "@/lib/mollie";
import { orderEmail, type OrderEmailKind } from "./order-email-template";
import type { ShopOrder } from "./shop";

// Durable claim before sending: ambiguous attempts require review, never a blind resend.
export async function sendOrderEmail(orderId: string, kind: OrderEmailKind) {
  if (process.env.CUSTOMER_EMAILS_ENABLED !== "true") return;
  const db = createAdminClient();
  const { data, error } = await db.from("shop_orders").select("*").eq("id", orderId).single();
  if (error || !data) throw new Error("customer_mail_order_unavailable");
  const order = data as unknown as ShopOrder;
  if (order.payment_mode !== "live" || order.status !== "paid") return;
  if (kind === "shipped" && order.fulfillment_status !== "shipped") return;
  const resend = getResendClient();
  const from = process.env.NOTIFY_FROM_EMAIL;
  const information = process.env.SHOP_CUSTOMER_INFORMATION;
  // Explicit production sender and approved purchase information are required.
  if (!resend || !from || !information?.trim()) throw new Error("customer_mail_configuration_required");
  const payload = orderEmail(order, kind, shopOrigin(), information);
  const { error: queueError } = await db.from("shop_order_emails").upsert({ order_id: orderId, kind }, { onConflict: "order_id,kind", ignoreDuplicates: true });
  if (queueError) throw new Error("customer_mail_migration_required");
  const { data: claim, error: claimError } = await db.from("shop_order_emails")
    .update({ state: "processing", attempted_at: new Date().toISOString() })
    .eq("order_id", orderId).eq("kind", kind).eq("state", "pending").select("order_id").maybeSingle();
  if (claimError) throw new Error("customer_mail_claim_failed");
  if (!claim) {
    const { data: existing } = await db.from("shop_order_emails").select("state").eq("order_id", orderId).eq("kind", kind).single();
    if (existing?.state === "sent") return;
    throw new Error("customer_mail_review_required");
  }
  let emailId: string;
  try {
    const result = await resend.emails.send({ from, to: order.customer.email, replyTo: "info@debumperbank.nl", ...payload }, { idempotencyKey: `bumpr-${kind}/${orderId}` });
    if (result.error || !result.data?.id) throw new Error("provider_result_uncertain");
    emailId = result.data.id;
  } catch {
    await db.from("shop_order_emails").update({ state: "review_required" }).eq("order_id", orderId).eq("kind", kind).eq("state", "processing");
    throw new Error("customer_mail_review_required");
  }
  const { error: saveError } = await db.from("shop_order_emails")
    .update({ state: "sent", provider_id: emailId, sent_at: new Date().toISOString() })
    .eq("order_id", orderId).eq("kind", kind).eq("state", "processing");
  if (saveError) throw new Error("customer_mail_status_uncertain");
}
