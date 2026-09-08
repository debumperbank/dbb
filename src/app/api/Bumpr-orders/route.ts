import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { createClient } from '@/lib/supabase/server';

interface OrderItemInput {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      address_line,
      postal_code,
      city,
      country,
      notes,
      items,
      company, // honeypot
    } = body ?? {};

    // Honeypot: same pattern as /api/inquiries — pretend success so a
    // bot doesn't learn to skip the field next time.
    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !address_line || !postal_code || !city) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Winkelmandje is leeg.' },
        { status: 400 }
      );
    }

    const cartItems = items as OrderItemInput[];
    const amountCents = cartItems.reduce(
      (sum, i) => sum + i.unitPriceCents * i.quantity,
      0
    );

    const supabase = await createClient();

    // 1. Order aanmaken
    const { data: order, error: orderError } = await (supabase
      .from('bumpr_orders') as any)
      .insert({
        name,
        email,
        phone: phone || null,
        address_line,
        postal_code,
        city,
        country: country || 'NL',
        notes: notes || null,
        amount_cents: amountCents,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Failed to save bumpr order:', orderError?.message);
      return NextResponse.json(
        { error: 'Kon bestelling niet opslaan.' },
        { status: 500 }
      );
    }

    // 2. Order items aanmaken
    const { error: itemsError } = await (supabase
      .from('bumpr_order_items') as any)
      .insert(
        cartItems.map((i) => ({
          order_id: order.id,
          product_id: i.productId,
          product_name: i.name,
          quantity: i.quantity,
          unit_price_cents: i.unitPriceCents,
        }))
      );

    if (itemsError) {
      console.error('Failed to save bumpr order items:', itemsError.message);
      return NextResponse.json(
        { error: 'Kon bestelling niet volledig opslaan.' },
        { status: 500 }
      );
    }

    // 3. E-mail versturen — alleen als er een API-key geconfigureerd is.
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const itemLines = cartItems
        .map(
          (i) =>
            `- ${i.quantity} x ${i.name} (${(i.unitPriceCents / 100).toFixed(2)} euro per stuk)`
        )
        .join('\n');

      const { error: emailError } = await resend.emails.send({
        from: 'Website <onboarding@resend.dev>',
        to: [process.env.NOTIFY_EMAIL || 'debumperbank@gmail.com'],
        replyTo: email,
        subject: `Nieuwe BUMPR bestelling van ${name}`,
        text: `
Nieuwe BUMPR bestelling via de website

Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || '-'}

Verzendadres:
${address_line}
${postal_code} ${city}
${country || 'NL'}

Producten:
${itemLines}

Totaal: ${(amountCents / 100).toFixed(2)} euro

Opmerkingen:
${notes || '-'}
        `.trim(),
      });

      if (emailError) {
        console.error('Failed to send order email:', emailError);
        // De bestelling staat wel in Supabase, ook als de mail mislukt.
        return NextResponse.json(
          {
            ok: true,
            orderId: order.id,
            warning: 'Bestelling opgeslagen, maar e-mail kon niet worden verzonden.',
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    console.error('Bumpr order request failed:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van de bestelling.' },
      { status: 500 }
    );
  }
}