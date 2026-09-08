'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitBumprOrder(orderData: {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: { id: string; name: string; quantity: number; price_cents: number }[];
}) {
  const { name, email, phone, address, items } = orderData;

  // Alleen items met aantal > 0 verwerken
  const selectedItems = items.filter((item) => item.quantity > 0);

  if (selectedItems.length === 0) {
    return { error: 'Kies minimaal 1 product om te bestellen.' };
  }

  if (!name || !email) {
    return { error: 'Vul je naam en e-mailadres in.' };
  }

  const totalPriceCents = selectedItems.reduce(
    (sum, item) => sum + item.price_cents * item.quantity,
    0
  );

  const supabase = createAdminClient();

  // 1. Bestelling opslaan in Supabase database
  const { error: dbError } = await supabase.from('inquiries').insert([
    {
      name,
      email,
      phone,
      message: `BUMPR Bestelling:\n${selectedItems
        .map((i) => `- ${i.name} (${i.quantity}x)`)
        .join('\n')}\n\nAdres: ${address}\nTotaal: €${(totalPriceCents / 100).toFixed(2)}`,
      status: 'new',
    },
  ]);

  if (dbError) {
    console.error('Database error:', dbError);
    return { error: 'Er is een fout opgetreden bij het verwerken van de bestelling.' };
  }

  // 2. E-mail sturen naar beheerder en klant
  try {
    const itemsHtml = selectedItems
      .map(
        (i) =>
          `<li><strong>${i.name}</strong> - ${i.quantity}x (€${((i.price_cents * i.quantity) / 100).toFixed(2)})</li>`
      )
      .join('');

    await resend.emails.send({
      from: 'De Bumperbank <info@debumperbank.nl>',
      to: [process.env.ADMIN_EMAIL || 'info@debumperbank.nl', email],
      subject: `Nieuwe BUMPR Bestelling van ${name}`,
      html: `
        <h2>Nieuwe BUMPR Bestelling</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefoon:</strong> ${phone}</p>
        <p><strong>Adres:</strong> ${address}</p>
        <h3>Bestelde producten:</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Totaalbedrag:</strong> €${(totalPriceCents / 100).toFixed(2)}</p>
      `,
    });
  } catch (emailError) {
    console.error('Email error:', emailError);
  }

  return { success: true };
}