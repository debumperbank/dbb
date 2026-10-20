// Public offering only; historical records and admin capabilities remain available.
export const EXAMPLE_MODE = true;
export const PUBLIC_OFFERING = { detailing: !EXAMPLE_MODE, mobileWorkshop: false, vehicleTrading: false } as const;
export const PAUSED_OFFERING_MESSAGE = "Onze website is in opbouw. Producten bestellen, betalen en afspraken aanvragen is momenteel niet mogelijk.";
export const HIDDEN_OFFERING_PATHS = ["/mobiele-autoservice", "/werkplaats", "/diagnose", "/voertuigdiagnose", "/onderhoud", "/reparaties", "/occasions", "/voorraad", "/auto-verkopen", "/oldtimers"];
export function isHiddenOfferingPath(path: string) {
  if (EXAMPLE_MODE && ["/afspraak", "/webshop", "/bumpr"].some(base => path === base || path.startsWith(`${base}/`)) && !path.startsWith("/bumpr/bestelling/")) return true;
  return HIDDEN_OFFERING_PATHS.some(base => (path === base || path.startsWith(`${base}/`)) && (base === "/occasions" || base === "/voorraad" || base === "/auto-verkopen" || base === "/oldtimers" ? !PUBLIC_OFFERING.vehicleTrading : !PUBLIC_OFFERING.mobileWorkshop));
}
export function isPublicDetailingRequest(form: FormData) {
  return PUBLIC_OFFERING.detailing && form.get("kind") === "appointment" && form.get("service") === "detailing" && form.get("location_type") === "discuss";
}

export function publicNavigationLinks() {
  return [["Home", "/"], ...(PUBLIC_OFFERING.mobileWorkshop ? [["Mobiele autoservice", "/mobiele-autoservice"], ["Werkplaats", "/werkplaats"]] : []), ["Detailing", "/detailing"], ...(!EXAMPLE_MODE ? [["Webshop", "/webshop"], ["BUMPR", "/bumpr"]] : []), ...(PUBLIC_OFFERING.vehicleTrading ? [["Occasions", "/occasions"], ["Auto verkopen", "/auto-verkopen"]] : []), ["Over ons", "/over-ons"], ["Contact", "/contact"]];
}
export function isPausedPublicRequest(form: FormData) {
  if (EXAMPLE_MODE && form.get("kind") === "appointment") return true;
  if (form.get("kind") === "trade_in") return !PUBLIC_OFFERING.vehicleTrading;
  if (form.get("kind") !== "appointment" || !form.get("service") || !form.get("location_type")) return false;
  return PUBLIC_OFFERING.mobileWorkshop ? false : !isPublicDetailingRequest(form);
}
