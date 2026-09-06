import { Resend } from 'resend';

// Lazy on purpose: constructing this at module scope (e.g. `const resend =
// new Resend(process.env.RESEND_API_KEY)` at the top of a route file)
// crashes the build the moment RESEND_API_KEY is unset, because Next.js
// evaluates route modules while collecting page data. Calling this inside
// a request handler instead means it only runs when a request actually
// comes in, and only if a key is configured.
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

// Fire-and-forget notification helper: logs and swallows any failure so a
// broken or missing email setup never blocks the actual form submission.
export async function notifyAdmin(subject: string, text: string) {
  const resend = getResendClient();
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL ?? 'De Bumperbank <onboarding@resend.dev>';

  if (!resend || !to) return;

  try {
    await resend.emails.send({ from, to, subject, text });
  } catch (err) {
    console.error('Failed to send admin notification email:', err);
  }
}
