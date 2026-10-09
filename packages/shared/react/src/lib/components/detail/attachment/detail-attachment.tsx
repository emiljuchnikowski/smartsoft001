import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetailAttachment } from './use-detail-attachment';

/** The attachment detail: a download button. */
export function SmartDetailAttachment<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const { item, key, download } = useDetailAttachment(props);

  if (!item || !key) return null;

  return (
    <button
      type="button"
      className={cn(
        [
          'smart:inline-flex',
          'smart:items-center',
          'smart:rounded-md',
          'smart:bg-indigo-600',
          'smart:px-3',
          'smart:py-2',
          'smart:text-sm',
          'smart:font-semibold',
          'smart:text-white',
          'smart:shadow-sm',
          'smart:hover:bg-indigo-500',
          'smart:dark:bg-indigo-500',
          'smart:dark:hover:bg-indigo-400',
        ],
        className,
      )}
      onClick={download}
    >
      {t('download')}
    </button>
  );
}
