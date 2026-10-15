import {crmClient} from "@/lib/crm";
import {CustomerForm} from "@/components/CustomerForm";
export default async function Page(){await crmClient();return <div><h1 className="text-3xl mb-6">Klant toevoegen</h1><CustomerForm/></div>;}
