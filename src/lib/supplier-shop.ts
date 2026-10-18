import {driftEnquiryProducts, geckoEnquiryProducts, cartecEnquiryProducts, type SupplierEnquiry} from "./supplier-enquiries";
import {driftPriceQuotes, type CataloguePrice} from "./drift-prices";
export const SHOP_BRANDS = ["DRIFT", "GECKO", "Cartec"];
export const SHOP_CATEGORIES = ["Voordeelpakketten", "Shampoos", "Reinigers & snowfoam", "Clay & decontaminatie", "Detailersprays", "Polijsten", "Polijstpads", "Borstels & kwasten", "Sponzen & washandschoenen", "Microvezel", "Coatings & sealants", "Beschermingssprays", "Waxes", "Velgen & banden", "Glas", "Interieur", "Bescherming", "Machines & toebehoren", "Accessoires"];
export const SHOP_STATUSES = [["", "Alle beschikbaarheid"], ["supplier", "Op bestelling"], ["enquiry", "Op aanvraag"]] as const;
export type ShopFilters = {brand: string; category: string; query: string; status: string; sort: string};
export type SupplierItem = SupplierEnquiry & {priceQuote?: CataloguePrice};
export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
export function canonicalBrand(brand: string) {
  return SHOP_BRANDS.find(b => normalize(b) === normalize(brand)) || brand.trim();
}
export function canonicalCategory(category: string) {
  const value = normalize(category).replace(/[’']/g, "");
  const aliases: Record<string, string> = {
    bundels: "Voordeelpakketten", pakketten: "Voordeelpakketten", bucketdeals: "Voordeelpakketten",
    shampoo: "Shampoos", shampoos: "Shampoos", wassen: "Shampoos", autoshampoo: "Shampoos",
    "detailer sprays": "Detailersprays", "detailer spray": "Detailersprays", detailerspray: "Detailersprays",
    accessoires: "Accessoires", accesoires: "Accessoires", microvezeldoeken: "Microvezel", doeken: "Microvezel",
    spons: "Sponzen & washandschoenen", sponzen: "Sponzen & washandschoenen", "polish pads": "Polijstpads", borstels: "Borstels & kwasten", coatings: "Coatings & sealants", sealants: "Coatings & sealants", polijstmiddelen: "Polijsten", velgen: "Velgen & banden", banden: "Velgen & banden",
    beschermen: "Bescherming",
  };
  return aliases[value] || SHOP_CATEGORIES.find(c => normalize(c) === value) || category.trim() || "Overige producten";
}
export function buildSupplierItems(existing: {slug:string;name:string;brand?:string}[] = []): SupplierItem[] {
  const comparable = (name:string, brand:string) => normalize(name).replace(new RegExp(`^${normalize(brand)} `), "");
  return [...driftEnquiryProducts, ...geckoEnquiryProducts, ...cartecEnquiryProducts]
    .filter(entry => !existing.some(row => row.slug === entry.slug || (normalize(row.brand || "BUMPR") === normalize(entry.brand) && comparable(row.name, entry.brand) === comparable(entry.name, entry.brand))))
    .map(entry => ({...entry, ...(entry.brand === "DRIFT" ? {priceQuote:driftPriceQuotes[entry.slug]} : {})}));
}
export function itemPriceCents(item: SupplierItem): number | null {
 const value=item.priceQuote?.priceCents; return Number.isSafeInteger(value) && value! > 0 ? value! : null;
}
export function filterSupplierItems(items:SupplierItem[], filters:ShopFilters) {
 const query=normalize(filters.query);
 return items.filter(item => (!filters.brand || normalize(item.brand) === normalize(filters.brand))
  && (!filters.category || normalize(item.category) === normalize(canonicalCategory(filters.category)))
  && (!query || normalize(`${item.name} ${item.brand} ${item.category}`).includes(query))
  && (!filters.status || (item.orderOnly ? "supplier" : "enquiry") === filters.status))
  .sort((a,b) => {
   if (filters.sort === "price_asc" || filters.sort === "price_desc") {
    const first=itemPriceCents(a), second=itemPriceCents(b);
    if(first===null || second===null) {if(first!==second)return first===null ? 1 : -1;}
    else return (first-second)*(filters.sort === "price_desc" ? -1 : 1) || a.name.localeCompare(b.name,"nl");
   }
   if(filters.sort === "category")return a.category.localeCompare(b.category,"nl") || a.name.localeCompare(b.name,"nl");
   return a.name.localeCompare(b.name,"nl");
  });
}
export function readShopFilters(values: Record<string, unknown>): ShopFilters {
  const text = (key: string) => typeof values[key] === "string" ? (values[key] as string).slice(0,200).trim() : "";
  const status = text("status"), sort = text("sort");
  return {brand: canonicalBrand(text("merk")), category: text("categorie") ? canonicalCategory(text("categorie")) : "", query: text("q"), status: SHOP_STATUSES.some(([key]) => key === status) ? status : "", sort: ["name", "price_asc", "price_desc", "category"].includes(sort) ? sort : "category"};
}
export function shopFilterUrl(filters: ShopFilters) {
  const query = new URLSearchParams();
  for (const [key,value] of [["merk", filters.brand], ["categorie", filters.category], ["q", filters.query], ["status", filters.status], ["sort", filters.sort === "category" ? "" : filters.sort]]) if (value) query.set(key,value);
  return `/webshop${query.size ? `?${query}` : ""}#producten`;
}
