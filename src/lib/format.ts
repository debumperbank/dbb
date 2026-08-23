export function formatPriceCents(cents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatMileage(km: number | null): string {
  if (km == null) return '—';
  return `${new Intl.NumberFormat('nl-NL').format(km)} km`;
}
