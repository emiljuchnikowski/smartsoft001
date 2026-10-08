import { SmartFeedProps } from './feed.types';
import { SmartFeedStandard } from './standard/feed-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-feed>`: renders the implementation registered as `components.feed`
 * on `SmartProvider` (the Angular `FEED_STANDARD_COMPONENT_TOKEN`),
 * `SmartFeedStandard` by default.
 */
export function SmartFeed(props: SmartFeedProps) {
  const Component = useSmartComponent('feed', SmartFeedStandard);

  return <Component {...props} />;
}
