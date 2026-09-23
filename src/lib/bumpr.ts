import type { BumprProduct } from "./types";

const images: Record<string, string> = {
  "performance-set": "/bumpr/performance-set.png",
  "polish": "/bumpr/polish.png",
  "fast-detailer": "/bumpr/fast-detailer.png",
  "ceramic-coating": "/bumpr/ceramic-coating-original.png",
};
export function productImage(product: BumprProduct) {
  return images[product.slug] || product.image_url;
}
export function productSize(product: BumprProduct) {
  if (product.slug === "ceramic-coating")
    return "200 ml · spons + microvezeldoek";
  if (product.is_bundle) return "200 ml + 2 × 500 ml";
  return product.size_ml ? `${product.size_ml} ml` : "";
}
export function productDescription(product: BumprProduct) {
  if (product.slug === "ceramic-coating")
    return "Keramische coating in een flesje van 200 ml met draaidop, inclusief applicatorspons en microvezeldoek. Voor de verzorging en bescherming van je lak.";
  return product.description;
}
