/**
 * Return a shallow copy of the object with all `undefined`-valued keys removed.
 * Used to build partial-update payloads so optional fields the client omitted are
 * not written as `undefined` (which would otherwise unset/ignore unpredictably).
 */
export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  }
  return result;
}
