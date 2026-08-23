import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types';

// Use this inside Server Components, Server Actions, and Route Handlers.
// It runs with the anon key and is subject to Row Level Security, same
// as the browser client — safe for reading public catalogue data.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
  try {
    cookiesToSet.forEach(({ name, value, options }) =>
      cookieStore.set(name, value, options)
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
