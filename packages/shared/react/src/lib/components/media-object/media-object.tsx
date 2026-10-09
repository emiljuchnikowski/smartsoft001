import { SmartMediaObjectProps } from './media-object.types';
import { SmartMediaObjectStandard } from './standard/media-object-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['media-object']` on
 * `SmartProvider`, `SmartMediaObjectStandard` by default. The registered
 * implementation also receives `children`.
 */
export function SmartMediaObject(props: SmartMediaObjectProps) {
  const Component = useSmartComponent('media-object', SmartMediaObjectStandard);

  return <Component {...props} />;
}
