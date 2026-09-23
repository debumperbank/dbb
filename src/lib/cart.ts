export type CartItem = { id: string; quantity: number };
export function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const items = new Map<string, number>();
  for (const row of value.slice(0, 40)) {
    if (
      !row ||
      typeof row.id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(row.id) ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 1
    )
      continue;
    items.set(row.id, Math.min(20, (items.get(row.id) || 0) + row.quantity));
  }
  return Array.from(items, ([id, quantity]) => ({ id, quantity }));
}
