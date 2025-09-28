export function page(limit?: number, offset?: number) {
  const l = Math.min(Math.max(limit ?? 20, 1), 100);
  const o = Math.max(offset ?? 0, 0);
  return { limit: l, offset: o };
}
