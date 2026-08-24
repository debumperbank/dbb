'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = createAdminClient();
  await supabase.from('inquiries').update({ status }).eq('id', id);
  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}

export async function updateCarWashStatus(id: string, status: string) {
  const supabase = createAdminClient();
  await supabase.from('car_wash_bookings').update({ status }).eq('id', id);
  revalidatePath('/admin/bookings');
  revalidatePath('/admin');
}

export async function updateWorkshopBookingStatus(id: string, status: string) {
  const supabase = createAdminClient();
  await supabase.from('workshop_bookings').update({ status }).eq('id', id);
  revalidatePath('/admin/bookings');
  revalidatePath('/admin');
}
