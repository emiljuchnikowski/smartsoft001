import { SmartMediaObjectProps } from './media-object.types';
import { SmartMediaObjectStandard } from './standard/media-object-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-media-object>`: renders the implementation registered as
 * `components['media-object']` on `SmartProvider` (the Angular
 * `MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN`), `SmartMediaObjectStandard` by
 * default. Unlike the Angular outlet, the registered implementation also
 * receives `children`.
 */
export function SmartMediaObject(props: SmartMediaObjectProps) {
  const Component = useSmartComponent('media-object', SmartMediaObjectStandard);

  return <Component {...props} />;
}
