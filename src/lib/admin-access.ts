// Only the owner-confirmed, verified account may access the back office.
export function isAdminUser(user: { email?: string; email_confirmed_at?: string } | null | undefined): boolean {
  return Boolean(user?.email_confirmed_at && user.email?.toLowerCase() === "debumperbank@gmail.com");
}
