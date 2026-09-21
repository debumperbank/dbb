import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
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
  const db = await createClient();
  const { data } = await db
    .from("listings")
    .select("id,slug")
    .in("status", ["active", "reserved"]);
  return [
    ...pages.map((path) => ({ url: `${base}${path}` })),
    ...(data || []).map((row: { id: unknown; slug: unknown }) => ({
      url: `${base}/occasions/${encodeURIComponent(String(row.slug || row.id))}`,
    })),
  ];
}
