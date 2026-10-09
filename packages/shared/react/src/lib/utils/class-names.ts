/**
 * Joins class names, skipping empty values. The components build their
 * Tailwind classes from arrays of explicit literals, never from template
 * strings, so the class scanner finds every one.
 */
export function cn(
  ...values: Array<
    string | false | null | undefined | Array<string | false | null | undefined>
  >
): string {
  const result: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (Array.isArray(value)) {
      for (const item of value) if (item) result.push(item);
    } else {
      result.push(value);
    }
  }

  return result.join(' ');
}
