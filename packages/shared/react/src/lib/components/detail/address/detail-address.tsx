import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetailAddress } from './use-detail-address';

/**
 * `<smart-detail-address>` (`DetailAddressComponent`): street and
 * building/flat, then zip code and city on the next line.
 */
export function SmartDetailAddress<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { address, building } = useDetailAddress(props);

  if (!address) return null;

  return (
    <p
      className={cn(
        ['smart:text-sm', 'smart:text-gray-900', 'smart:dark:text-gray-100'],
        className,
      )}
    >
      {address.street} {building}
      <br />
      {address.zipCode} {address.city}
    </p>
  );
}
