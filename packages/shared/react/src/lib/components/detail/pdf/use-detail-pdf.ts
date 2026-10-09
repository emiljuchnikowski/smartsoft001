import { useFileService } from '../../../providers/hooks';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/**
 * The PDF detail's logic: `show()` opens the file through the `FileService`;
 * `fileName` is the file's `fileName` or `name` (shown by
 * `SmartDetailPdfPreset`), `null` without either.
 */
export function useDetailPdf<T>(props: SmartDetailFieldProps<T>) {
  const fileService = useFileService();
  const { item, key, value } = useDetail(props);

  return {
    item,
    key,
    fileName: (value?.fileName ?? value?.name ?? null) as string | null,
    show: () => fileService?.download(value.id),
  };
}
