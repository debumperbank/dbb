"use client";
import {usePathname} from "next/navigation";
export function PublicOnly({children}:{children:React.ReactNode}){const path=usePathname();return path==="/admin"||path.startsWith("/admin/")?null:children;}
