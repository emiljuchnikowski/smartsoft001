import { useSmartComponent } from '../../providers/hooks';
import { SmartProgressBarsProps } from './progress-bars.types';
import { SmartProgressBarsStandard } from './standard/progress-bars-standard';

/**
 * Renders the implementation registered as `components['progress-bars']` on
 * `SmartProvider`, `SmartProgressBarsStandard` by default.
 */
export function SmartProgressBars(props: SmartProgressBarsProps) {
  const Component = useSmartComponent(
    'progress-bars',
    SmartProgressBarsStandard,
  );

  return <Component {...props} />;
}
