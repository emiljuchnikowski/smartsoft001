import { SmartLoaderProps } from './loader.types';
import { SmartLoaderStandard } from './standard/loader-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-loader>`: renders the implementation registered as
 * `components.loader` on `SmartProvider` (the Angular
 * `LOADER_STANDARD_COMPONENT_TOKEN`), `SmartLoaderStandard` by default.
 */
export function SmartLoader(props: SmartLoaderProps) {
  const Component = useSmartComponent('loader', SmartLoaderStandard);

  return <Component {...props} />;
}
