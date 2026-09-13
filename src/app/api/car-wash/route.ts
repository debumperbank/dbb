import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { createClient } from '@/lib/supabase/server';

// Serverzijdige bron van waarheid — zelfde patroon als workshop-bookings,
// zodat de browser de capaciteitsberekening niet kan omzeilen.
const SERVICE_HOURS: Record<string, number> = {
  'Basis wasbeurt': 1,
  'Volledige detail': 3,
  'BUMPR Ceramic Coating': 2,
};
const DEFAULT_HOURS = 2; // veilig fallback-maximum, niet het minimum

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      address,
      requested_date,
      notes,
      service_type,
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
      .from('car_wash_bookings') as any)
      .insert({
        name,
        email,
        phone: phone || null,
        address,
        requested_date: requested_date || null,
        notes: notes || null,
        service_type: service_type || null,
        estimated_hours: estimatedHours,
        large_vehicle: isLargeVehicle,
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
        from: 'De Bumperbank <info@debumperbank.nl>',
        to: [process.env.NOTIFY_EMAIL || 'debumperbank@gmail.com'],
        replyTo: email,
        subject: `Nieuwe car wash-aanvraag van ${name}${isLargeVehicle ? ' (groot voertuig)' : ''}`,
        text: `
Nieuwe car wash-aanvraag via de website

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}
Dienst: ${service_type || '-'}
Adres: ${address}
Gewenste datum: ${requested_date || '-'}
Geschatte werkuren: ${estimatedHours}
Groot voertuig (toeslag €59): ${isLargeVehicle ? 'Ja' : 'Nee'}

Opmerkingen:
${notes || '-'}
        `.trim(),
      });

      if (emailError) {
        console.error('Failed to send car wash email:', emailError);

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