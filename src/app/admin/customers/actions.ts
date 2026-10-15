"use server";
import { revalidatePath } from "next/cache";
import { crmClient, type Customer } from "@/lib/crm";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function findCustomers(term: string) {
 const db = await crmClient();
 const clean = String(term).trim().slice(0,100).replace(/[%_\\]/g, "");
 if(clean.length < 2) return { customers: [] as Customer[] };
 const results = await Promise.all(["name", "email", "phone"].map(field =>
  db.from("customers").select("id,name,email,phone,created_at").is("merged_into",null).ilike(field,`%${clean}%`).limit(20)));
 if(results.some(r=>r.error)) return {customers: [] as Customer[],error:"Klanten zoeken is mislukt."};
 const customers = new Map<string,Customer>();
 for(const result of results) for(const c of (result.data || []) as unknown as Customer[]) customers.set(c.id,c);
 return {customers:[...customers.values()]};
}
export async function mergeCustomer(sourceId: string, targetId: string, confirmed: boolean) {
 const db = await crmClient();
 if(confirmed !== true || !uuid.test(sourceId) || !uuid.test(targetId) || sourceId===targetId)
  return {error:"Controleer de gekozen klant en bevestig de koppeling."};
 const {error}=await db.rpc("merge_customer_records",{source_id:sourceId,target_id:targetId});
 if(error) return {error:"Koppelen is mislukt. Controleer of beide fiches nog actief zijn en migratie 012 is uitgevoerd."};
 revalidatePath("/admin","layout");
 return {ok:true};
}
