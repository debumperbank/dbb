import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, message, listing_id } = body ?? {};

  if (!name || !email) {
    return NextResponse.json({ error: 'Naam en e-mail zijn verplicht.' }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.from('inquiries').insert({
    name,
    email,
    phone: phone || null,
    message: message || null,
    listing_id: listing_id || null,
  });

  if (error) {
    console.error('Failed to save inquiry:', error.message);
    return NextResponse.json({ error: 'Kon bericht niet opslaan.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
