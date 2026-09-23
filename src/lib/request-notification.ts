import { notifyAdmin } from "./resend";
import { services } from "./services";
import type { validateRequest } from "./request-validation";

export async function notifyNewRequest(
  payload: ReturnType<typeof validateRequest>,
  requestId: string,
  photoCount: number,
) {
  const appointment = "service" in payload;
  const title = appointment
    ? "Nieuwe afspraakaanvraag"
    : "Nieuwe inkoopaanvraag";
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://debumperbank.nl"
  ).replace(/\/$/, "");
  const link = appointment
    ? `${base}/admin/appointments/${encodeURIComponent(requestId)}`
    : `${base}/admin/trade-ins`;
  const lines = [
    title,
    "",
    `Naam: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Telefoon: ${payload.phone}`,
    `Kenteken: ${payload.registration}`,
    `Kilometerstand: ${payload.mileage_km ?? "Niet opgegeven"}`,
  ];
  if ("service" in payload) {
    const times: Record<string, string> = {
      morning: "Ochtend",
      afternoon: "Middag",
      flexible: "Flexibel",
    };
    lines.push(
      `Voertuig: ${payload.make_model}`,
      `Dienst: ${services[payload.service as keyof typeof services]}`,
      `Locatiekeuze: ${payload.location_type === "mobile" ? "Op locatie van de klant" : "Eerst overleggen"}`,
      `Adres: ${payload.service_address || "Nog afstemmen"}`,
      `Voorkeursdatum: ${payload.requested_date}`,
      `Voorkeurstijd: ${times[payload.requested_time]}`,
      "",
      "Werkzaamheden / klachten:",
      payload.description,
      "",
      "Dit is een aanvraag, nog geen bevestigde afspraak. Neem contact op met de klant.",
    );
  } else {
    const price =
      payload.asking_price_cents === null
        ? "Niet opgegeven"
        : new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(payload.asking_price_cents / 100);
    lines.push(
      `Gewenste prijs: ${price}`,
      "",
      "Algemene staat:",
      payload.condition,
      "",
      "Onderhoud:",
      payload.maintenance,
      "",
      "Schade en gebreken:",
      payload.damage,
    );
  }
  lines.push(
    "",
    `Foto’s: ${photoCount} (privé te bekijken in het beheer)`,
    `Referentie: ${requestId}`,
    "",
    `Open in het beheer: ${link}`,
  );
  return notifyAdmin(`${title} · ${payload.registration}`, lines.join("\n"), {
    replyTo: payload.email,
    idempotencyKey: `request-notification/${requestId}`,
  });
}
