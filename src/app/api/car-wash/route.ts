import { validLead } from "@/lib/lead-validation";
import { secureRequest } from "@/lib/request-security";
import { NextResponse } from 'next/server';
import { notifyAdmin } from '@/lib/resend';

import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const secured = await secureRequest(request, 20000, true);
  if (secured.error) return secured.error;
  request = secured.request!;
  try {
    let body: unknown;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
    }
    if (!validLead(body)) return NextResponse.json({ error: "Controleer de ingevulde gegevens." }, { status: 400 });

    const { name, email, phone, address, requested_date, notes, company, consent } = body as Record<string, any>;

    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !address) {
      return NextResponse.json(
        { error: 'Naam, e-mail en adres zijn verplicht.' },
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
    const supabase = createAdminClient();

    const { error } = await (supabase
      .from('car_wash_bookings') as any)
      .insert({
        name,
        email,
        phone: phone || null,
        address,
        requested_date: requested_date || null,
        notes: notes || null,
        consent_given: true,
        consent_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save car wash booking:');

      return NextResponse.json(
        { error: 'Kon aanvraag niet opslaan.' },
        { status: 500 }
      );
    }

    // A notification failure must not turn a saved request into a failed submission.
    const notified = await notifyAdmin(`Nieuwe car wash-aanvraag van ${name}`, `
Nieuwe car wash-aanvraag via de website

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}
Adres: ${address}
Gewenste datum: ${requested_date || '-'}

Opmerkingen:
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
    console.error('Car wash booking failed:');

    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van de aanvraag.' },
      { status: 500 }
    );
  }
}
