import { useFileService } from '../../../providers/hooks';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/**
 * The attachment detail's logic (the Angular `DetailAttachmentComponent`):
 * `download()` opens the file through the `FileService`; `fileName` is the
 * file's `fileName` or `name` (`DetailAttachmentPresetComponent`), `null`
 * without either.
 */
export function useDetailAttachment<T>(props: SmartDetailFieldProps<T>) {
  const fileService = useFileService();
  const { item, key, value } = useDetail(props);

  return {
    item,
    key,
    fileName: (value?.fileName ?? value?.name ?? null) as string | null,
    download: () => fileService?.download(value.id),
  };
}
