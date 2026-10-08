import { IEntity } from '@smartsoft001/domain-core';

import { SmartDetailsProps } from './details.types';
import { SmartDetailsStandard } from './standard/details-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.details` on
 * `SmartProvider`, `SmartDetailsStandard` by default. The object and array
 * details render nested objects through it too.
 */
export function SmartDetails<T extends IEntity<string>>(
  props: SmartDetailsProps<T>,
) {
  const Component = useSmartComponent<SmartDetailsProps<T>>(
    'details',
    SmartDetailsStandard,
  );

  return <Component {...props} />;
}
