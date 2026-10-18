// Public offering only; historical records and admin capabilities remain available.
export const PUBLIC_OFFERING = { detailing: true, mobileWorkshop: false, vehicleTrading: false } as const;
export const PAUSED_OFFERING_MESSAGE = "We richten ons momenteel op detailing en de webshop. Deze aanvraag is tijdelijk niet mogelijk. Voor detailing kun je een afspraak aanvragen; de locatie bespreken we samen.";
export const HIDDEN_OFFERING_PATHS = ["/mobiele-autoservice", "/werkplaats", "/diagnose", "/voertuigdiagnose", "/onderhoud", "/reparaties", "/occasions", "/voorraad", "/auto-verkopen", "/oldtimers"];
export function isHiddenOfferingPath(path: string) {
  return HIDDEN_OFFERING_PATHS.some(base => (path === base || path.startsWith(`${base}/`)) && (base === "/occasions" || base === "/voorraad" || base === "/auto-verkopen" || base === "/oldtimers" ? !PUBLIC_OFFERING.vehicleTrading : !PUBLIC_OFFERING.mobileWorkshop));
}
export function isPublicDetailingRequest(form: FormData) {
  return PUBLIC_OFFERING.detailing && form.get("kind") === "appointment" && form.get("service") === "detailing" && form.get("location_type") === "discuss";
}

export function publicNavigationLinks() {
  return [["Home", "/"], ...(PUBLIC_OFFERING.mobileWorkshop ? [["Mobiele autoservice", "/mobiele-autoservice"], ["Werkplaats", "/werkplaats"]] : []), ["Detailing", "/detailing"], ["Webshop", "/webshop"], ["BUMPR", "/bumpr"], ...(PUBLIC_OFFERING.vehicleTrading ? [["Occasions", "/occasions"], ["Auto verkopen", "/auto-verkopen"]] : []), ["Over ons", "/over-ons"], ["Contact", "/contact"]];
}
export function isPausedPublicRequest(form: FormData) {
  if (form.get("kind") === "trade_in") return !PUBLIC_OFFERING.vehicleTrading;
  if (form.get("kind") !== "appointment" || !form.get("service") || !form.get("location_type")) return false;
  return PUBLIC_OFFERING.mobileWorkshop ? false : !isPublicDetailingRequest(form);
}
