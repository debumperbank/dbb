import { services } from "./services";
export function validateRequest(
  form: FormData,
  today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()),
) {
  const text = (key: string, required = true, max = 2000) => {
    const value = form.get(key);
    if (
      typeof value !== "string" ||
      (required && !value.trim()) ||
      value.length > max
    )
      throw new Error(`Vul het veld ${key} correct in.`);
    return value.trim();
  };
  const integer = (key: string, required = true) => {
    const value = text(key, required, 12);
    if (!value && !required) return null;
    if (!/^\d+$/.test(value) || Number(value) > 10000000)
      throw new Error("Vul een geldige kilometerstand in.");
    return Number(value);
  };
  const price = () => {
    const value = text("asking_price", false, 12).replace(",", ".");
    if (!value) return null;
    if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) > 10000000)
      throw new Error("Vul een geldige vraagprijs in.");
    return Math.round(Number(value) * 100);
  };
  if (form.get("consent") !== "on")
    throw new Error("Ga akkoord met de voorwaarden en het privacybeleid.");
  const kind = text("kind", true, 20),
    name = text("name", true, 120),
    email = text("email", true, 254).toLowerCase(),
    phone = text("phone", true, 40);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Vul een geldig e-mailadres in.");
  if (!/^[+()\d\s.-]{6,40}$/.test(phone))
    throw new Error("Vul een geldig telefoonnummer in.");
  const registration = text("registration", true, 20).toUpperCase();
  const common = { kind, name, email, phone, registration };
  if (kind === "trade_in")
    return {
      ...common,
      mileage_km: integer("mileage_km"),
      condition: text("condition"),
      maintenance: text("maintenance"),
      damage: text("damage"),
      asking_price_cents: price(),
    };
  if (kind !== "appointment") throw new Error("Ongeldige aanvraag.");
  const service = text("service", true, 30),
    location_type = text("location_type", true, 20),
    requested_date = text("requested_date", true, 10),
    requested_time = text("requested_time", true, 30);
  if (
    !Object.hasOwn(services, service) ||
    !["mobile", "discuss"].includes(location_type)
  )
    throw new Error("Selecteer een dienst en locatie.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(requested_date) ||
    !Number.isFinite(Date.parse(requested_date)) ||
    new Date(requested_date).toISOString().slice(0, 10) !== requested_date ||
    requested_date < today
  )
    throw new Error("Kies een geldige datum vanaf vandaag.");
  if (!["morning", "afternoon", "flexible"].includes(requested_time))
    throw new Error("Kies een voorkeurstijd.");
  return {
    ...common,
    mileage_km: integer("mileage_km", false),
    make_model: text("make_model", true, 120),
    service,
    location_type,
    service_address: text("service_address", location_type === "mobile", 500),
    requested_date,
    requested_time,
    description: text("description"),
  };
}
