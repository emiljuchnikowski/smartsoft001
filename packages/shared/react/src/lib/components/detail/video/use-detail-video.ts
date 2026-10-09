import { useFileUrl } from '../../../utils/hooks';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/**
 * The video detail's logic: the `FileService` URL of the file in the field,
 * `null` without one.
 */
export function useDetailVideo<T>(props: SmartDetailFieldProps<T>) {
  const { item, key, value } = useDetail(props);
  const url = useFileUrl(value);

  return { item, key, url: url || null };
}
