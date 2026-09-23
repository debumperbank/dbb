import "server-only";
export type MolliePayment = {
  id: string;
  mode: "test" | "live";
  status: string;
  amount: { currency: string; value: string };
  metadata?: { order_id?: string };
  paidAt?: string;
  _links?: { checkout?: { href: string } };
};
export function mollieMode() {
  const key = process.env.MOLLIE_API_KEY;
  if (!key || !/^(test|live)_/.test(key))
    throw new Error("Mollie is nog niet ingesteld.");
  return key.startsWith("test_") ? "test" : "live";
}
export function shopOrigin() {
  if (!process.env.NEXT_PUBLIC_SITE_URL)
    throw new Error("Stel de publieke webshop-URL in.");
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL);
  if (url.protocol !== "https:" || url.username || url.password)
    throw new Error("Configureer een publiek HTTPS-adres voor de webshop.");
  return url.origin;
}
export async function mollieRequest(
  path: string,
  body?: unknown,
  idempotencyKey?: string,
): Promise<MolliePayment> {
  mollieMode();
  const response = await fetch(`https://api.mollie.com/v2/payments${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Mollie kon de betaling niet verwerken.");
  return response.json();
}
export function checkoutUrl(payment: MolliePayment) {
  const raw = payment._links?.checkout?.href;
  if (!raw) throw new Error("Mollie heeft geen betaallink teruggegeven.");
  const url = new URL(raw);
  if (
    url.protocol !== "https:" ||
    !(url.hostname === "mollie.com" || url.hostname.endsWith(".mollie.com"))
  )
    throw new Error("Ongeldige betaallink.");
  return url.href;
}
