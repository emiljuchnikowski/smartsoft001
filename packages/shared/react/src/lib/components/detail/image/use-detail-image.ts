import { useFileUrl } from '../../../utils/hooks';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/**
 * The image detail's logic: the `FileService` URL of the file in the field,
 * `null` without one.
 */
export function useDetailImage<T>(props: SmartDetailFieldProps<T>) {
  const { value } = useDetail(props);
  const url = useFileUrl(value);

  return { imageUrl: url || null };
}
