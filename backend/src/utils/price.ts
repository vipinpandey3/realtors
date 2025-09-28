export function parseTokenToINR(token: string): number | null {
  const t = token.trim().toUpperCase();
  const num = parseFloat(t.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(num)) return null;
  if (/(CR|CRORE)/.test(t)) return Math.round(num * 1e7);
  if (/(L|LAKH)/.test(t)) return Math.round(num * 1e5);
  if (/(K)/.test(t)) return Math.round(num * 1e3);
  return Math.round(num); // plain INR
}

export function parseRange(text?: string | null): {
  min?: number;
  max?: number;
} {
  if (!text) return {};
  const parts = text.split(/[-–—]/);
  if (parts.length === 1) {
    const v = parseTokenToINR(parts[0]);
    return v ? { min: v, max: v } : {};
  }
  const a = parseTokenToINR(parts[0]);
  const b = parseTokenToINR(parts[1]);
  const min = a && b ? Math.min(a, b) : a ?? b ?? undefined;
  const max = a && b ? Math.max(a, b) : a ?? b ?? undefined;
  return { min, max };
}
