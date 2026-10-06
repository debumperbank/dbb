import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin-access";
import { redirect } from "next/navigation";
import { SecurityForm } from "./security-form";
export default async function SecurityPage() {
  const db = await createClient();
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !isAdminUser(user)) redirect("/admin/login");
  return <main className="max-w-lg"><h1 className="text-3xl mb-4">Accountbeveiliging</h1>
    <p className="mb-6">Beveilig je beheeraccount met een authenticator-app. Na het koppelen heb je naast je wachtwoord ook een zescijferige code nodig.</p>
    <SecurityForm />
  </main>;
}
