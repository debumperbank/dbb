import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { createClient } from '@/lib/supabase/server';

// Serverzijdige bron van waarheid voor werkuren per vaste BUMPR-dienst.
// Generieke werkplaatsaanvragen (vrije tekst) vallen terug op het VEILIGE
// MAXIMUM (2u), niet het minimum — zie toelichting bij DEFAULT_HOURS.
const SERVICE_HOURS: Record<string, number> = {
  'BUMPR Full Detail': 2,
  'BUMPR Hydro Coat (6 mnd)': 1,
  'Ultimate BUMPR Combi': 3,
};
const DEFAULT_HOURS = 2;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      service_type,
      address,
      requested_date,
      requested_time,
      notes,
      large_vehicle,
      company,
    } = body ?? {};

    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !address) {
      return NextResponse.json(
        { error: 'Naam, e-mail en adres zijn verplicht.' },
        { status: 400 }
      );
    }

    const estimatedHours = service_type && SERVICE_HOURS[service_type] != null
      ? SERVICE_HOURS[service_type]
      : DEFAULT_HOURS;

    const isLargeVehicle = large_vehicle === true || large_vehicle === 'true';

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
        estimated_hours: estimatedHours,
        large_vehicle: isLargeVehicle,
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
        subject: `Nieuwe afspraakaanvraag van ${name}${isLargeVehicle ? ' (groot voertuig)' : ''}`,
        text: `
Nieuwe afspraakaanvraag via de website (mobiele service)

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}
Type behandeling: ${service_type || '-'}
Adres (locatie voor de afspraak): ${address}
Gewenste datum: ${requested_date || '-'}
Geschatte werkuren: ${estimatedHours}
Groot voertuig (toeslag €59): ${isLargeVehicle ? 'Ja' : 'Nee'}

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