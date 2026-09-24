import { NextResponse } from 'next/server';
import { notifyAdmin } from '@/lib/resend';

import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, message, listing_id, company, consent } = body ?? {};

    // Honeypot: a real visitor never fills this field in (it's hidden via
    // CSS). A bot that blindly fills every field will. Pretend success so
    // it doesn't learn to skip the field next time.
    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Naam en e-mail zijn verplicht.' },
        { status: 400 }
      );
    }

    // The checkbox is `required` in the browser, but that only stops a
    // person using the form — not a direct POST to this endpoint. Enforce
    // it server-side too.
    if (consent !== true && consent !== "on") {
      return NextResponse.json(
        { error: 'Je moet akkoord gaan met de Algemene Voorwaarden en het Privacybeleid.' },
        { status: 400 }
      );
    }

    // 1. Opslaan in Supabase
    const supabase = await createClient();

    const { error } = await (supabase
      .from('inquiries') as any)
      .insert({
        name,
        email,
        phone: phone || null,
        message: message || null,
        listing_id: listing_id || null,
        consent_given: true,
        consent_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to save inquiry:', error.message);

      return NextResponse.json(
        { error: 'Kon bericht niet opslaan.' },
        { status: 500 }
      );
    }

    // A notification failure must not turn a saved request into a failed submission.
    const notified = await notifyAdmin(`Nieuwe aanvraag van ${name}`, `
Nieuwe aanvraag via de website

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}
Listing ID: ${listing_id || '-'}

Bericht:
${message || '-'}
        `.trim(), { replyTo: email });
    if (!notified) {
      return NextResponse.json({
        ok: true,
        warning: 'Aanvraag opgeslagen, maar e-mail kon niet worden verzonden.',
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Inquiry request failed:', error);

    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van het bericht.' },
      { status: 500 }
    );
  }
}
