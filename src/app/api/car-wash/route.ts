import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, address, requested_date, notes } = body ?? {};

  if (!name || !email || !address) {
    return NextResponse.json(
      { error: 'Naam, e-mail en adres zijn verplicht.' },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await (supabase
  .from('car_wash_bookings') as any)
  .insert({
    name,
    email,
    phone: phone || null,
    address,
  });
  

  if (error) {
    console.error('Failed to save car wash booking:', error.message);
    return NextResponse.json({ error: 'Kon aanvraag niet opslaan.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
