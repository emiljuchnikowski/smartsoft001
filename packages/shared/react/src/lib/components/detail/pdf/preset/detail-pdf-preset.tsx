import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetailPdf } from '../use-detail-pdf';

/**
 * Styled PDF detail (preset): a chip with a document icon, the file name and a
 * `show` button.
 */
export function SmartDetailPdfPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const { item, key, fileName, show } = useDetailPdf(props);

  if (!item || !key) return null;

  return (
    <span
      className={cn(
        [
          'smart:inline-flex',
          'smart:items-center',
          'smart:gap-x-3',
          'smart:p-3',
          'smart:bg-white',
          'smart:dark:bg-gray-800',
          'smart:border',
          'smart:border-gray-200',
          'smart:dark:border-gray-700',
          'smart:rounded-lg',
        ],
        className,
      )}
      data-role="chip"
    >
      <svg
        className="smart:shrink-0 smart:size-5 smart:text-red-500 smart:dark:text-red-400"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M9 15h6" />
        <path d="M9 18h6" />
      </svg>
      {fileName && (
        <span
          data-role="name"
          className="smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white smart:truncate"
        >
          {fileName}
        </span>
      )}
      <button
        type="button"
        data-role="show"
        className="smart:inline-flex smart:items-center smart:gap-x-1 smart:text-sm smart:font-medium smart:text-gray-500 smart:hover:text-blue-600 smart:dark:text-gray-400 smart:dark:hover:text-blue-400 smart:focus:outline-hidden"
        onClick={show}
      >
        {t('show')}
      </button>
    </span>
  );
}
