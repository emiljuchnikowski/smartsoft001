import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/** The date range detail: `start – end`. */
export function SmartDetailDateRange<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value: range } = useDetail(props);

  if (!item || !key || !range) return null;

  return (
    <p
      className={cn(
        ['smart:text-sm', 'smart:text-gray-900', 'smart:dark:text-gray-100'],
        className,
      )}
    >
      {range.start} – {range.end}
    </p>
  );
}
