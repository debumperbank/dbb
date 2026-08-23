import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, service_type, requested_date, notes } = body ?? {};

  if (!name || !email) {
    return NextResponse.json({ error: 'Naam en e-mail zijn verplicht.' }, { status: 400 });
  }

  const supabase = await createClient();
const { error } = await (supabase
  .from('inquiries') as any)
  .insert({    name,
    email,
    phone: phone || null,
    service_type: service_type || null,
    requested_date: requested_date || null,
    notes: notes || null,
  });

  if (error) {
    console.error('Failed to save workshop booking:', error.message);
    return NextResponse.json({ error: 'Kon aanvraag niet opslaan.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
