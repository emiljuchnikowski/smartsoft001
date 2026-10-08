import { SmartStatsStandard } from './standard/stats-standard';
import { SmartStatsProps } from './stats.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-stats>`: renders the implementation registered as
 * `components.stats` on `SmartProvider` (the Angular
 * `STATS_STANDARD_COMPONENT_TOKEN`), `SmartStatsStandard` by default.
 */
export function SmartStats(props: SmartStatsProps) {
  const Component = useSmartComponent('stats', SmartStatsStandard);

  return <Component {...props} />;
}
