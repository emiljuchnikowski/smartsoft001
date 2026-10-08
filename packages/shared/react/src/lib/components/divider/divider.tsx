import { SmartDividerProps } from './divider.types';
import { SmartDividerStandard } from './standard/divider-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.divider` on
 * `SmartProvider`, `SmartDividerStandard` by default.
 */
export function SmartDivider(props: SmartDividerProps) {
  const Component = useSmartComponent('divider', SmartDividerStandard);

  return <Component {...props} />;
}
