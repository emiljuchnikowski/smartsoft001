import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/** `<smart-detail-email>` (`DetailEmailComponent`): a `mailto:` link. */
export function SmartDetailEmail<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value } = useDetail(props);

  if (!item || !key) return null;

  return (
    <a
      className={cn(
        [
          'smart:text-sm',
          'smart:text-indigo-600',
          'smart:underline',
          'smart:dark:text-indigo-400',
        ],
        className,
      )}
      href={'mailto:' + value}
    >
      {value}
    </a>
  );
}
