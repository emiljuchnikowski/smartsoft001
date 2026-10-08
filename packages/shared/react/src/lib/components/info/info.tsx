import { SmartInfoProps } from './info.types';
import { SmartInfoStandard } from './standard/info-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-info>`: renders the implementation registered as `components.info`
 * on `SmartProvider` (the Angular `INFO_STANDARD_COMPONENT_TOKEN`),
 * `SmartInfoStandard` by default.
 */
export function SmartInfo(props: SmartInfoProps) {
  const Component = useSmartComponent('info', SmartInfoStandard);

  return <Component {...props} />;
}
