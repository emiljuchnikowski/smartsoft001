import { useSmartComponent } from '../../providers/hooks';
import { SmartStatsStandard } from './standard/stats-standard';
import { SmartStatsProps } from './stats.types';

/**
 * Renders the implementation registered as `components.stats` on
 * `SmartProvider`, `SmartStatsStandard` by default.
 */
export function SmartStats(props: SmartStatsProps) {
  const Component = useSmartComponent('stats', SmartStatsStandard);

  return <Component {...props} />;
}
