import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isHiddenOfferingPath } from "@/lib/public-offering";
export async function middleware(request: NextRequest) {
  if (isHiddenOfferingPath(request.nextUrl.pathname)) {
    const target = request.nextUrl.clone(); target.pathname = "/over-ons"; target.search = "";
    const response = NextResponse.redirect(target, 307);
    response.headers.set("X-Robots-Tag", "noindex"); response.headers.set("Cache-Control", "no-store");
    return response;
  }
  if (request.nextUrl.pathname.startsWith("/admin")) return updateSession(request);
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/mobiele-autoservice/:path*", "/werkplaats/:path*", "/diagnose/:path*", "/voertuigdiagnose/:path*", "/onderhoud/:path*", "/reparaties/:path*", "/occasions/:path*", "/voorraad/:path*", "/auto-verkopen/:path*", "/oldtimers/:path*"] };
