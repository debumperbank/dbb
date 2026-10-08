import "server-only";
import type { ShopOrder } from "./shop";

export const MONEYBIRD_ADMINISTRATION = "498995830364046671";
export class MoneybirdError extends Error {
  constructor(public code: string) { super(code); }
}
export function moneybirdConfig(country: string) {
  const env = process.env;
  const tax = env[`MONEYBIRD_TAX_RATE_${country}`];
  const ledger = env.MONEYBIRD_LEDGER_ACCOUNT_ID;
  const workflow = env.MONEYBIRD_WORKFLOW_ID;
  const documentStyle = env.MONEYBIRD_DOCUMENT_STYLE_ID;
  if (!env.MONEYBIRD_API_TOKEN || !tax || !ledger || !workflow || !documentStyle ||
      ![tax, ledger, workflow, documentStyle].every(id => /^\d+$/.test(id)) ||
      env.MONEYBIRD_RECONCILIATION !== "mollie_transaction")
    throw new MoneybirdError("configuration_required");
  return { tax, ledger, workflow, documentStyle };
}
export async function moneybirdRequest<T>(path: string, method = "GET", body?: unknown): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`https://moneybird.com/api/v2/${MONEYBIRD_ADMINISTRATION}/${path}`, {
      method,
      headers: { Authorization: `Bearer ${process.env.MONEYBIRD_API_TOKEN}`, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      redirect: "error",
    });
  } catch { throw new MoneybirdError("connection_uncertain"); }
  if (method === "GET" && response.status === 404) return null;
  if (!response.ok) throw new MoneybirdError(`http_${response.status}`);
  if (response.status === 204) return null;
  try { return await response.json(); } catch { throw new MoneybirdError("response_uncertain"); }
}
export type MoneybirdInvoice = {
  id: string;
  administration_id: string | number;
  reference: string;
  contact_id: string;
  currency: string;
  total_price_incl_tax: string;
  state: string;
  sent_at: string | null;
  payments: { transaction_identifier: string | null; price: string }[];
  total_unpaid: string;
};
export function invoiceReference(order: ShopOrder) { return `BUMPR-${order.id}`; }
export function invoicePayload(order: ShopOrder, contactId: string, config: ReturnType<typeof moneybirdConfig>) {
  return { sales_invoice: {
    contact_id: contactId,
    reference: invoiceReference(order),
    currency: "EUR",
    prices_are_incl_tax: true,
    workflow_id: config.workflow,
    document_style_id: config.documentStyle,
    payment_conditions: `Reeds betaald via Mollie. Betaalreferentie: ${order.payment_id}. Niet opnieuw betalen.`,
    details_attributes: [
      ...order.items.map(i => ({ description: i.name, amount: String(i.quantity), price: (i.unit_price_cents / 100).toFixed(2), tax_rate_id: config.tax, ledger_account_id: config.ledger })),
      ...(order.shipping_cents > 0 ? [{ description: "Verzendkosten", amount: "1", price: (order.shipping_cents / 100).toFixed(2), tax_rate_id: config.tax, ledger_account_id: config.ledger }] : []),
    ],
  } };
}
export function verifyInvoice(invoice: MoneybirdInvoice, order: ShopOrder) {
  if (!/^\d+$/.test(invoice.id) || String(invoice.administration_id) !== MONEYBIRD_ADMINISTRATION ||
      invoice.reference !== invoiceReference(order) || invoice.currency !== "EUR" ||
      Math.round(Number(invoice.total_price_incl_tax) * 100) !== order.total_cents)
    throw new MoneybirdError("invoice_mismatch");
}

export function invoiceEmailMessage(order: ShopOrder) {
  return `Hoi ${order.customer.name},

Bij deze ontvang je de factuur voor je BUMPR-bestelling ${order.id}.

Al betaald via Mollie: € ${(order.total_cents / 100).toFixed(2).replace(".", ",")}. Je hoeft niets meer te betalen.

Bewaar de factuur voor je administratie. Heb je een vraag? Je kunt gewoon op deze mail antwoorden.

Met vriendelijke groet,
De Bumperbank
info@debumperbank.nl`;
}

// A provider transaction is a booking reference, not a second charge to the customer.
export function hasMolliePayment(invoice: MoneybirdInvoice, order: ShopOrder) {
  if (!Array.isArray(invoice.payments)) throw new MoneybirdError("payment_status_unavailable");
  const matching = invoice.payments.filter(p => p.transaction_identifier === order.payment_id);
  if (matching.length === 1 && Math.round(Number(matching[0].price) * 100) === order.total_cents &&
      invoice.payments.length === 1 && invoice.state === "paid" && Number(invoice.total_unpaid) === 0) return true;
  if (invoice.payments.length || invoice.state === "paid" ||
      Math.round(Number(invoice.total_unpaid) * 100) !== order.total_cents)
    throw new MoneybirdError("payment_requires_review");
  return false;
}
export function molliePaymentPayload(order: ShopOrder) {
  if (order.status !== "paid" || order.payment_mode !== "live" || !/^tr_[a-zA-Z0-9]+$/.test(order.payment_id || "") ||
      !order.paid_at || !Number.isFinite(Date.parse(order.paid_at))) throw new MoneybirdError("payment_invalid");
  const parts = new Intl.DateTimeFormat("en-GB", {timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit"}).formatToParts(new Date(order.paid_at));
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return {payment: {payment_date: `${part("year")}-${part("month")}-${part("day")}`,
    price: (order.total_cents / 100).toFixed(2), transaction_identifier: order.payment_id}};
}
