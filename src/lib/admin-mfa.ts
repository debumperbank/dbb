import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
// Once a factor is enrolled, password-only sessions cannot use any admin data/action.
export async function needsAdminMfa(client: Pick<SupabaseClient<Database>, "auth">) {
  const { data, error } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || !data) throw new Error("Sessiecontrole mislukt.");
  return data.nextLevel === "aal2" && data.currentLevel !== "aal2";
}
