import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, service_type, address, requested_date, requested_time, notes, company } = body ?? {};

    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !address) {
      return NextResponse.json(
        { error: 'Naam, e-mail en adres zijn verplicht.' },
        { status: 400 }
      );
    }

    // 1. Opslaan in Supabase
    const supabase = await createClient();

    const { error } = await (supabase
      .from('workshop_bookings') as any)
      .insert({
        name,
        email,
        phone: phone || null,
        service_type: service_type || null,
        address,
        requested_date: requested_date || null,
        requested_time: requested_time || null,
        notes: notes || null,
      });

    if (error) {
      console.error('Failed to save workshop booking:', error.message);

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
        subject: `Nieuwe afspraakaanvraag van ${name}`,
        text: `
Nieuwe afspraakaanvraag via de website (mobiele service)

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}
Type behandeling: ${service_type || '-'}
Adres (locatie voor de afspraak): ${address}
Gewenste datum: ${requested_date || '-'}
Gewenste tijd: ${requested_time || '-'}

Omschrijving:
${notes || '-'}
        `.trim(),
      });

      if (emailError) {
        console.error('Failed to send workshop booking email:', emailError);

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
    console.error('Workshop booking failed:', error);

    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van de aanvraag.' },
      { status: 500 }
    );
  }
}
