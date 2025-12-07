export function capitalize(val: string): string {
  if (!val?.length) return '';

  return val[0].toUpperCase() + val.substring(1);
}
