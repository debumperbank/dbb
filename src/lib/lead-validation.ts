export function validLead(body: unknown): boolean {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  const b = body as Record<string, unknown>;
  for (const [key, max] of Object.entries({ name: 120, email: 254, phone: 40, address: 500, message: 5000, notes: 5000, service_type: 120, requested_date: 10, listing_id: 36 })) {
    const value = b[key];
    if (value != null && (typeof value !== "string" || value.length > max)) return false;
  }
  if (typeof b.name !== "string" || !b.name.trim() || /[\r\n]/.test(b.name)) return false;
  if (typeof b.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return false;
  if (b.listing_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(b.listing_id))) return false;
  if (b.requested_date && (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.requested_date)) || !Number.isFinite(Date.parse(String(b.requested_date))))) return false;
  return true;
}
