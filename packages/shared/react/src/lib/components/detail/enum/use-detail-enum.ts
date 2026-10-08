import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/**
 * The values an enum detail lists (the Angular `DetailEnumComponent.getValues`):
 * the field's value, or each of its values when it is an array, as strings.
 */
export function useDetailEnum<T>(props: SmartDetailFieldProps<T>) {
  const detail = useDetail(props);
  const value = detail.value ?? [];

  return {
    ...detail,
    values: (Array.isArray(value) ? value : [value]).map((v) => String(v)),
  };
}
