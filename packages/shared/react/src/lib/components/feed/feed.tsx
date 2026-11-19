import { useSmartComponent } from '../../providers/hooks';
import { SmartFeedProps } from './feed.types';
import { SmartFeedStandard } from './standard/feed-standard';

/**
 * Renders the implementation registered as `components.feed` on
 * `SmartProvider`, `SmartFeedStandard` by default.
 */
export function SmartFeed(props: SmartFeedProps) {
  const Component = useSmartComponent('feed', SmartFeedStandard);

  return <Component {...props} />;
}
