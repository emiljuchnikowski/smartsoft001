import { SmartContainerProps } from './container.types';
import { SmartContainerStandard } from './standard/container-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.container` on
 * `SmartProvider`, `SmartContainerStandard` by default.
 */
export function SmartContainer(props: SmartContainerProps) {
  const Component = useSmartComponent('container', SmartContainerStandard);

  return <Component {...props} />;
}
