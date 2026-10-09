import { SmartListContainerProps } from './list-container.types';
import { SmartListContainerStandard } from './standard/list-container-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['list-container']` on
 * `SmartProvider`, `SmartListContainerStandard` by default. The registered
 * implementation also receives `children`.
 */
export function SmartListContainer(props: SmartListContainerProps) {
  const Component = useSmartComponent(
    'list-container',
    SmartListContainerStandard,
  );

  return <Component {...props} />;
}
