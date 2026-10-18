import type { MetadataRoute } from "next";
import { isHiddenOfferingPath } from "@/lib/public-offering";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://debumperbank.nl";
  const pages = [
    "",
    "/mobiele-autoservice",
    "/werkplaats",
    "/detailing",
    "/occasions",
    "/auto-verkopen",
    "/over-ons",
    "/contact",
    "/afspraak",
    "/bumpr",
    "/oldtimers",
  ];
  return pages.filter(path => !isHiddenOfferingPath(path)).map(path => ({url:`${base}${path}`}));
}
