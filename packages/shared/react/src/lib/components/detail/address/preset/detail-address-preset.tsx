import { cn } from '../../../../utils/class-names';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetailAddress } from '../use-detail-address';

/**
 * Styled address detail (preset): the address next to a map-pin icon.
 */
export function SmartDetailAddressPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { address, building } = useDetailAddress(props);

  if (!address) return null;

  return (
    <div
      data-role="address"
      className={cn(
        ['smart:flex', 'smart:items-start', 'smart:gap-x-2'],
        className,
      )}
    >
      <svg
        data-role="icon"
        className="smart:mt-0.5 smart:size-4 smart:shrink-0 smart:text-gray-400 smart:dark:text-gray-500"
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
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
      <p className="smart:text-sm smart:text-gray-900 smart:dark:text-gray-100">
        {address.street} {building}
        <br />
        {address.zipCode} {address.city}
      </p>
    </div>
  );
}
