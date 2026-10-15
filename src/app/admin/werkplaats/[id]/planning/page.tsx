import Link from "next/link";
import {workshopJob} from "@/lib/workshop-data";
import {AppointmentEditor} from "@/components/AppointmentEditor";
import {RecordEditor} from "@/components/RecordEditor";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params,a=await workshopJob(id);return <><Link className="underline block py-3" href={`/admin/werkplaats/${id}`}>← Terug naar dossier</Link><h1 className="text-3xl my-5">Dossier aanpassen · {a.vehicles.registration}</h1><AppointmentEditor appointment={a}/><div className="mt-6"><RecordEditor kind="appointments" id={id} values={{description:a.description,work_notes:a.work_notes,admin_notes:(a as unknown as {admin_notes:string}).admin_notes||""}}/></div></>;}
