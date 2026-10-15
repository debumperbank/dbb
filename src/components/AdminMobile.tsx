"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
type InstallEvent = Event & {prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
export function AdminMobile({children}:{children:React.ReactNode}) {
 const [open,setOpen]=useState(false);const path=usePathname();useEffect(()=>setOpen(false),[path]);
 return <><div className="md:hidden flex flex-wrap gap-2 mb-4"><Link href="/admin/dossiers" className="btn btn-primary">Dossiers</Link><Link href="/admin/customers" className="btn btn-ghost">Klanten</Link><button className="btn btn-ghost" aria-expanded={open} aria-controls="admin-menu" onClick={()=>setOpen(!open)}>Menu</button></div><div id="admin-menu" className={`${open?"block":"hidden"} md:block`}>{children}</div></>;
}
export function AdminInstall() {
 const [install,setInstall]=useState<InstallEvent|null>(null),[offline,setOffline]=useState(false),[standalone,setStandalone]=useState(false);
 useEffect(()=>{const network=()=>setOffline(!navigator.onLine);network();setStandalone(window.matchMedia("(display-mode: standalone)").matches||Boolean((navigator as Navigator & {standalone?:boolean}).standalone));const capture=(e:Event)=>{e.preventDefault();setInstall(e as InstallEvent);};const done=()=>{setInstall(null);setStandalone(true);};window.addEventListener("beforeinstallprompt",capture);window.addEventListener("appinstalled",done);window.addEventListener("online",network);window.addEventListener("offline",network);return()=>{window.removeEventListener("beforeinstallprompt",capture);window.removeEventListener("appinstalled",done);window.removeEventListener("online",network);window.removeEventListener("offline",network);};},[]);
 return <>{offline&&<p role="alert" className="p-4 border border-yellow-400 rounded mb-4">Geen internet. Wijzigingen en foto’s worden nu niet opgeslagen. Houd dit scherm open en probeer opnieuw zodra je verbinding hebt.</p>}{!standalone&&<details className="mb-5 text-sm"><summary className="cursor-pointer py-3 underline">Beheer als app op je telefoon of tablet</summary><div className="panel mt-2 space-y-3"><p>iPhone/iPad: open deze pagina in Safari, tik op Delen en kies ‘Zet op beginscherm’.</p><p>Android: open deze pagina in Chrome en kies in het menu ‘App installeren’ of ‘Toevoegen aan startscherm’.</p>{install&&<button className="btn btn-primary" onClick={async()=>{try{await install.prompt();await install.userChoice;}finally{setInstall(null);}}}>App installeren</button>}<p>Inloggen blijft verplicht. Voor klanten, dossiers en foto’s is internet nodig.</p></div></details>}</>;
}
