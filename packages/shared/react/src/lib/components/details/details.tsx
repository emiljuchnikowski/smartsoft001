import { IEntity } from '@smartsoft001/domain-core';

import { SmartDetailsProps } from './details.types';
import { SmartDetailsStandard } from './standard/details-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-details>`: renders the implementation registered as
 * `components.details` on `SmartProvider` (the Angular
 * `DETAILS_STANDARD_COMPONENT_TOKEN`), `SmartDetailsStandard` by default.
 * The object and array details render nested objects through it too (the
 * Angular `DETAILS_COMPONENT_TOKEN`).
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
