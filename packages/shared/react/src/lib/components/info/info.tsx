import { useSmartComponent } from '../../providers/hooks';
import { SmartInfoProps } from './info.types';
import { SmartInfoStandard } from './standard/info-standard';

/**
 * Renders the implementation registered as `components.info` on
 * `SmartProvider`, `SmartInfoStandard` by default.
 */
export function SmartInfo(props: SmartInfoProps) {
  const Component = useSmartComponent('info', SmartInfoStandard);

  return <Component {...props} />;
}
