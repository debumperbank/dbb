import Link from "next/link";
import {workshopContext} from "@/lib/workshop-data";
import {WorkshopSettings} from "@/components/WorkshopSettings";
import {AdminInstall} from "@/components/AdminMobile";
import {logout} from "@/app/admin/auth-actions";
export default async function Page(){const {settings}=await workshopContext();return <><h1 className="text-3xl font-semibold mb-5">Instellingen</h1><WorkshopSettings settings={settings}/><div className="panel mt-6"><AdminInstall/><p className="text-muted">Timers lopen door als je het scherm sluit. Klok uit voordat je stopt met werken. Internet is nodig om wijzigingen op te slaan.</p><div className="grid sm:grid-cols-2 gap-3 mt-5"><Link className="work-tile" href="/admin/security"><strong>Accountbeveiliging</strong></Link><Link className="work-tile" href="/admin"><strong>Volledig beheer</strong></Link></div><form action={logout} className="mt-5"><button className="btn btn-ghost">Uitloggen</button></form></div></>;}
