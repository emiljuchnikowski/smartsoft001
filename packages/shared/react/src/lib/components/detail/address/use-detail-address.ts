import { IAddress } from '@smartsoft001/domain-core';

import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/**
 * The address an address detail shows, `null` without one, and its
 * `building[/flat]` part.
 */
export function useDetailAddress<T>(props: SmartDetailFieldProps<T>) {
  const { item, key, value } = useDetail(props);
  const address: Partial<IAddress> | null =
    item && key ? (value ?? null) : null;
  const building = address?.flatNumber
    ? address?.buildingNumber + '/' + address?.flatNumber
    : address?.buildingNumber;

  return { address, building };
}
