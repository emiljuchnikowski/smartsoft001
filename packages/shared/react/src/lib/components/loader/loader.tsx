import { SmartLoaderProps } from './loader.types';
import { SmartLoaderStandard } from './standard/loader-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.loader` on
 * `SmartProvider`, `SmartLoaderStandard` by default.
 */
export function SmartLoader(props: SmartLoaderProps) {
  const Component = useSmartComponent('loader', SmartLoaderStandard);

  return <Component {...props} />;
}
