import { Resend } from "resend";

// Construct only inside the request so missing configuration never breaks builds.
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

// Await delivery to the provider; notification failures must never undo a saved request.
export async function notifyAdmin(
  subject: string,
  text: string,
  options: { replyTo?: string; idempotencyKey?: string } = {},
): Promise<boolean> {
  try {
    const resend = getResendClient();
    const to = process.env.NOTIFY_EMAIL;
    const from =
      process.env.NOTIFY_FROM_EMAIL || "De Bumperbank <onboarding@resend.dev>";
    if (!resend || !to) {
      console.warn(
        "Admin notification skipped: configure RESEND_API_KEY and NOTIFY_EMAIL.",
      );
      return false;
    }
    const { error } = await resend.emails.send(
      { from, to, subject, text, replyTo: options.replyTo },
      options.idempotencyKey
        ? { idempotencyKey: options.idempotencyKey }
        : undefined,
    );
    if (error) {
      // Avoid logging the message content or customer details.
      console.error("Admin notification rejected by Resend:", error.name);
      return false;
    }
    return true;
  } catch {
    console.error(
      "Admin notification could not be sent. The request remains saved.",
    );
    return false;
  }
}
