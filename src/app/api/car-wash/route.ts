import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, address, requested_date, notes } = body ?? {};

    if (!name || !email || !address) {
      return NextResponse.json(
        { error: 'Naam, e-mail en adres zijn verplicht.' },
        { status: 400 }
      );
    }

    // 1. Opslaan in Supabase
    const supabase = createClient();

    const { error } = await (supabase
      .from('car_wash_bookings') as any)
      .insert({
        name,
        email,
        phone: phone || null,
        address,
        requested_date: requested_date || null,
        notes: notes || null,
      });

    if (error) {
      console.error('Failed to save car wash booking:', error.message);

      return NextResponse.json(
        { error: 'Kon aanvraag niet opslaan.' },
        { status: 500 }
      );
    }

    // 2. E-mail versturen — alleen als er een API-key geconfigureerd is.
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { error: emailError } = await resend.emails.send({
        from: 'Website <onboarding@resend.dev>',
        to: [process.env.NOTIFY_EMAIL || 'debumperbank@gmail.com'],
        replyTo: email,
        subject: `Nieuwe car wash-aanvraag van ${name}`,
        text: `
Nieuwe car wash-aanvraag via de website

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}
Adres: ${address}
Gewenste datum: ${requested_date || '-'}

Opmerkingen:
${notes || '-'}
        `.trim(),
      });

      if (emailError) {
        console.error('Failed to send car wash email:', emailError);

        // De aanvraag staat wel in Supabase, ook als de mail mislukt.
        return NextResponse.json(
          {
            ok: true,
            warning: 'Aanvraag opgeslagen, maar e-mail kon niet worden verzonden.',
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Car wash booking failed:', error);

    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van de aanvraag.' },
      { status: 500 }
    );
  }
}
