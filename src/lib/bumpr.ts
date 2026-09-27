import type { BumprProduct } from "./types";

const images: Record<string, string> = {
  "performance-set": "/bumpr/collection-2026/performance-set.png",
  "polish": "/bumpr/collection-2026/polish.png",
  "fast-detailer": "/bumpr/collection-2026/fast-detailer.png",
  "ceramic-coating": "/bumpr/collection-2026/hydro-coat.png",
  "hydro-coat": "/bumpr/collection-2026/hydro-coat.png",
  "iron-remover": "/bumpr/collection-2026/iron-remover.png",
  "microvezel-droogdoeken": "/bumpr/collection-2026/microvezel-set.png",
};
export function productImage(product: BumprProduct) {
  return images[product.slug] || product.image_url;
}
export function productSize(product: BumprProduct) {
  if (["ceramic-coating", "hydro-coat"].includes(product.slug))
    return "Glazen flesje met druppelpipet · spons + suèdedoekje";
  if (product.slug === "performance-set")
    return "Polish + Fast Detailer + HYDRO-COAT · spons + suèdedoekje";
  if (product.slug === "microvezel-droogdoeken")
    return "Set van 3 · 40 × 40 cm · 400 GSM";
  if (product.slug === "iron-remover") return "Wheel cleaner · spuitfles";
  return product.size_ml ? `${product.size_ml} ml` : "";
}
export function productDescription(product: BumprProduct) {
  if (["ceramic-coating", "hydro-coat"].includes(product.slug))
    return "HYDRO-COAT keramische coating in een glazen flesje met druppelpipet, inclusief applicatorspons en suèdedoekje.";
  if (product.slug === "performance-set")
    return "De BUMPR Performance Set bevat Polish met push-pull-dop, Fast Detailer in een spuitfles en HYDRO-COAT in een glazen flesje met druppelpipet. Inclusief applicatorspons en suèdedoekje.";
  return product.description;
}
