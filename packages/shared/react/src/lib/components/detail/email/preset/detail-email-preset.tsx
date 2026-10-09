import { cn } from '../../../../utils/class-names';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetail } from '../../use-detail';

/**
 * Styled email detail (preset): a blue `mailto:` link with an envelope icon.
 */
export function SmartDetailEmailPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value } = useDetail(props);

  if (!item || !key) return null;

  return (
    <a
      data-role="link"
      className={cn(
        [
          'smart:inline-flex',
          'smart:items-center',
          'smart:gap-x-1.5',
          'smart:text-sm',
          'smart:text-blue-600',
          'smart:hover:underline',
          'smart:dark:text-blue-400',
        ],
        className,
      )}
      href={'mailto:' + value}
    >
      <svg
        data-role="icon"
        className="smart:size-4 smart:shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        />
      </svg>
      {value}
    </a>
  );
}
