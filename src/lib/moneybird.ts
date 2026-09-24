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
  if (!env.MONEYBIRD_API_TOKEN || !tax || !ledger || !workflow ||
      ![tax, ledger, workflow].every(id => /^\d+$/.test(id)) ||
      env.MONEYBIRD_RECONCILIATION !== "external_reviewed")
    throw new MoneybirdError("configuration_required");
  return { tax, ledger, workflow };
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
};
export function invoiceReference(order: ShopOrder) { return `BUMPR-${order.id}`; }
export function invoicePayload(order: ShopOrder, contactId: string, config: ReturnType<typeof moneybirdConfig>) {
  return { sales_invoice: {
    contact_id: contactId,
    reference: invoiceReference(order),
    currency: "EUR",
    prices_are_incl_tax: true,
    workflow_id: config.workflow,
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
