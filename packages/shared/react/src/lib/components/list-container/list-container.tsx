import { SmartListContainerProps } from './list-container.types';
import { SmartListContainerStandard } from './standard/list-container-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-list-container>`: renders the implementation registered as
 * `components['list-container']` on `SmartProvider` (the Angular
 * `LIST_CONTAINER_STANDARD_COMPONENT_TOKEN`), `SmartListContainerStandard` by
 * default. Unlike the Angular outlet, the registered implementation also
 * receives `children`.
 */
export function SmartListContainer(props: SmartListContainerProps) {
  const Component = useSmartComponent(
    'list-container',
    SmartListContainerStandard,
  );

  return <Component {...props} />;
}
