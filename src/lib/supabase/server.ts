import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Use this inside Server Components, Server Actions, and Route Handlers.
// It runs with the anon key and is subject to Row Level Security, same
// as the browser client — safe for reading public catalogue data.
//
// Next.js 15+: cookies() is async, so this function is too. Every call
// site must `await createClient()`.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component with no writable cookie jar —
            // safe to ignore as long as middleware refreshes sessions.
          }
        },
      },
    },
  );
}