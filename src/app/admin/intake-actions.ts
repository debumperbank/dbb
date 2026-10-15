"use server";
import {crmClient} from "@/lib/crm";
import {validRecordId} from "@/lib/admin-records";
import {customerValues,jobValues} from "@/lib/admin-intake";
import {revalidatePath} from "next/cache";
export async function saveCustomer(id:string|null,form:FormData) {
 const db=await crmClient();if(id!==null&&!validRecordId(id))return {error:"Ongeldige klant."};
 let values;try{values=customerValues(form);}catch(e){return {error:(e as Error).message};}
 const query=id?db.from("customers").update(values).eq("id",id).is("merged_into",null):db.from("customers").insert(values);
 const {data,error}=await query.select("id").single();if(error||!data)return {error:"Klant opslaan is mislukt."};
 revalidatePath("/admin","layout");return {ok:true,id:String(data.id)};
}
export async function createJob(customerId:string,form:FormData) {
 const db=await crmClient();let payload;try{payload=jobValues(customerId,form);}catch(e){return {error:(e as Error).message};}
 const {data,error}=await db.rpc("create_admin_job",{payload});if(error||!data)return {error:"Aanvraag maken mislukt. Controleer de klant, het voertuig en migratie 014."};
 revalidatePath("/admin","layout");return {ok:true,id:String(data)};
}
