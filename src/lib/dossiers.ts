export function normalizeRegistration(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function normalizeDossierNumber(value: string): string | null {
  const digits = value.trim().toUpperCase().replace(/^DBB[ -]*/, "");
  if (!/^[0-9]{1,19}$/.test(digits) || /^0+$/.test(digits)) return null;
  return `DBB-${digits.replace(/^0+/, "").padStart(6, "0")}`;
}
