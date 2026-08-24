import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, message, listing_id } = body ?? {};

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Naam en e-mail zijn verplicht.' },
        { status: 400 }
      );
    }

    // 1. Opslaan in Supabase
    const supabase = createClient();

    const { error } = await (supabase
      .from('inquiries') as any)
      .insert({
        name,
        email,
        phone: phone || null,
        message: message || null,
        listing_id: listing_id || null,
      });

    if (error) {
      console.error('Failed to save inquiry:', error.message);

      return NextResponse.json(
        { error: 'Kon bericht niet opslaan.' },
        { status: 500 }
      );
    }

    // 2. E-mail versturen — alleen als er een API-key geconfigureerd is.
    // De client wordt hier, ter plekke, aangemaakt (niet bovenaan het
    // bestand) zodat een ontbrekende RESEND_API_KEY nooit de build breekt,
    // enkel deze e-mailstap overslaat.
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { error: emailError } = await resend.emails.send({
        from: 'Website <onboarding@resend.dev>',
        to: [process.env.NOTIFY_EMAIL || 'debumperbank@gmail.com'],
        replyTo: email,
        subject: `Nieuwe aanvraag van ${name}`,
        text: `
Nieuwe aanvraag via de website

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}
Listing ID: ${listing_id || '-'}

Bericht:
${message || '-'}
        `.trim(),
      });

      if (emailError) {
        console.error('Failed to send inquiry email:', emailError);

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
    console.error('Inquiry request failed:', error);

    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van het bericht.' },
      { status: 500 }
    );
  }
}
