/**
 * The value of a number `<input>` the way Angular's `NumberValueAccessor`
 * reads it: an empty field is `null`, anything else goes through
 * `parseFloat`. Shared by the int, ints, float and currency fields.
 */
export function toNumberValue(raw: string): number | null {
  return raw === '' ? null : parseFloat(raw);
}
