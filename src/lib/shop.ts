import type { CartItem } from "./cart";
export const shippingRates = {
  NL: { name: "Nederland", cents: 499 },
  BE: { name: "België", cents: 699 },
} as const;
export const FREE_SHIPPING_CENTS = 5000;
export type ShopCustomer = {
  name: string;
  email: string;
  phone: string;
  street: string;
  postal_code: string;
  city: string;
  country: keyof typeof shippingRates;
};
export type OrderLine = {
  id: string;
  name: string;
  quantity: number;
  unit_price_cents: number;
};
export type ShopOrder = {
  id: string;
  checkout_key: string;
  request_hash: string;
  view_token: string;
  customer: ShopCustomer;
  items: OrderLine[];
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  status: string;
  payment_id: string | null;
  payment_mode: string;
  checkout_url: string | null;
  created_at: string;
  paid_at: string | null;
  notified_at: string | null;
  fulfillment_status: string;
  tracking_reference: string | null;
};
export function shippingCost(subtotal: number, country: string) {
  if (!Object.hasOwn(shippingRates, country))
    throw new Error("We verzenden alleen naar Nederland en België.");
  return subtotal >= FREE_SHIPPING_CENTS
    ? 0
    : shippingRates[country as keyof typeof shippingRates].cents;
}
export function validateCheckout(value: unknown) {
  if (!value || typeof value !== "object")
    throw new Error("Ongeldige bestelling.");
  const b = value as Record<string, unknown>,
    raw = b.customer;
  if (!raw || typeof raw !== "object")
    throw new Error("Vul je verzendgegevens in.");
  const c = raw as Record<string, unknown>;
  const text = (key: string, max: number, required = true) => {
    if (
      typeof c[key] !== "string" ||
      (required && !c[key].trim()) ||
      c[key].length > max
    )
      throw new Error("Controleer je contact- en adresgegevens.");
    return c[key].trim();
  };
  const name = text("name", 120),
    email = text("email", 254).toLowerCase(),
    phone = text("phone", 40, false),
    street = text("street", 200),
    postal_code = text("postal_code", 12).toUpperCase(),
    city = text("city", 100),
    country = text("country", 2);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Vul een geldig e-mailadres in.");
  if (!["NL", "BE"].includes(country))
    throw new Error("Kies Nederland of België.");
  if (
    (country === "NL" && !/^[1-9][0-9]{3}\s?[A-Z]{2}$/.test(postal_code)) ||
    (country === "BE" && !/^[1-9][0-9]{3}$/.test(postal_code))
  )
    throw new Error("Vul een geldige postcode in.");
  if (b.consent !== true) throw new Error("Ga akkoord met de voorwaarden.");
  if (
    typeof b.checkout_key !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      b.checkout_key,
    )
  )
    throw new Error("Ververs de pagina en probeer opnieuw.");
  if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > 20)
    throw new Error("Je winkelmandje is leeg of te groot.");
  const seen = new Set<string>();
  const items: CartItem[] = b.items
    .map((item: unknown) => {
      if (!item || typeof item !== "object")
        throw new Error("Ongeldig product.");
      const i = item as Record<string, unknown>;
      if (
        typeof i.id !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(i.id) ||
        !Number.isInteger(i.quantity) ||
        Number(i.quantity) < 1 ||
        Number(i.quantity) > 20 ||
        seen.has(i.id)
      )
        throw new Error("Controleer de aantallen in je mandje.");
      seen.add(i.id);
      return { id: i.id, quantity: Number(i.quantity) };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  if (
    !Number.isSafeInteger(b.expected_total_cents) ||
    Number(b.expected_total_cents) <= 0
  )
    throw new Error("Controleer je besteltotaal.");
  return {
    checkout_key: b.checkout_key,
    customer: {
      name,
      email,
      phone,
      street,
      postal_code,
      city,
      country,
    } as ShopCustomer,
    items,
    expected_total_cents: Number(b.expected_total_cents),
  };
}
export function quoteOrder(
  items: CartItem[],
  products: {
    id: string;
    name: string;
    price_cents: number;
    is_available?: boolean;
  }[],
  country: string,
) {
  const lines: OrderLine[] = items.map((i) => {
    const p = products.find((p) => p.id === i.id);
    if (
      !p ||
      p.is_available === false ||
      !Number.isSafeInteger(p.price_cents) ||
      p.price_cents <= 0
    )
      throw new Error(
        "Een product is niet meer beschikbaar. Ververs je mandje.",
      );
    return {
      id: p.id,
      name: p.name,
      quantity: i.quantity,
      unit_price_cents: p.price_cents,
    };
  });
  const subtotal = lines.reduce(
    (n, i) => n + i.quantity * i.unit_price_cents,
    0,
  );
  if (!Number.isSafeInteger(subtotal) || subtotal > 1000000)
    throw new Error("Neem contact op voor een bestelling van deze omvang.");
  const shipping = shippingCost(subtotal, country);
  return {
    items: lines,
    subtotal_cents: subtotal,
    shipping_cents: shipping,
    total_cents: subtotal + shipping,
  };
}
