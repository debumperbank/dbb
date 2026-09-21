"use server";

import { revalidatePath } from "next/cache";
import { crmClient } from "@/lib/crm";

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = await crmClient();
  await supabase.from("inquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function updateCarWashStatus(id: string, status: string) {
  const supabase = await crmClient();
  await supabase.from("car_wash_bookings").update({ status }).eq("id", id);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function updateWorkshopBookingStatus(id: string, status: string) {
  const supabase = await crmClient();
  await supabase.from("workshop_bookings").update({ status }).eq("id", id);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}
