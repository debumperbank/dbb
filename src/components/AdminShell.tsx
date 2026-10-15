"use client";
import {AdminInstall} from "@/components/AdminMobile";
import {usePathname} from "next/navigation";
export function AdminShell({navigation,children}:{navigation:React.ReactNode;children:React.ReactNode}){const app=usePathname().startsWith("/admin/werkplaats");return <div className={`min-h-screen bg-bg-soft text-paper ${app?"":"flex flex-col md:flex-row"}`}>{!app&&navigation}<div className={app?"admin-workspace":"admin-workspace flex-1 min-w-0 px-4 py-5 md:py-10 md:px-12"}>{!app&&<AdminInstall/>}{children}</div></div>;}
