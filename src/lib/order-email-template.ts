import type { ShopOrder } from "./shop";
export type OrderEmailKind = "confirmation" | "shipped";
export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
}
const money = (cents: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cents / 100);
export function safeTrackingUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password ? u.href : null; } catch { return null; }
}
export function orderEmail(order: ShopOrder, kind: OrderEmailKind, origin: string, customerInformation: string) {
  const e = escapeHtml, shipped = kind === "shipped";
  const reference = order.id;
  const title = shipped ? "Je BUMPR-pakket is onderweg." : "Bedankt voor je bestelling.";
  const intro = shipped
    ? "Je bestelling is overgedragen aan de vervoerder. Hieronder vind je de verzendinformatie."
    : "Je betaling is ontvangen. We gaan je BUMPR-producten zorgvuldig inpakken. Zodra je pakket onderweg is, ontvang je een verzendbevestiging.";
  const statusUrl = `${origin}/bumpr/bestelling/${encodeURIComponent(order.id)}?token=${encodeURIComponent(order.view_token)}`;
  const trackingUrl = safeTrackingUrl(order.tracking_reference);
  const address = [order.customer.name, order.customer.street, `${order.customer.postal_code} ${order.customer.city}`, order.customer.country].join("\n");
  const itemText = order.items.map(i => `${i.quantity} × ${i.name} — ${money(i.quantity * i.unit_price_cents)}`).join("\n");
  const information = shipped ? "" : customerInformation;
  const text = [title, `Hoi ${order.customer.name},`, intro, `Bestelling: ${reference}`, itemText,
    `Verzending: ${order.shipping_cents ? money(order.shipping_cents) : "Gratis"}`, `Betaald: ${money(order.total_cents)}`,
    "Afleveradres:", address,
    shipped ? `Track & trace: ${order.tracking_reference || "Neem contact op voor de verzendinformatie."}` : "",
    `Bekijk je bestelling: ${statusUrl}`, information,
    "Vragen? Antwoord gerust op deze mail.", "Met vriendelijke groet,", "De Bumperbank", "info@debumperbank.nl · debumperbank.nl", "KvK 42171617 · Btw-id NL005557496B77"].filter(Boolean).join("\n\n");
  const rows = order.items.map(i => `<tr><td style="padding:14px 0;border-bottom:1px solid #e9e9e5">${e(String(i.quantity))} × ${e(i.name)}</td><td style="padding:14px 0;border-bottom:1px solid #e9e9e5;text-align:right;white-space:nowrap">${e(money(i.quantity * i.unit_price_cents))}</td></tr>`).join("");
  const button = (url: string, label: string) => `<a href="${e(url)}" style="display:inline-block;background:#f6d42c;color:#111;text-decoration:none;padding:14px 22px;border-radius:4px;font-weight:bold">${label}</a>`;
  const html = `<!doctype html><html lang="nl"><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"></head><body style="margin:0;background:#eeeae3;font-family:Arial,sans-serif;color:#202020"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:white"><tr><td style="background:#111;border-bottom:5px solid #f7d522;padding:24px 28px"><img src="${e(origin)}/logo-header.png" alt="De Bumperbank" width="180" style="display:block;width:180px;max-width:100%;height:auto"><p style="color:#fff;font-size:10px;letter-spacing:2px;margin:14px 0 0">BUMPR · PREMIUM CAR CARE</p></td></tr><tr><td style="padding:28px;line-height:1.6"><p style="font-size:11px;color:#666;overflow-wrap:anywhere">BESTELLING ${e(reference)}</p><h1 style="font-size:28px;line-height:1.2">${title}</h1><p>Hoi ${e(order.customer.name)},</p><p>${intro}</p><table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">${rows}</table><p>Verzending: ${order.shipping_cents ? e(money(order.shipping_cents)) : "Gratis"}</p><p style="font-size:22px;border-top:2px solid #171717;padding-top:16px"><strong>Betaald: ${e(money(order.total_cents))}</strong></p><div style="background:#f5f5f0;padding:18px;margin:24px 0"><strong>Afleveradres</strong><br>${e(address).replace(/\n/g,"<br>")}</div>${shipped ? `<p>Track &amp; trace: ${e(order.tracking_reference || "Neem contact op voor de verzendinformatie.")}</p>${trackingUrl ? button(trackingUrl,"Volg je pakket →") : ""}` : ""}<p>${button(statusUrl,"Bekijk je bestelling →")}</p><p>Vragen over je bestelling? Antwoord gerust op deze mail.</p><p>Met vriendelijke groet,<br><strong>De Bumperbank</strong></p>${information ? `<div style="font-size:12px;border-top:1px solid #ddd;margin-top:28px;padding-top:18px"><strong>Informatie bij je aankoop</strong><p>${e(information).replace(/\n/g,"<br>")}</p></div>` : ""}</td></tr><tr><td style="background:#f5f5f1;padding:22px;text-align:center;font-size:11px;color:#626262">De Bumperbank · Hulst<br>info@debumperbank.nl · debumperbank.nl<br>KvK 42171617 · Btw-id NL005557496B77</td></tr></table></td></tr></table></body></html>`;
  return { subject: `${shipped ? "Je BUMPR-bestelling is verzonden" : "Je BUMPR-bestelling is bevestigd"} · ${reference.slice(0,8)}`, html, text };
}
