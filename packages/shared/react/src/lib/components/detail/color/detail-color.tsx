import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/** The colour detail: a bar filled with the colour. */
export function SmartDetailColor<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value } = useDetail(props);

  if (!item || !key) return null;

  return (
    <div
      className={cn(
        [
          'smart:h-8',
          'smart:w-full',
          'smart:rounded',
          'smart:border',
          'smart:border-gray-200',
          'smart:dark:border-white/10',
        ],
        className,
      )}
      style={{ backgroundColor: value }}
    />
  );
}
