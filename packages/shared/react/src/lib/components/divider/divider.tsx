import { SmartDividerProps } from './divider.types';
import { SmartDividerStandard } from './standard/divider-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-divider>`: renders the implementation registered as
 * `components.divider` on `SmartProvider` (the Angular
 * `DIVIDER_STANDARD_COMPONENT_TOKEN`), `SmartDividerStandard` by default.
 */
export function SmartDivider(props: SmartDividerProps) {
  const Component = useSmartComponent('divider', SmartDividerStandard);

  return <Component {...props} />;
}
