import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

// SERVER-ONLY. Uses the service role key, which bypasses Row Level
// Security entirely. Never import this file from a Client Component,
// and never send its key to the browser. Reserved for trusted
// operations such as an internal admin dashboard or a payment webhook.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
