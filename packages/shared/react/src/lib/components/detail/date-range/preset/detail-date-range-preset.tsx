import { cn } from '../../../../utils/class-names';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetail } from '../../use-detail';

const CHIP_CLASSES = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:rounded-md',
  'smart:bg-gray-100',
  'smart:px-2',
  'smart:py-0.5',
  'smart:text-xs',
  'smart:font-medium',
  'smart:text-gray-800',
  'smart:dark:bg-gray-500/20',
  'smart:dark:text-gray-300',
].join(' ');

/**
 * Styled date range detail (preset): the start and the end as two chips.
 */
export function SmartDetailDateRangePreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value: range } = useDetail(props);

  if (!item || !key || !range) return null;

  return (
    <div
      data-role="range"
      className={cn(
        ['smart:inline-flex', 'smart:items-center', 'smart:gap-x-2'],
        className,
      )}
    >
      <span data-role="start" className={CHIP_CLASSES}>
        {range.start}
      </span>
      <span
        data-role="sep"
        className="smart:text-sm smart:text-gray-400 smart:dark:text-gray-500"
      >
        –
      </span>
      <span data-role="end" className={CHIP_CLASSES}>
        {range.end}
      </span>
    </div>
  );
}
