import { needsAdminMfa } from "@/lib/admin-mfa";
import { isAdminUser } from "@/lib/admin-access";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session on every request and keeps the
// browser's cookies in sync, per the @supabase/ssr recommended pattern.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  function finish(response: NextResponse) {
    for (const cookie of supabaseResponse.cookies.getAll()) response.cookies.set(cookie);
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }
  if (isAdminUser(user) && !isLoginRoute && request.nextUrl.pathname !== "/admin/security") {
    try {
      if (await needsAdminMfa(supabase)) {
        const url = request.nextUrl.clone(); url.pathname = "/admin/security"; url.search = "";
        return finish(NextResponse.redirect(url));
      }
    } catch {
      const url = request.nextUrl.clone(); url.pathname = "/admin/security"; url.search = "";
      return finish(NextResponse.redirect(url));
    }
  }
  if (isAdminRoute && !isLoginRoute && !isAdminUser(user)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return finish(NextResponse.redirect(url));
  }

  if (isLoginRoute && isAdminUser(user)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return finish(NextResponse.redirect(url));
  }

  return finish(supabaseResponse);
}
