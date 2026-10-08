import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ShopOrder } from "./shop";
import { MONEYBIRD_ADMINISTRATION, MoneybirdError, moneybirdConfig, moneybirdRequest, invoicePayload, invoiceEmailMessage, invoiceReference, verifyInvoice, hasMolliePayment, molliePaymentPayload, type MoneybirdInvoice } from "./moneybird";

type Export = { order_id: string; administration_id: string; state: string; contact_attempted: boolean; invoice_attempted: boolean; send_attempted: boolean; payment_attempted: boolean; invoice_id: string | null };
export async function syncMoneybirdOrder(orderId: string) {
  if (process.env.MONEYBIRD_ENABLED !== "true") return;
  const db = createAdminClient();
  const { data, error } = await db.from("shop_orders").select("*").eq("id", orderId).single();
  if (error || !data) throw new MoneybirdError("order_unavailable");
  const order = data as unknown as ShopOrder;
  if (order.status !== "paid" || order.payment_mode !== "live") return;
  if (!order.payment_id) throw new MoneybirdError("payment_missing");
  const { error: queueError } = await db.from("moneybird_exports").upsert({ order_id: order.id, administration_id: MONEYBIRD_ADMINISTRATION }, { onConflict: "order_id", ignoreDuplicates: true });
  if (queueError) throw new MoneybirdError("migration_required");
  const { data: claimed, error: claimError } = await db.from("moneybird_exports")
    .update({ state: "processing", updated_at: new Date().toISOString(), error_code: null })
    .eq("order_id", order.id).in("state", ["pending", "error"]).select("*").maybeSingle();
  if (claimError) throw new MoneybirdError("claim_failed");
  if (!claimed) {
    const { data: current } = await db.from("moneybird_exports").select("state").eq("order_id", order.id).single();
    if (current?.state === "done") return;
    throw new MoneybirdError("export_in_progress");
  }
  const job = claimed as unknown as Export;
  async function save(values: Record<string, unknown>) {
    const { error } = await db.from("moneybird_exports").update({ ...values, updated_at: new Date().toISOString() }).eq("order_id", order.id).eq("state", "processing");
    if (error) throw new MoneybirdError("save_failed");
  }
  try {
    if (job.administration_id !== MONEYBIRD_ADMINISTRATION) throw new MoneybirdError("administration_mismatch");
    const config = moneybirdConfig(order.customer.country);
    const paymentPayload = molliePaymentPayload(order);
    const ref = invoiceReference(order);
    let invoice = await moneybirdRequest<MoneybirdInvoice>(job.invoice_id ? `sales_invoices/${encodeURIComponent(job.invoice_id)}.json` : `sales_invoices/find_by_reference/${encodeURIComponent(ref)}.json`);
    if (!invoice) {
      // Never repeat a possibly successful remote POST after a timeout/crash.
      if (job.invoice_id || job.invoice_attempted) throw new MoneybirdError("invoice_creation_uncertain");
      const customerId = `bumpr-order-${order.id}`;
      let contact = await moneybirdRequest<{id: string}>(`contacts/customer_id/${customerId}.json`);
      if (!contact) {
        if (job.contact_attempted) throw new MoneybirdError("contact_creation_uncertain");
        await save({ contact_attempted: true });
        contact = await moneybirdRequest<{id: string}>("contacts.json", "POST", { contact: {
          customer_id: customerId, firstname: "", lastname: order.customer.name,
          address1: order.customer.street, zipcode: order.customer.postal_code,
          city: order.customer.city, country: order.customer.country,
          email: order.customer.email, send_invoices_to_email: order.customer.email,
          delivery_method: "Email",
        } });
      }
      if (!contact?.id || !/^\d+$/.test(contact.id)) throw new MoneybirdError("contact_invalid");
      await save({ invoice_attempted: true });
      invoice = await moneybirdRequest<MoneybirdInvoice>("sales_invoices.json", "POST", invoicePayload(order, contact.id, config));
    }
    if (!invoice) throw new MoneybirdError("invoice_creation_uncertain");
    verifyInvoice(invoice, order);
    await save({ invoice_id: invoice.id });
    if (!invoice.sent_at) {
      if (job.send_attempted) throw new MoneybirdError("invoice_sending_uncertain");
      if (invoice.state !== "draft") throw new MoneybirdError("invoice_state_requires_review");
      await save({ send_attempted: true });
      await moneybirdRequest(`sales_invoices/${invoice.id}/send_invoice.json`, "PATCH", { sales_invoice_sending: {
        delivery_method: "Email", email_address: order.customer.email,
        email_message: invoiceEmailMessage(order),
      } });
      const sent = await moneybirdRequest<MoneybirdInvoice>(`sales_invoices/${invoice.id}.json`);
      if (!sent?.sent_at) throw new MoneybirdError("invoice_sending_uncertain");
      verifyInvoice(sent, order);
      invoice = sent;
    }
    if (!hasMolliePayment(invoice, order)) {
      if (job.payment_attempted) throw new MoneybirdError("payment_creation_uncertain");
      await save({ payment_attempted: true });
      await moneybirdRequest(`sales_invoices/${invoice.id}/payments.json`, "POST", paymentPayload);
      const paid = await moneybirdRequest<MoneybirdInvoice>(`sales_invoices/${invoice.id}.json`);
      if (!paid) throw new MoneybirdError("payment_creation_uncertain");
      verifyInvoice(paid, order);
      if (!hasMolliePayment(paid, order)) throw new MoneybirdError("payment_creation_uncertain");
    }
    await save({ state: "done", error_code: null });
  } catch (error) {
    const code = error instanceof MoneybirdError ? error.code : "unexpected_error";
    await save({ state: "error", error_code: code });
    throw new MoneybirdError(code);
  }
}
