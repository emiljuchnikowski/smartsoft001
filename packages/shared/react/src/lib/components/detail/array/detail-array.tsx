import { cn } from '../../../utils/class-names';
import { SmartDetails } from '../../details/details';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetailArray } from './use-detail-array';

/**
 * The array detail: the details of every element, each rendered through
 * `<SmartDetails>`.
 */
export function SmartDetailArray<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { childOptions } = useDetailArray(props);

  if (!childOptions.length) return null;

  return (
    <div
      className={cn(
        ['smart:mt-2', 'smart:block', 'smart:space-y-2', 'smart:w-full'],
        className,
      )}
    >
      {childOptions.map((opt, index) => (
        <SmartDetails key={index} options={opt} />
      ))}
    </div>
  );
}
