import { SmartProgressBarsProps } from './progress-bars.types';
import { SmartProgressBarsStandard } from './standard/progress-bars-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-progress-bars>`: renders the implementation registered as
 * `components['progress-bars']` on `SmartProvider` (the Angular
 * `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN`), `SmartProgressBarsStandard` by
 * default.
 */
export function SmartProgressBars(props: SmartProgressBarsProps) {
  const Component = useSmartComponent(
    'progress-bars',
    SmartProgressBarsStandard,
  );

  return <Component {...props} />;
}
