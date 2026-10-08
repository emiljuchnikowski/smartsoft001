import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetailPdf } from './use-detail-pdf';

/** `<smart-detail-pdf>` (`DetailPdfComponent`): a button opening the file. */
export function SmartDetailPdf<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const { item, key, show } = useDetailPdf(props);

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
      onClick={show}
    >
      {t('show')}
    </button>
  );
}
