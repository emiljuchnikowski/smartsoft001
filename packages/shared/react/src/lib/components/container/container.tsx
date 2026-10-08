import { SmartContainerProps } from './container.types';
import { SmartContainerStandard } from './standard/container-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-container>`: renders the implementation registered as
 * `components.container` on `SmartProvider` (the Angular
 * `CONTAINER_STANDARD_COMPONENT_TOKEN`), `SmartContainerStandard` by default.
 */
export function SmartContainer(props: SmartContainerProps) {
  const Component = useSmartComponent('container', SmartContainerStandard);

  return <Component {...props} />;
}
