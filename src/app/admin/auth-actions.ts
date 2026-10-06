'use server';

import { isAdminUser } from '@/lib/admin-access';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/admin/login?error=Inloggen%20mislukt.%20Controleer%20je%20gegevens%20of%20probeer%20later%20opnieuw.');
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    redirect('/admin/login?error=Geen%20toegang%20tot%20beheer.');
  }
  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
