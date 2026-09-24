import { NextResponse } from 'next/server';
import { notifyAdmin } from '@/lib/resend';

import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, service_type, requested_date, notes, company, consent } = body ?? {};

    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Naam en e-mail zijn verplicht.' },
        { status: 400 }
      );
    }

    if (consent !== true && consent !== "on") {
      return NextResponse.json(
        { error: 'Je moet akkoord gaan met de Algemene Voorwaarden en het Privacybeleid.' },
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
        requested_date: requested_date || null,
        notes: notes || null,
        consent_given: true,
        consent_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save workshop booking:', error.message);

      return NextResponse.json(
        { error: 'Kon aanvraag niet opslaan.' },
        { status: 500 }
      );
    }

    // A notification failure must not turn a saved request into a failed submission.
    const notified = await notifyAdmin(`Nieuwe werkplaatsaanvraag van ${name}`, `
Nieuwe werkplaatsaanvraag via de website

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}
Type herstelling: ${service_type || '-'}
Gewenste datum: ${requested_date || '-'}

Omschrijving:
${notes || '-'}
        `.trim(), { replyTo: email });
    if (!notified) {
      return NextResponse.json({
        ok: true,
        warning: 'Aanvraag opgeslagen, maar e-mail kon niet worden verzonden.',
      });
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
